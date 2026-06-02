from fastapi import FastAPI
from schemas import CropInput
from predictor import predict_crop_logic

app = FastAPI()

@app.get("/")
def home():
    return {"message": "ML service is running"}

@app.post("/predict")
def predict(data: CropInput):
    result = predict_crop_logic(data)
    return result