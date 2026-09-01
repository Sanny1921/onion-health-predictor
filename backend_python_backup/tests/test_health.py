def test_health_check_endpoint(client):
    """
    Test Requirement 1 & 2:
    - Verifies FastAPI server starts.
    - Verifies GET /health returns status code 200 and {"status": "healthy"}.
    """
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data == {"status": "healthy"}
