/**
 * Image Validation Utility
 * Validates raw Buffer payloads and determines server-verified MIME types from magic numbers.
 */

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

/**
 * Validates an image buffer and returns the server-detected MIME type.
 * @param {Buffer} buffer - The raw binary image buffer.
 * @returns {string} - Server-verified MIME type ('image/jpeg' or 'image/png')
 * @throws {Error} - Throws descriptive Error if buffer is invalid, corrupt, or unsupported.
 */
function validateImageBuffer(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid image payload: No image data provided.');
  }

  if (buffer.length === 0) {
    throw new Error('Invalid image payload: Buffer is empty.');
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Invalid image payload: File size exceeds maximum limit of 15MB.');
  }

  if (buffer.length < 4) {
    throw new Error('Invalid image payload: File is too small to be a valid image.');
  }

  // Detect MIME type from header magic numbers
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isWebp =
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  if (isJpeg) {
    return 'image/jpeg';
  }

  if (isPng) {
    return 'image/png';
  }

  if (isWebp) {
    return 'image/webp';
  }

  throw new Error('Invalid or corrupted image format. Expected JPEG, PNG, or WEBP image.');
}

module.exports = {
  validateImageBuffer,
  MAX_IMAGE_SIZE_BYTES,
};
