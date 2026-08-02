import os
import uuid
import shutil
import traceback

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
    print("===== REQUEST RECEIVED =====", flush=True)
    print(image.filename, flush=True)

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
        print("Save Error:", e, flush=True)
        raise HTTPException(status_code=500, detail=str(e))

    # AI Prediction
    try:

        print("=" * 50, flush=True)
        print("Image saved:", file_path, flush=True)

        category, confidence, saved_path = predict_image(file_path)

        print("Prediction:", category, flush=True)
        print("Confidence:", confidence, flush=True)
        print("Saved Path:", saved_path, flush=True)
        print("=" * 50, flush=True)

        # Reject low confidence image
        if confidence < 60:
            return {
                "success": False,
                "message": "Invalid image. Please upload a clear civic issue image.",
                "confidence": round(confidence, 2)
            }

        # Accept valid image
        return {
            "success": True,
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