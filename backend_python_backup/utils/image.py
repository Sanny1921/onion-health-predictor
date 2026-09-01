import io
from PIL import Image, UnidentifiedImageError

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB limit


def validate_and_decode_image(
    image_bytes: bytes,
    max_size_bytes: int = MAX_IMAGE_SIZE_BYTES
) -> Image.Image:
    """
    Validates and decodes image byte payload.
    
    Checks:
    - Empty upload
    - Oversized file
    - Invalid or unsupported image format (independent of filename extension)
    - Corrupted payload
    
    Converts valid images to RGB mode for model input.
    Raises ValueError with a sanitized error message on validation failure.
    """
    if not image_bytes or len(image_bytes) == 0:
        raise ValueError("Uploaded file is empty.")

    if len(image_bytes) > max_size_bytes:
        raise ValueError(
            f"Uploaded image exceeds maximum allowable size ({max_size_bytes // (1024 * 1024)} MB)."
        )

    # Attempt to open as PIL Image
    try:
        stream = io.BytesIO(image_bytes)
        img = Image.open(stream)
    except UnidentifiedImageError:
        raise ValueError("Invalid or unsupported image file format.")
    except Exception as e:
        raise ValueError(f"Failed to process image file: {str(e)}")

    # Verify image integrity to catch truncated or corrupted images
    try:
        verify_stream = io.BytesIO(image_bytes)
        verify_img = Image.open(verify_stream)
        verify_img.verify()
    except Exception:
        raise ValueError("Corrupted or damaged image payload.")

    # Re-open after verification (Pillow requirement) and load pixel data
    try:
        stream.seek(0)
        img = Image.open(stream)
        img.load()
    except Exception:
        raise ValueError("Unable to read image raster data.")

    # Ensure format is RGB
    if img.mode != "RGB":
        img = img.convert("RGB")

    return img
