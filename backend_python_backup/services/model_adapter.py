from abc import ABC, abstractmethod
from typing import Tuple
import logging
from PIL import Image

logger = logging.getLogger("onion_backend.model_adapter")


class BaseModelAdapter(ABC):
    """
    Abstract Interface for ML Model Adapters.
    
    All onion quality prediction model adapters MUST inherit from this class
    and implement the `predict` method.
    """

    @abstractmethod
    def predict(self, image: Image.Image) -> Tuple[str, float]:
        """
        Takes a PIL RGB image and returns a tuple containing:
          - prediction: "healthy" or "unhealthy"
          - confidence: numeric percentage value between 0.0 and 100.0
        """
        pass


class MockModelAdapter(BaseModelAdapter):
    """
    Development & Testing Mock Model Adapter.
    
    WARNING: THIS IS A PLACEHOLDER MOCK ADAPTER.
    It returns deterministic mock predictions for backend development and testing.
    IT DOES NOT PERFORM REAL ML INFERENCE.
    
    The ML developer MUST replace this with a real model adapter (e.g. YOLOModelAdapter)
    before deploying to production or demo environments.
    """

    def __init__(self):
        logger.warning(
            "⚠️ INITIALIZED MOCK MODEL ADAPTER. Real ML predictions require a trained model adapter!"
        )

    def predict(self, image: Image.Image) -> Tuple[str, float]:
        """
        Returns a sample prediction based on image width/height parity for deterministic testing.
        """
        logger.info("[MOCK INFERENCE] Processing image frame in MockModelAdapter")
        
        # Simple deterministic calculation for testing predictability
        # If width * height is even -> "healthy", if odd -> "unhealthy"
        pixel_count = image.width * image.height
        if pixel_count % 2 == 0:
            prediction = "healthy"
            confidence = 99.80
        else:
            prediction = "unhealthy"
            confidence = 98.42

        return prediction, confidence


# ==============================================================================
# EXAMPLE REAL IMPLEMENTATION CONTRACT FOR ML DEVELOPER
# ==============================================================================
"""
Below is an example of how the ML developer can implement the real YOLO adapter
once the trained `best.pt` model is available.

from ultralytics import YOLO

class YOLOModelAdapter(BaseModelAdapter):
    def __init__(self, model_path: str = "best.pt"):
        logger.info(f"Loading Ultralytics YOLO classification model from {model_path}")
        self.model = YOLO(model_path)

    def predict(self, image: Image.Image) -> Tuple[str, float]:
        # Perform inference on Pillow Image directly
        results = self.model(image)
        probs = results[0].probs
        top1_idx = probs.top1
        confidence = float(probs.top1conf) * 100.0  # convert 0.0-1.0 to percentage
        
        raw_label = str(results[0].names[top1_idx]).lower()
        prediction = "healthy" if "healthy" in raw_label else "unhealthy"

        return prediction, confidence
"""
