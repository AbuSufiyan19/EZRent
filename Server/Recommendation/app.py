from flask import Flask, jsonify, request  # type: ignore
import os
import pandas as pd # type: ignore
import numpy as np # type: ignore
import tensorflow as tf  # type: ignore
from flask_cors import CORS # type: ignore
from tensorflow import keras  # type: ignore
from sklearn.model_selection import train_test_split # type: ignore

app = Flask(__name__)
CORS(app)

# Load dataset efficiently
data_path = "recommendation_dataset.csv"

# Load dataset in chunks to avoid memory issues
chunks = pd.read_csv(data_path, chunksize=10_000, low_memory=True)
df = pd.concat(chunks)

# Normalize Ratings
min_rating, max_rating = df['rating'].min(), df['rating'].max()
df['rating'] = (df['rating'] - min_rating) / (max_rating - min_rating)

# Filter users & equipment with at least 3 ratings
df = df[df.groupby('userId')['userId'].transform('count') > 3]
df = df[df.groupby('equipmentId')['equipmentId'].transform('count') > 3]

# Encode userId and equipmentId
df['userId'] = df['userId'].astype("category")
user_mapping = dict(enumerate(df['userId'].cat.categories))
reverse_user_mapping = {v: k for k, v in user_mapping.items()}
df['userId'] = df['userId'].cat.codes

df['equipmentId'] = df['equipmentId'].astype("category")
equipment_mapping = dict(enumerate(df['equipmentId'].cat.categories))
reverse_equipment_mapping = {v: k for k, v in equipment_mapping.items()}
df['equipmentId'] = df['equipmentId'].cat.codes

df['categoryId'] = df['categoryId'].astype("category").cat.codes

# Train-Test Split
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
X_train = [train_df['userId'].values, train_df['equipmentId'].values, train_df['categoryId'].values]
y_train = train_df['rating'].values
X_test = [test_df['userId'].values, test_df['equipmentId'].values, test_df['categoryId'].values]
y_test = test_df['rating'].values

# Model Path
model_path = "equipment_recommendation_model.h5"

def load_or_train_model():
    if os.path.exists(model_path):
        print("✅ Loading trained model...")
        model = keras.models.load_model(model_path, compile=False)
        model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    else:
        print("🔄 Training new model...")
        model = train_model()
    return model

def train_model():
    embedding_dim, l2_reg = 32, 0.0005  # Reduced embedding size
    
    def create_embedding(input_dim, name):
        input_layer = keras.layers.Input(shape=(1,), name=f"{name}_input")
        embedding = keras.layers.Embedding(
            input_dim, embedding_dim, embeddings_regularizer=keras.regularizers.l2(l2_reg),
            embeddings_initializer='he_normal'
        )(input_layer)
        return input_layer, keras.layers.Flatten()(embedding)
    
    user_input, user_embedding = create_embedding(df['userId'].nunique(), "user")
    item_input, item_embedding = create_embedding(df['equipmentId'].nunique(), "equipment")
    category_input, category_embedding = create_embedding(df['categoryId'].nunique(), "category")
    
    concat = keras.layers.Concatenate()([user_embedding, item_embedding, category_embedding])
    dense1 = keras.layers.Dense(128, activation='relu', kernel_regularizer=keras.regularizers.l2(l2_reg))(concat)  # Reduced from 256
    dense1 = keras.layers.Dropout(0.3)(dense1)
    dense2 = keras.layers.Dense(64, activation='relu', kernel_regularizer=keras.regularizers.l2(l2_reg))(dense1)  # Reduced from 128
    dense2 = keras.layers.Dropout(0.2)(dense2)
    output = keras.layers.Dense(1, activation='linear')(dense2)
    
    model = keras.models.Model(inputs=[user_input, item_input, category_input], outputs=output)
    model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    
    early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=30, batch_size=64, validation_data=(X_test, y_test), callbacks=[early_stopping])  # Increased batch size
    
    test_loss, test_mae = model.evaluate(X_test, y_test)
    print(f"🔍 Test Loss: {test_loss:.4f}, Test MAE: {test_mae:.4f}")
    
    model.save(model_path)
    print("✅ Model saved successfully.")
    return model

