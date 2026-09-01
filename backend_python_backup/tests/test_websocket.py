def test_websocket_predict_flow(client, sample_valid_jpeg_bytes, sample_unhealthy_jpeg_bytes):
    """
    Test Requirement 9 & 10:
    - WebSocket connection works.
    - WebSocket receives binary JPEG frame data and returns correct JSON response structure.
    - Test sequential frame processing.
    """
    with client.websocket_connect("/ws/predict") as websocket:
        # Send frame 1 (Healthy)
        websocket.send_bytes(sample_valid_jpeg_bytes)
        response_1 = websocket.receive_json()

        assert response_1["success"] is True
        assert response_1["prediction"] == "healthy"
        assert response_1["confidence"] == 99.80

        # Send frame 2 (Unhealthy)
        websocket.send_bytes(sample_unhealthy_jpeg_bytes)
        response_2 = websocket.receive_json()

        assert response_2["success"] is True
        assert response_2["prediction"] == "unhealthy"
        assert response_2["confidence"] == 98.42


def test_websocket_predict_invalid_frame(client, sample_text_bytes):
    """
    Verifies WebSocket frame handler returns error JSON frame when invalid data is sent, without breaking connection.
    """
    with client.websocket_connect("/ws/predict") as websocket:
        websocket.send_bytes(sample_text_bytes)
        response = websocket.receive_json()

        assert response["success"] is False
        assert "detail" in response
