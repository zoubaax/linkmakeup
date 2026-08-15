const DEFAULTS = {
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.82,
  maxDataUrlLength: 500_000,
};

/**
 * Resize and compress an image file to a JPEG data URL suitable for API upload.
 * @param {File} file
 * @param {{ maxWidth?: number, maxHeight?: number, quality?: number, maxDataUrlLength?: number }} options
 * @returns {Promise<string>}
 */
export function compressImageFile(file, options = {}) {
  const { maxWidth, maxHeight, quality, maxDataUrlLength } = { ...DEFAULTS, ...options };

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not process image.'));
        return;
      }

      ctx.drawImage(image, 0, 0, width, height);

      let currentQuality = quality;
      let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

      while (dataUrl.length > maxDataUrlLength && currentQuality > 0.45) {
        currentQuality -= 0.08;
        dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
      }

      if (dataUrl.length > maxDataUrlLength) {
        reject(new Error('Image is too large. Please choose a smaller photo.'));
        return;
      }

      resolve(dataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image.'));
    };

    image.src = objectUrl;
  });
}

/**
 * @param {File} file
 * @param {number} maxBytes
 */
export function validateImageFile(file, maxBytes = 5 * 1024 * 1024) {
  if (!file.type.startsWith('image/')) {
    return 'Please select a valid image file.';
  }
  if (file.size > maxBytes) {
    return 'Image must be under 5MB.';
  }
  return null;
}
