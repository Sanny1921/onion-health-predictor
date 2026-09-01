import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.prediction import router as prediction_router
from schemas.prediction import HealthResponse, ErrorResponse

# Setup logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("onion_backend")

app = FastAPI(
    title="Onion Quality Classifier Backend API",
    description="FastAPI Backend for React Native Mobile Application supporting photo & live camera inference.",
    version="1.0.0"
)

# Development-friendly CORS setup for React Native application connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global HTTP Exception Handler for Clean JSON Errors
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(success=False, detail=str(exc.detail)).model_dump()
    )


# Global Fallback Unhandled Exception Handler
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            success=False,
            detail="An internal server error occurred."
        ).model_dump()
    )


# 1. Health check endpoint
@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Backend Health Check",
    description="Returns backend server health status."
)
async def health_check():
    return HealthResponse(status="healthy")


# Include prediction routes (/api/predict and /ws/predict)
app.include_router(prediction_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
