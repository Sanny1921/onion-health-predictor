import logging
from typing import Optional
from schemas.prediction import PredictionResponse
from services.model_adapter import BaseModelAdapter, MockModelAdapter
from utils.image import validate_and_decode_image

logger = logging.getLogger("onion_backend.prediction_service")


class PredictionService:
    """
    Core business logic layer for handling onion image predictions.
    Decouples API handlers and image parsing from the underlying ML model adapter.
    """

    def __init__(self, model_adapter: Optional[BaseModelAdapter] = None):
        # Default to MockModelAdapter if no adapter is explicitly passed
        self.model_adapter: BaseModelAdapter = model_adapter or MockModelAdapter()

    def process_image_bytes(self, image_bytes: bytes) -> PredictionResponse:
        """
        Processes raw byte stream (HTTP file upload or WebSocket frame),
        validates the image format and integrity, runs inference through the adapter,
        and returns a standardized Pydantic PredictionResponse.
        """
        # 1. Validate & Decode Image (raises ValueError if invalid/corrupt/empty)
        pil_image = validate_and_decode_image(image_bytes)

        # 2. Execute inference through Model Adapter
        prediction, confidence = self.model_adapter.predict(pil_image)

        # 3. Format & validate output schema
        return PredictionResponse(
            success=True,
            prediction=prediction,
            confidence=confidence
        )
