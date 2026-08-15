import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  cropToCanvas,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasToDataUrl, IMAGE_UPLOAD_DEFAULTS, resolveOrientedImageSrc } from '../../utils/imageUpload';

const AVATAR_SIZE = IMAGE_UPLOAD_DEFAULTS.maxWidth;

function centerSquareCrop(width, height) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, 1, width, height),
    width,
    height
  );
}

export default function ImageCropper({ src, onCancel, onCrop }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [prepareError, setPrepareError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const cancelRef = useRef(onCancel);

  useEffect(() => {
    cancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSaving) cancelRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSaving]);

  useEffect(() => {
    let cancelled = false;

    setImageSrc(null);
    setLoaded(false);
    setCrop(null);
    setCompletedCrop(null);
    setPreviewUrl('');
    setPrepareError('');
    setSaveError('');

    resolveOrientedImageSrc(src)
      .then((resolvedSrc) => {
        if (!cancelled) setImageSrc(resolvedSrc);
      })
      .catch(() => {
        if (!cancelled) setPrepareError('Could not load this image. Try another photo.');
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  const updatePreview = useCallback(async (pixelCrop) => {
    const image = imageRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !pixelCrop?.width || !pixelCrop?.height) return;

    await cropToCanvas(image, previewCanvas, pixelCrop);
    setPreviewUrl(previewCanvas.toDataURL('image/jpeg', 0.82));
  }, []);

  const handleImageLoad = (event) => {
    const { width, height } = event.currentTarget;
    const nextCrop = centerSquareCrop(width, height);
    const pixelCrop = convertToPixelCrop(nextCrop, width, height);

    setCrop(nextCrop);
    setCompletedCrop(pixelCrop);
    setLoaded(true);
    void updatePreview(pixelCrop);
  };

  const resetCrop = () => {
    const image = imageRef.current;
    if (!image) return;

    const nextCrop = centerSquareCrop(image.width, image.height);
    const pixelCrop = convertToPixelCrop(nextCrop, image.width, image.height);

    setCrop(nextCrop);
    setCompletedCrop(pixelCrop);
    setSaveError('');
    void updatePreview(pixelCrop);
  };

  const handleCropComplete = (pixelCrop) => {
    setCompletedCrop(pixelCrop);
    void updatePreview(pixelCrop);
  };

  const handleUsePhoto = async () => {
    const image = imageRef.current;
    if (!image || !completedCrop?.width || !completedCrop?.height || isSaving) return;

    setIsSaving(true);
    setSaveError('');

    try {
      const cropCanvas = document.createElement('canvas');
      await cropToCanvas(image, cropCanvas, completedCrop);

      const avatarCanvas = document.createElement('canvas');
      avatarCanvas.width = AVATAR_SIZE;
      avatarCanvas.height = AVATAR_SIZE;

      const ctx = avatarCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not process image.');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cropCanvas, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

      const dataUrl = await canvasToDataUrl(avatarCanvas);
      onCrop(dataUrl);
    } catch (error) {
      setSaveError(error.message || 'Could not save this crop. Try again.');
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-overlay"
        aria-label="Close cropper"
        onClick={isSaving ? undefined : onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Crop your photo"
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-[min(32rem,calc(100vw-2rem))] max-h-[min(92vh,820px)] flex flex-col bg-surface border border-border rounded-3xl p-4 sm:p-5 shadow-2xl animate-scale-in overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-fg">Crop profile photo</h2>
              <p className="mt-1 text-xs text-fg-muted">Drag to reposition. Pull a corner to zoom.</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              aria-label="Close cropper"
              className="p-2 rounded-full text-fg-muted hover:text-fg hover:bg-nav-hover transition-colors disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex justify-center overflow-hidden rounded-2xl border border-border bg-black min-h-[220px] sm:min-h-[280px]">
            {prepareError ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{prepareError}</p>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-semibold text-fg-muted hover:bg-nav-hover hover:text-fg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : imageSrc ? (
              <ReactCrop
                className="image-cropper max-h-[min(420px,52vh)]"
                crop={crop || undefined}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop
                keepSelection
                disabled={isSaving}
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  onLoad={handleImageLoad}
                  alt="Crop preview"
                  draggable={false}
                  style={{ imageOrientation: 'none' }}
                  className="block max-w-full max-h-[min(420px,52vh)] w-auto h-auto select-none touch-none"
                />
              </ReactCrop>
            ) : null}

            {!loaded && !prepareError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                <svg className="animate-spin w-6 h-6 text-fg-muted" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3 shrink-0">
            <div
              className="relative w-14 h-14 rounded-full border-2 border-border-strong overflow-hidden bg-surface-alt shrink-0"
              aria-hidden={!previewUrl}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-muted" />
              )}
            </div>
            <p className="text-xs text-fg-subtle leading-relaxed">
              Preview updates as you adjust the crop. Your photo will be saved as a square {AVATAR_SIZE}px image.
            </p>
          </div>

          {saveError && (
            <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400 shrink-0">{saveError}</p>
          )}

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={resetCrop}
              disabled={!loaded || isSaving}
              className="px-3 py-2.5 rounded-xl border border-border text-fg-muted text-sm font-semibold hover:bg-nav-hover hover:text-fg transition-colors disabled:opacity-40"
            >
              Reset crop
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border text-fg-muted text-sm font-semibold hover:bg-nav-hover hover:text-fg transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUsePhoto}
                disabled={!loaded || !completedCrop || isSaving}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/30 transition-colors disabled:opacity-40"
              >
                {isSaving ? 'Saving…' : 'Use Photo'}
              </button>
            </div>
          </div>

          <canvas ref={previewCanvasRef} className="hidden" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
