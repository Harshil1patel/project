import os
import shutil
from pathlib import Path

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["ABSL_CPP_MIN_LOG_LEVEL"] = "3"

import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

MODEL_PATH = "city_infrastructure_model.keras"

IMG_SIZE = (224, 224)

UPLOAD_DIR = Path("upload")

CLASS_NAMES = [
    "garbage",
    "pothole",
    "road_crack",
    "street_light",
    "water_leak"
]

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        "preprocess_input": preprocess_input
    }
)


def predict_image(image_path):

    img = image.load_img(
        image_path,
        target_size=IMG_SIZE
    )

    img_array = image.img_to_array(img)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    prediction = model.predict(
        img_array,
        verbose=0
    )

    predicted_index = np.argmax(prediction[0])

    predicted_class = CLASS_NAMES[predicted_index]

    confidence = float(
        prediction[0][predicted_index] * 100
    )

    UPLOAD_DIR.mkdir(exist_ok=True)

    category_folder = UPLOAD_DIR / predicted_class

    category_folder.mkdir(exist_ok=True)

    source = Path(image_path)

    destination = category_folder / source.name

    shutil.move(str(source), str(destination))

    return predicted_class, confidence, str(destination)
    