def recommend_equipment(user_id, clicked_equipment_id=None, num_recommendations=10):
    if user_id not in reverse_user_mapping:
        print("⚠️ New User Detected!")        
        if clicked_equipment_id is not None:
            print(f"🔍 User clicked on equipment {clicked_equipment_id}. Finding similar rentals...")

            # Step 1: Convert clicked_equipment_id to encoded format
            if clicked_equipment_id in reverse_equipment_mapping:
                encoded_equipment_id = reverse_equipment_mapping[clicked_equipment_id]
            else:
                print("⚠️ Clicked equipment ID not found in dataset.")
                return get_top_rated_equipment(num_recommendations)

            # print(f"🔄 Encoded Equipment ID: {encoded_equipment_id}")

            # Step 2: Find users who rented this equipment
            similar_users = df[df['equipmentId'] == encoded_equipment_id]['userId'].unique()
            # print(f"👥 Users who rented {clicked_equipment_id}: {similar_users}")

            # Step 3: Find what other equipment these users rented
            rented_equipment = df[(df['userId'].isin(similar_users)) & (df['equipmentId'] != encoded_equipment_id)]
            # print(f"🛠️ Other equipment rented by these users:\n{rented_equipment[['userId', 'equipmentId']]}")

            if rented_equipment.empty:
                # print("⚠️ No similar rentals found. Falling back to top-rated equipment.")
                return get_top_rated_equipment(num_recommendations)

            # Step 4: Rank equipment by rental count
            top_equipment_encoded = (
                rented_equipment.groupby('equipmentId')['rating']
                .count()
                .nlargest(num_recommendations)
                .index
            )

            # Step 5: Convert back to original equipment IDs before returning
            recommended_equipment_ids = [equipment_mapping[eid] for eid in top_equipment_encoded]
            # print(f"✅ Recommended equipment IDs for user: {recommended_equipment_ids}")

            return recommended_equipment_ids

        else:
            print("⚠️ No clicked equipment provided. Suggesting top-rated equipment.")
            return get_top_rated_equipment(num_recommendations)

    
    encoded_user_id = reverse_user_mapping[user_id]
    all_equipment_ids = df['equipmentId'].unique()
    category_array = df.loc[df['equipmentId'].isin(all_equipment_ids), 'categoryId'].values[:len(all_equipment_ids)]
    
    # Batch processing for prediction
    batch_size = 100
    predictions = []
    for i in range(0, len(all_equipment_ids), batch_size):
        batch = all_equipment_ids[i:i+batch_size]
        user_array = np.full(len(batch), encoded_user_id)
        pred = model.predict([user_array, batch, category_array[i:i+batch_size]], verbose=0)
        predictions.extend(pred.flatten())

    predictions = np.array(predictions) * (max_rating - min_rating) + min_rating
    top_indices = np.argsort(-predictions)[:num_recommendations]
    return [equipment_mapping[all_equipment_ids[i]] for i in top_indices]

model = load_or_train_model()

def get_top_rated_equipment(num_recommendations):
    """ Returns top-rated equipment when no user history is available. """
    top_equipment_encoded = df.groupby('equipmentId')['rating'].mean().nlargest(num_recommendations).index
    top_equipment_ids = [equipment_mapping[eid] for eid in top_equipment_encoded]
    # print(f"🏆 Returning top-rated equipment: {top_equipment_ids}")
    return top_equipment_ids


@app.route('/')
def home():
    return "Welcome to the Equipment Recommendation API!"

@app.route('/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    clicked_equipment_id = request.args.get('clicked_equipment_id')  # Now it remains a string
    recommendations = recommend_equipment(user_id, clicked_equipment_id=clicked_equipment_id)
    return jsonify({'recommended_equipment': recommendations})


@app.route('/retrain', methods=['POST'])
def retrain():
    global model
    model = train_model()
    return "✅ Model retrained successfully."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))
