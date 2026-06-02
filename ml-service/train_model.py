import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# make models folder if not exists
os.makedirs("models", exist_ok=True)

# load dataset
df = pd.read_csv("dataset.csv")

# features and target
X = df.drop("label", axis=1)
y = df["label"]

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

# train model
model.fit(X_train, y_train)

# prediction
y_pred = model.predict(X_test)

# evaluation
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# save model
joblib.dump(model, "models/crop_model.joblib")

print("Model trained and saved successfully!")