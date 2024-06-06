from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import cv2  # Import the OpenCV module

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Load your TensorFlow model
def load_model():
    return tf.keras.models.load_model("./model.hdf5", compile=False)

MODEL = load_model()

CLASS_NAMES = ['Angry', 'Angry', 'Sad', 'Happy', 'Sad', 'Happy', 'Neutral']

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

def preprocess_image(image):
    # Convert the input image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Resize the grayscale image to fit the model input size
    input_shape = MODEL.input_shape[1:3]
    input_data = cv2.resize(gray_image, (input_shape[0], input_shape[1]))

    # Normalize pixel values
    input_data = input_data / 255.0

    # Reshape for model input
    input_data = np.reshape(input_data, (1, input_shape[0], input_shape[1], 1))

    return input_data

def predict_emotion(image):
    emotion_prediction = MODEL.predict(image)
    predicted_class = CLASS_NAMES[np.argmax(emotion_prediction[0])]
    confidence = float(np.max(emotion_prediction[0]))
    return predicted_class, confidence

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    input_data = preprocess_image(image)
    
    predicted_class, confidence = predict_emotion(input_data)

    return {
        'predictions': predicted_class,
        'confidence': confidence,
    }

# if __name__ == "__main__":
#     uvicorn.run(app, host='localhost', port=8000)



# uvicorn main:app  --reload --host 0.0.0.0 --port 8000

#pip install --upgrade typing-extensions

# install tensorflow
# pip uninstall tensorflow
# pip install tensorflow==2.12.0 --upgrade

# Install FastAPI
# pip install fastapi

# Install Uvicorn
# pip install uvicorn

# Install Pillow (PIL)
# pip install pillow

# Install OpenCV
# pip install opencv-python-headless

