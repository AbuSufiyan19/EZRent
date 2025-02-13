from flask import Flask, jsonify
import os
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# Load dataset
data_path = "recommendation_dataset.csv"
df = pd.read_csv(data_path)

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
    embedding_dim, l2_reg = 64, 0.0005
    
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
    dense1 = keras.layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(l2_reg))(concat)
    dense1 = keras.layers.Dropout(0.3)(dense1)
    dense2 = keras.layers.Dense(128, activation='relu', kernel_regularizer=keras.regularizers.l2(l2_reg))(dense1)
    dense2 = keras.layers.Dropout(0.2)(dense2)
    output = keras.layers.Dense(1, activation='linear')(dense2)
    
    model = keras.models.Model(inputs=[user_input, item_input, category_input], outputs=output)
    model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    
    early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test), callbacks=[early_stopping])
    
    test_loss, test_mae = model.evaluate(X_test, y_test)
    print(f"🔍 Test Loss: {test_loss:.4f}, Test MAE: {test_mae:.4f}")
    
    model.save(model_path)
    print("✅ Model saved successfully.")
    return model

def recommend_equipment(user_id, num_recommendations=10):
    if user_id not in reverse_user_mapping:
        print("⚠️ New User Detected! Recommending Top 10 Equipment.")
        top_equipment_encoded = df.groupby('equipmentId')['rating'].mean().nlargest(num_recommendations).index
        return [equipment_mapping[eid] for eid in top_equipment_encoded]
    
    encoded_user_id = reverse_user_mapping[user_id]
    user_array = np.full(len(df['equipmentId'].unique()), encoded_user_id)
    category_array = df[df['equipmentId'].isin(df['equipmentId'].unique())]['categoryId'].values[:len(df['equipmentId'].unique())]
    
    predictions = model.predict([user_array, df['equipmentId'].unique(), category_array])
    predictions = predictions * (max_rating - min_rating) + min_rating
    top_indices = np.argsort(-predictions.flatten())[:num_recommendations]
    return [equipment_mapping[df['equipmentId'].unique()[i]] for i in top_indices]

model = load_or_train_model()

@app.route('/')
def home():
    return "Welcome to the Equipment Recommendation API!"

@app.route('/recommend/<user_id>', methods=['GET'])
def recommend(user_id):
    recommendations = recommend_equipment(user_id)
    return jsonify({'recommended_equipment': recommendations})

@app.route('/retrain', methods=['POST'])
def retrain():
    global model
    model = train_model()
    return "✅ Model retrained successfully."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
