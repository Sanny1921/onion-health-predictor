import pytest
from utils.image import validate_and_decode_image, MAX_IMAGE_SIZE_BYTES
from PIL import Image


def test_valid_image_decoding(sample_valid_jpeg_bytes):
    """
    Test Requirement 4 & 5:
    - Image validation successfully parses valid JPEG.
    - Decoded image mode is converted to 'RGB'.
    """
    img = validate_and_decode_image(sample_valid_jpeg_bytes)
    assert isinstance(img, Image.Image)
    assert img.mode == "RGB"
    assert img.width == 100
    assert img.height == 100


def test_png_rgba_conversion_to_rgb(sample_png_bytes):
    """
    Verifies RGBA PNG images are cleanly converted to RGB.
    """
    img = validate_and_decode_image(sample_png_bytes)
    assert img.mode == "RGB"


def test_empty_upload_validation():
    """
    Verifies empty payload raises ValueError.
    """
    with pytest.raises(ValueError, match="file is empty"):
        validate_and_decode_image(b"")


def test_corrupt_image_validation(sample_corrupt_bytes):
    """
    Verifies corrupt image payload raises ValueError.
    """
    with pytest.raises(ValueError):
        validate_and_decode_image(sample_corrupt_bytes)


def test_non_image_validation(sample_text_bytes):
    """
    Verifies non-image text file payload raises ValueError.
    """
    with pytest.raises(ValueError, match="Invalid or unsupported image file format"):
        validate_and_decode_image(sample_text_bytes)


def test_oversized_image_validation():
    """
    Verifies payload exceeding max allowable size raises ValueError.
    """
    oversized_data = b"0" * (MAX_IMAGE_SIZE_BYTES + 100)
    with pytest.raises(ValueError, match="maximum allowable size"):
        validate_and_decode_image(oversized_data)
