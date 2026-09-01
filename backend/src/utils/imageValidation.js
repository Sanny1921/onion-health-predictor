/**
 * Image Validation Utility
 * Validates raw Buffer payloads to ensure they represent valid JPEG/PNG image data.
 */

/**
 * Validates an image buffer by checking its existence, length, and magic numbers.
 * @param {Buffer} buffer - The raw binary image buffer.
 * @returns {boolean} - Returns true if valid.
 * @throws {Error} - Throws descriptive Error if buffer is missing, empty, or un-recognized.
 */
function validateImageBuffer(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid image payload: No image data provided.');
  }

  if (buffer.length === 0) {
    throw new Error('Invalid image payload: Buffer is empty.');
  }

  // Minimum size for valid JPEG/PNG headers
  if (buffer.length < 4) {
    throw new Error('Invalid image payload: File is too small to be a valid image.');
  }

  // Check magic numbers
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;

  if (!isJpeg && !isPng) {
    throw new Error('Invalid or corrupted image format. Expected JPEG or PNG image.');
  }

  return true;
}

module.exports = {
  validateImageBuffer,
};
