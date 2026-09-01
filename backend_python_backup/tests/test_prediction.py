def test_predict_photo_endpoint_success(client, sample_valid_jpeg_bytes):
    """
    Test Requirement 3 & 8:
    - Image upload via multipart/form-data works.
    - POST /api/predict returns the correct API structure:
      {"success": true, "prediction": "healthy", "confidence": 99.8}
    """
    files = {
        "file": ("test_onion.jpg", sample_valid_jpeg_bytes, "image/jpeg")
    }
    response = client.post("/api/predict", files=files)

    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["prediction"] == "healthy"
    assert data["confidence"] == 99.80


def test_predict_photo_unhealthy_sample(client, sample_unhealthy_jpeg_bytes):
    """
    Verifies prediction response for an unhealthy sample upload.
    """
    files = {
        "file": ("unhealthy_onion.jpg", sample_unhealthy_jpeg_bytes, "image/jpeg")
    }
    response = client.post("/api/predict", files=files)

    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert data["prediction"] == "unhealthy"
    assert data["confidence"] == 98.42


def test_predict_photo_invalid_image(client, sample_text_bytes):
    """
    Verifies POST /api/predict handles invalid images cleanly with HTTP 400.
    """
    files = {
        "file": ("not_an_image.txt", sample_text_bytes, "text/plain")
    }
    response = client.post("/api/predict", files=files)

    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "Invalid or unsupported image" in data["detail"]


def test_predict_photo_empty_file(client):
    """
    Verifies POST /api/predict handles empty file uploads.
    """
    files = {
        "file": ("empty.jpg", b"", "image/jpeg")
    }
    response = client.post("/api/predict", files=files)

    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "empty" in data["detail"].lower()
