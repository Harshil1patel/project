import os
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# ==========================================
# 1. CONFIGURATION & VRAM SAFETY SETTINGS
# ==========================================
# Prevent TensorFlow from grabbing ALL GPU memory instantly
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError as e:
        print(e)

DATASET_DIR = "dataset"
IMG_SIZE = (224, 224)   # Native MobileNetV2 size
BATCH_SIZE = 16         # Small batch size to strictly fit 4GB VRAM
EPOCHS = 10             # A few passes are enough for a small dataset

# ==========================================
# 2. LOAD AND SPLIT DATASET
# ==========================================
# Automatically reads your folder names as your 5 class labels
print("Loading training data...")
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,       # Use 20% of images to test accuracy
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'    # Multi-class classification
)

print("Loading validation data...")
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'
)

# Extract class names to verify
class_names = train_ds.class_names
print(f"\nSuccessfully found 5 classes: {class_names}")

# Apply MobileNetV2 preprocessing so training and prediction use the same input scale
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.map(lambda x, y: (preprocess_input(x), y), num_parallel_calls=AUTOTUNE)
val_ds = val_ds.map(lambda x, y: (preprocess_input(x), y), num_parallel_calls=AUTOTUNE)
train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

# ==========================================
# 3. BUILD THE MOBILENETV2 MODEL
# ==========================================
# Load MobileNetV2 pre-trained on ImageNet, without its original top layer
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# FREEZE the base layers so your RTX 3050 trains lightning fast
base_model.trainable = False

# Create the custom top layer for your 5 specific categories
model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),

    base_model,

    layers.GlobalAveragePooling2D(),

    layers.Dropout(0.2),

    layers.Dense(5, activation='softmax')
])

# ==========================================
# 4. COMPILE AND TRAIN
# ==========================================
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

print("\nStarting Training on GPU...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)
print("Training Complete!")

# ==========================================
# 5. SAVE THE FINAL BRAIN FILE
# ==========================================
OUTPUT_FILE = "city_infrastructure_model.keras"
model.save(OUTPUT_FILE)
print(f"\nSaved completed model brain file as: {OUTPUT_FILE}")