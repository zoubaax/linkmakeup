export const IMAGE_UPLOAD_DEFAULTS = {
  maxWidth: 512,
  maxHeight: 512,
  quality: 0.82,
  maxDataUrlLength: 500_000,
};

const DEFAULTS = IMAGE_UPLOAD_DEFAULTS;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image.'));
    image.src = src;
  });
}

function readJpegOrientation(buf) {
  try {
    const view = new DataView(buf);
    if (buf.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return 1;
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = view.getUint8(offset + 1);
      if (marker === 0xff || (marker >= 0xd0 && marker <= 0xd9)) {
        offset += 2;
        continue;
      }
      const length = view.getUint16(offset + 2, false);
      if (marker === 0xe1 && length > 10) {
        const p = offset + 4;
        if (view.getUint32(p, false) === 0x45786966 && view.getUint16(p + 4, false) === 0) {
          const tiff = p + 6;
          const little = view.getUint16(tiff, false) === 0x4949;
          const get16 = (o) => view.getUint16(o, little);
          const get32 = (o) => view.getUint32(o, little);
          const ifd0 = tiff + get32(tiff + 4);
          const count = get16(ifd0);
          for (let i = 0; i < count; i += 1) {
            const entry = ifd0 + 2 + i * 12;
            if (get16(entry) === 0x0112) return get16(entry + 8);
          }
        }
      }
      offset += 2 + length;
    }
    return 1;
  } catch {
    return 1;
  }
}

function normalizeOrientation(img, orientation) {
  if (orientation <= 1) return null;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const swap = orientation >= 5 && orientation <= 8;
  const canvas = document.createElement('canvas');
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const t =
    {
      2: [-1, 0, 0, 1, w, 0],
      3: [-1, 0, 0, -1, w, h],
      4: [1, 0, 0, -1, 0, h],
      5: [0, 1, 1, 0, 0, 0],
      6: [0, 1, -1, 0, h, 0],
      7: [0, -1, -1, 0, h, w],
      8: [0, -1, 1, 0, 0, w],
    }[orientation];
  if (!t) return null;
  ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Correct EXIF orientation before cropping so the preview matches the export.
 * @param {string} src
 * @returns {Promise<string>}
 */
export async function resolveOrientedImageSrc(src) {
  try {
    const response = await fetch(src);
    const buffer = await response.arrayBuffer();
    const orientation = readJpegOrientation(buffer);
    if (orientation <= 1) return src;

    const image = await loadImage(src);
    return normalizeOrientation(image, orientation) || src;
  } catch {
    return src;
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ quality?: number, maxDataUrlLength?: number }} options
 * @returns {Promise<string>}
 */
export function canvasToDataUrl(canvas, options = {}) {
  const { quality, maxDataUrlLength } = { ...DEFAULTS, ...options };

  return new Promise((resolve, reject) => {
    let currentQuality = quality;
    let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);

    while (dataUrl.length > maxDataUrlLength && currentQuality > 0.45) {
      currentQuality -= 0.08;
      dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
    }

    if (dataUrl.length <= maxDataUrlLength) {
      resolve(dataUrl);
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Image is too large. Please choose a smaller photo.'));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not process image.'));
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.6
    );
  });
}

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
