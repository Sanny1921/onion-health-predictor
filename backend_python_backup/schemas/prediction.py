from typing import Literal
from pydantic import BaseModel, Field, field_validator

class PredictionResponse(BaseModel):
    """
    Standard API response schema for photo & stream onion classification predictions.
    """
    success: bool = Field(True, description="Indicates whether prediction succeeded")
    prediction: Literal["healthy", "unhealthy"] = Field(..., description="Onion condition classification")
    confidence: float = Field(..., ge=0.0, le=100.0, description="Confidence percentage (0.0 - 100.0)")

    @field_validator("confidence")
    @classmethod
    def validate_confidence(cls, v: float) -> float:
        # Ensure confidence is rounded cleanly to 2 decimal places
        return round(float(v), 2)


class HealthResponse(BaseModel):
    """
    API response schema for health check endpoint.
    """
    status: Literal["healthy"] = "healthy"


class ErrorResponse(BaseModel):
    """
    Standardized API response schema for error responses.
    """
    success: bool = Field(False, description="Indicates failure")
    detail: str = Field(..., description="Sanitized human-readable error details")
