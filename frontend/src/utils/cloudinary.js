const CLOUDINARY_UPLOAD_PATH = 'image/upload';

function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes('res.cloudinary.com/') && url.includes(`/${CLOUDINARY_UPLOAD_PATH}/`);
}

/** Return a lightweight square avatar while keeping old image URLs working. */
export function getProfileAvatarUrl(url) {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace(`/${CLOUDINARY_UPLOAD_PATH}/`, `/${CLOUDINARY_UPLOAD_PATH}/c_fill,g_auto,w_512,h_512/q_auto/f_auto/`);
}

/** Upload an already cropped JPEG with a short-lived signature from our API. */
export async function uploadAvatarToCloudinary(dataUrl, uploadSignature) {
  const { cloudName, apiKey, timestamp, signature, folder, publicId } = uploadSignature;
  const image = await fetch(dataUrl).then((response) => response.blob());
  const formData = new FormData();
  formData.append('file', image, 'avatar.jpg');
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'Could not upload your photo. Please try again.');
  }
  return result.secure_url;
}
