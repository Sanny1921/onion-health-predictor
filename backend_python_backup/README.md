# React Native Onion Quality Classifier - Backend API

FastAPI backend service designed for connecting a React Native mobile application to an ML onion quality prediction model ("healthy" vs "unhealthy").

---

## 🏗️ System Architecture

```
React Native Mobile App
        │
        │ HTTP / WebSocket
        ▼
FastAPI Backend (main.py)
        │
        ▼
Prediction Service (services/prediction_service.py)
        │
        ▼
ML Model Adapter (services/model_adapter.py)
        │
        ▼
Actual ML Model (Provided by ML Developer, e.g. Ultralytics YOLO best.pt)
```

The backend uses a **Model Adapter Pattern** to strictly decouple API routes and React Native communication from the machine learning inference engine. The backend operates seamlessly with a `MockModelAdapter` during frontend/backend development without requiring `best.pt` or PyTorch/Ultralytics dependencies on the development machine.

---

## 🚀 Running the Backend

### Prerequisites
- Python 3.10+
- Virtual environment setup

### Installation & Run Commands
```bash
# 1. Navigate to backend directory
cd /home/turtle/onion/backend

# 2. Create and activate python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Start backend server
uvicorn main:app --host 0.0.0.0 --port 8000
```

> [!NOTE]
> The server listens on `0.0.0.0:8000`. In React Native development, connect to `http://<YOUR_LOCAL_IP>:8000` or `http://10.0.2.2:8000` (Android Emulator).

---

## 🧪 Testing

### Backend Test Suite vs. Real ML Model Testing

- **BACKEND TESTING (Included)**: Verifies FastAPI endpoints, CORS, image byte validation, Pillow decoding, Pydantic schemas, WebSocket binary frame streams, and the `ModelAdapter` interface abstraction using `MockModelAdapter`.
- **REAL ML MODEL TESTING (Pending ML Developer)**: Verifies accuracy, precision, and inference latency of the actual trained weights (`best.pt`) once integrated into `YOLOModelAdapter`.

### Execute Backend Tests
```bash
PYTHONPATH="" ./venv/bin/pytest -v tests
```

---

## 📱 React Native Developer Contract

### 1. Health Check
- **GET** `/health`
- **Response**:
```json
{
  "status": "healthy"
}
```

### 2. Photo Quality Prediction (HTTP Upload)
- **POST** `/api/predict`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (Image binary blob / file payload)

#### Success Response (HTTP 200)
```json
{
  "success": true,
  "prediction": "healthy",
  "confidence": 99.8
}
```
or
```json
{
  "success": true,
  "prediction": "unhealthy",
  "confidence": 98.42
}
```

#### Error Response (HTTP 400 / 500)
```json
{
  "success": false,
  "detail": "Invalid or unsupported image file format."
}
```

---

### 3. Live Camera Frame Prediction (WebSocket Stream)
- **URL**: `ws://<BACKEND_HOST>:8000/ws/predict`
- **Client Protocol**: React Native streams binary JPEG frames over the WebSocket connection.
- **Server Response**: For every frame received, the server returns a JSON response string:

```json
{
  "success": true,
  "prediction": "healthy",
  "confidence": 99.21
}
```

> [!TIP]
> Frames are processed sequentially. The React Native application controls camera frame sampling rate (e.g., 2-5 FPS).

---

## 🤖 ML Developer Integration Guide

### Contract Requirements
- **Model Input**: Standard Pillow / NumPy **RGB Image**.
- **Model Output**:
  - `prediction`: Either `"healthy"` or `"unhealthy"`.
  - `confidence`: Floating-point percentage between `0.0` and `100.0`.

### Integration Steps
To plug in the real trained model (e.g. Ultralytics YOLO `best.pt`):

1. **Install ML dependencies in your production/demo environment**:
   ```bash
   pip install ultralytics torch torchvision
   ```

2. **Open `services/model_adapter.py`**:
   Implement a `YOLOModelAdapter` class inheriting from `BaseModelAdapter`:

```python
from PIL import Image
from typing import Tuple
from ultralytics import YOLO
from services.model_adapter import BaseModelAdapter

class YOLOModelAdapter(BaseModelAdapter):
    def __init__(self, model_path: str = "best.pt"):
        # Load trained weights
        self.model = YOLO(model_path)

    def predict(self, image: Image.Image) -> Tuple[str, float]:
        # Run classification inference
        results = self.model(image)
        probs = results[0].probs
        top1_idx = probs.top1
        confidence = float(probs.top1conf) * 100.0  # Percentage 0.0 - 100.0
        
        # Map class label to "healthy" or "unhealthy"
        raw_label = str(results[0].names[top1_idx]).lower()
        prediction = "healthy" if "healthy" in raw_label else "unhealthy"

        return prediction, round(confidence, 2)
```

3. **Wire your adapter in `routes/prediction.py`**:
```python
# Replace MockModelAdapter instantiation with YOLOModelAdapter:
from services.model_adapter import YOLOModelAdapter

# prediction_service = PredictionService(model_adapter=MockModelAdapter())
prediction_service = PredictionService(model_adapter=YOLOModelAdapter("best.pt"))
```

> [!IMPORTANT]
> **Zero API Breaking Changes**: Plugging in `YOLOModelAdapter` requires ZERO changes to `main.py`, `schemas/`, `routes/`, or the React Native application.

---

## 📁 Backend Directory Structure

```
backend/
├── main.py                     # FastAPI application entrypoint & CORS configuration
├── requirements.txt            # Lightweight backend Python dependencies
├── README.md                   # System documentation & API/ML contracts
├── routes/
│   └── prediction.py           # HTTP POST & WebSocket endpoints
├── services/
│   ├── model_adapter.py        # BaseModelAdapter abstract interface & MockModelAdapter
│   └── prediction_service.py   # Prediction processing logic
├── schemas/
│   └── prediction.py           # Pydantic response models
├── utils/
│   └── image.py                # Image validation, security checks & RGB conversion
└── tests/
    ├── conftest.py             # Test fixtures & image generators
    ├── test_health.py          # GET /health test
    ├── test_image_validation.py# Image parsing & error handling tests
    ├── test_model_adapter.py   # Model adapter interface tests
    ├── test_prediction.py      # POST /api/predict tests
    └── test_websocket.py       # WebSocket /ws/predict frame stream tests
```
