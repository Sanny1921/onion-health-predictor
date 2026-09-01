import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend root to sys.path so imports work seamlessly during pytest execution
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app


@pytest.fixture
def client():
    """
    FastAPI TestClient fixture.
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_valid_jpeg_bytes():
    """
    Creates a valid test JPEG image in memory (100x100 RGB).
    Width * Height = 10,000 (even pixel count -> MockModelAdapter returns "healthy").
    """
    img = Image.new("RGB", (100, 100), color=(255, 128, 0))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


@pytest.fixture
def sample_unhealthy_jpeg_bytes():
    """
    Creates a valid test JPEG image in memory with odd total pixels (101x101 RGB).
    Width * Height = 10,201 (odd pixel count -> MockModelAdapter returns "unhealthy").
    """
    img = Image.new("RGB", (101, 101), color=(128, 64, 32))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


@pytest.fixture
def sample_png_bytes():
    """
    Creates a valid test PNG image in RGBA mode to test RGB conversion.
    """
    img = Image.new("RGBA", (50, 50), color=(0, 255, 0, 128))
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


@pytest.fixture
def sample_corrupt_bytes():
    """
    Creates corrupt image byte stream (valid JPEG header followed by trash).
    """
    return b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00corruptdata12345"


@pytest.fixture
def sample_text_bytes():
    """
    Non-image text data stream.
    """
    return b"This is a text file, not an image payload."
