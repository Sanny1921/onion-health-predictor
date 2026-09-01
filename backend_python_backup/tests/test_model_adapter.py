from services.model_adapter import BaseModelAdapter, MockModelAdapter
from PIL import Image


def test_mock_adapter_interface():
    """
    Test Requirement 6 & 7:
    - BaseModelAdapter interface contract works.
    - Mock adapter returns a correctly structured prediction result (prediction, confidence).
    """
    adapter = MockModelAdapter()
    assert isinstance(adapter, BaseModelAdapter)

    # Test with sample PIL Image
    img = Image.new("RGB", (100, 100))
    prediction, confidence = adapter.predict(img)

    assert prediction in ["healthy", "unhealthy"]
    assert isinstance(confidence, float)
    assert 0.0 <= confidence <= 100.0
    assert prediction == "healthy"
    assert confidence == 99.80


def test_mock_adapter_deterministic_unhealthy():
    """
    Verifies MockModelAdapter returns deterministic 'unhealthy' for odd pixel dimension image.
    """
    adapter = MockModelAdapter()
    img = Image.new("RGB", (101, 101))
    prediction, confidence = adapter.predict(img)

    assert prediction == "unhealthy"
    assert confidence == 98.42
