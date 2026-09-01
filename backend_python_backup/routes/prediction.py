import logging
from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from schemas.prediction import PredictionResponse, ErrorResponse
from services.prediction_service import PredictionService

logger = logging.getLogger("onion_backend.routes")

router = APIRouter()

# Instantiate shared PredictionService (uses MockModelAdapter by default)
prediction_service = PredictionService()


@router.post(
    "/api/predict",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid or corrupted image upload"},
        500: {"model": ErrorResponse, "description": "Server processing error"}
    },
    summary="Onion Photo Quality Prediction Endpoint",
    description="Receives an image via multipart/form-data upload and returns health classification and confidence score."
)
async def predict_photo(file: UploadFile = File(...)):
    """
    Accepts multipart/form-data with file field.
    Validates, decodes, and predicts onion quality.
    """
    try:
        contents = await file.read()
        response = prediction_service.process_image_bytes(contents)
        return response
    except ValueError as ve:
        logger.warning(f"Image validation failed for file '{file.filename}': {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Internal server error during prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server prediction error.")


@router.websocket("/ws/predict")
async def predict_live_stream(websocket: WebSocket):
    """
    WebSocket endpoint for real-time video frame inference from React Native app.
    Receives binary JPEG frame bytes and sends JSON prediction responses sequentially.
    """
    await websocket.accept()
    logger.info("WebSocket connection established for live frame inference.")

    try:
        while True:
            # Receive raw binary image frame bytes
            frame_bytes = await websocket.receive_bytes()
            
            try:
                # Process image frame sequentially through prediction service
                result = prediction_service.process_image_bytes(frame_bytes)
                await websocket.send_json(result.model_dump())
            except ValueError as ve:
                logger.warning(f"WebSocket frame validation error: {ve}")
                await websocket.send_json({
                    "success": False,
                    "detail": str(ve)
                })
            except Exception as e:
                logger.error(f"WebSocket internal error: {e}", exc_info=True)
                await websocket.send_json({
                    "success": False,
                    "detail": "Failed to process frame."
                })
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected.")
    except Exception as e:
        logger.error(f"WebSocket session terminated unexpectedly: {e}", exc_info=True)
