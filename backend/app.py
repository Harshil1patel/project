import os
import uuid
import shutil
import traceback
from numpy import rint
import requests

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from predict import predict_image

app = FastAPI(
    title="CivicLens AI API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "CivicLens AI API Running Successfully"
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    print("===== REQUEST RECEIVED =====")
    print(image.filename)

    # Create upload folder
    os.makedirs("upload", exist_ok=True)

    # Create unique filename
    upload_name = f"{uuid.uuid4().hex}_{image.filename}"
    file_path = os.path.join("upload", upload_name)

    # Save image
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        print("Save Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

    # AI Prediction
    try:

        print("=" * 50)
        print("Image saved:", file_path)

        category, confidence, saved_path = predict_image(file_path)
        print("=" * 50, flush=True)
        print(f"Prediction: {category}", flush=True)
        print(f"Confidence: {confidence}", flush=True)
        print(f"Saved Path: {saved_path}", flush=True)
        print("=" * 50, flush=True)
        

        print("Prediction:", category)
        print("Confidence:", confidence)
        print("Saved Path:", saved_path)
        
        print("=" * 50)

        return {
            "message": "Prediction Successful",
            "filename": image.filename,
            "category": category,
            "confidence": round(confidence, 2),
            "saved_path": saved_path
        }

    except Exception as e:

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )