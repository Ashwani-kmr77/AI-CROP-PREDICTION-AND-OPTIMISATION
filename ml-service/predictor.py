import joblib
import numpy as np
import pandas as pd

model = joblib.load("models/crop_model.joblib")


def predict_crop_logic(data):
    features = pd.DataFrame([{
        "N": data.N,
        "P": data.P,
        "K": data.K,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "ph": data.ph,
        "rainfall": data.rainfall
    }])

    crop = model.predict(features)[0]

    confidence = None
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(features)[0]
        confidence = round(float(np.max(probs)) * 100, 2)

    yield_estimate = round((data.N + data.P + data.K) * 0.1 + data.land_area * 2.5, 2)

    if data.N < 50:
        fertilizer_advice = "Nitrogen is low. Add nitrogen-rich fertilizer."
    elif data.P < 30:
        fertilizer_advice = "Phosphorus is low. Add phosphorus fertilizer."
    elif data.K < 30:
        fertilizer_advice = "Potassium is low. Add potash fertilizer."
    else:
        fertilizer_advice = "Apply balanced NPK fertilizer based on soil testing."

    if data.rainfall < 80:
        irrigation_advice = "Use regular drip irrigation."
    elif data.rainfall < 150:
        irrigation_advice = "Moderate irrigation is recommended."
    else:
        irrigation_advice = "Natural rainfall is mostly sufficient."

    alternatives = ["Maize", "Millet", "Barley"]

    profit_estimate = round(data.budget * 1.3, 2)

    return {
        "predicted_crop": crop,
        "confidence": confidence,
        "yield_estimate": yield_estimate,
        "fertilizer_advice": fertilizer_advice,
        "irrigation_advice": irrigation_advice,
        "alternatives": alternatives,
        "profit_estimate": profit_estimate
    }