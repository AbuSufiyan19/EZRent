import os
import pickle
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from surprise import SVDpp, Dataset, Reader
from surprise.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Initialize Flask App
app = Flask(__name__)

# Paths
DATA_PATH = "equipment_ratings_expanded.csv"
MODEL_PATH = "svdpp_recommendation_model.pkl"

# Load Dataset
df = pd.read_csv(DATA_PATH)

# Preprocessing
scaler = MinMaxScaler(feature_range=(1, 5))
df['rating'] = scaler.fit_transform(df[['rating']])

user_encoder = LabelEncoder()
equipment_encoder = LabelEncoder()
df['userId'] = user_encoder.fit_transform(df['userId'])
df['equipmentId'] = equipment_encoder.fit_transform(df['equipmentId'])

# Save mappings
user_mapping = dict(zip(user_encoder.classes_, user_encoder.transform(user_encoder.classes_)))
equipment_mapping = dict(zip(equipment_encoder.transform(equipment_encoder.classes_), equipment_encoder.classes_))

# Load or Train Model
def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as file:
            return pickle.load(file)
    else:
        return train_and_save_model()

# Train & Save Model with Error Metrics
def train_and_save_model():
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'equipmentId', 'rating']], reader)
    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

    # Hyperparameter tuning
    param_grid = {'n_factors': [50, 100], 'n_epochs': [50, 100], 'lr_all': [0.001, 0.002], 'reg_all': [0.05, 0.1]}
    gs = GridSearchCV(SVDpp, param_grid, measures=['rmse', 'mae'], cv=3)
    gs.fit(data)

    best_params = gs.best_params['rmse']
    model = SVDpp(**best_params)
    model.fit(trainset)

    # Evaluate Model
    predictions = model.test(testset)
    true_ratings = [pred.r_ui for pred in predictions]
    predicted_ratings = [pred.est for pred in predictions]

    rmse = np.sqrt(mean_squared_error(true_ratings, predicted_ratings))
    mae = mean_absolute_error(true_ratings, predicted_ratings)
    mse = mean_squared_error(true_ratings, predicted_ratings)
    r2 = r2_score(true_ratings, predicted_ratings)

    accuracy = (1 - (rmse / 5)) * 100  # Normalized RMSE accuracy in %

    print("\nModel Evaluation Metrics:")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")
    print(f"MSE: {mse:.4f}")
    print(f"R² Score: {r2:.4f}")
    print(f"Accuracy: {accuracy:.2f}%")

    # Save model
    with open(MODEL_PATH, 'wb') as file:
        pickle.dump((model, user_mapping, equipment_mapping), file)

    return model, user_mapping, equipment_mapping

# Recommendation Function
def recommend_equipment(model, user_id, num_recommendations=10):
    if user_id not in user_mapping:
        top_equipment = df.groupby('equipmentId')['rating'].mean().nlargest(num_recommendations).index
        return [equipment_mapping[item] for item in top_equipment]
    
    encoded_user_id = user_mapping[user_id]
    unique_items = df['equipmentId'].unique()
    predictions = [(item, model.predict(encoded_user_id, item).est) for item in unique_items]
    predictions = sorted(predictions, key=lambda x: x[1], reverse=True)
    return [equipment_mapping[item[0]] for item in predictions[:num_recommendations]]

# Load model on startup
model, user_mapping, equipment_mapping = load_or_train_model()

@app.route('/')
def home():
    return "Equipment Recommendation System is Running!"

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    
    recommendations = recommend_equipment(model, user_id)
    return jsonify({"recommendations": recommendations})

@app.route('/retrain', methods=['POST'])
def retrain_model():
    global model, user_mapping, equipment_mapping
    model, user_mapping, equipment_mapping = train_and_save_model()
    return jsonify({"message": "Model retrained and updated successfully!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
