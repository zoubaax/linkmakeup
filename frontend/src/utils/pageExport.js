export const MARKETING_DOMAIN = 'linkmakeup.com';

export function getMarketingDomain() {
  return MARKETING_DOMAIN;
}

export function getMarketingSiteUrl() {
  return `https://${MARKETING_DOMAIN}`;
}

export function getCopyrightNotice() {
  const year = new Date().getFullYear();
  return `© ${year} LinkMakeup`;
}

export function getCopyrightLine() {
  return `${getCopyrightNotice()} · All rights reserved.`;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildEmbedCode({ profile, publicUrl }) {
  const title = escapeHtml(profile?.displayName || profile?.username || 'LinkMakeup page');
  const marketingUrl = escapeHtml(getMarketingSiteUrl());

  return `<div style="max-width:420px;margin:0 auto;font-family:Inter,system-ui,sans-serif">
  <iframe
    src="${escapeHtml(publicUrl)}"
    title="${title}"
    width="100%"
    height="680"
    style="border:0;border-radius:28px;box-shadow:0 18px 50px rgba(0,0,0,0.1);background:#fafafa;"
    loading="lazy"
    allow="clipboard-write"
  ></iframe>
  <div style="margin:10px 0 0;text-align:center;font-size:11px;color:#71717a;line-height:1.5">
    <a href="${marketingUrl}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;font-size:9px;opacity:0.55;letter-spacing:0.02em">${escapeHtml(getCopyrightLine())}</a>
  </div>
</div>`;
}

function downloadDataUrl(dataUrl, filename) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

function escapeXmlAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function decodeSvgDataUrl(dataUrl) {
  if (dataUrl.startsWith('data:image/svg+xml;charset=utf-8,')) {
    return decodeURIComponent(dataUrl.slice('data:image/svg+xml;charset=utf-8,'.length));
  }

  const base64Marker = 'base64,';
  const base64Index = dataUrl.indexOf(base64Marker);
  if (base64Index !== -1) {
    return atob(dataUrl.slice(base64Index + base64Marker.length));
  }

  const commaIndex = dataUrl.indexOf(',');
  return decodeURIComponent(dataUrl.slice(commaIndex + 1));
}

function ensureSvgLinkNamespace(svgText) {
  if (svgText.includes('xmlns:xlink=')) {
    return svgText;
  }

  return svgText.replace(
    '<svg',
    '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
  );
}

function collectLinkHotspots(rootNode) {
  const rootRect = rootNode.getBoundingClientRect();

  return [...rootNode.querySelectorAll('a[href]')]
    .map((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
        return null;
      }

      const rect = anchor.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return null;
      }

      return {
        href: anchor.href,
        title: anchor.getAttribute('aria-label') || anchor.textContent?.trim().slice(0, 80) || '',
        x: rect.left - rootRect.left,
        y: rect.top - rootRect.top,
        width: rect.width,
        height: rect.height,
      };
    })
    .filter(Boolean);
}

function injectClickableLinksIntoSvg(svgText, hotspots) {
  if (!hotspots.length) {
    return svgText;
  }

  const linkLayer = hotspots.map(({ href, x, y, width, height, title }) => {
    const safeHref = escapeXmlAttr(href);
    const titleAttr = title ? ` aria-label="${escapeXmlAttr(title)}"` : '';

    return [
      `<a href="${safeHref}" xlink:href="${safeHref}" target="_blank" rel="noopener noreferrer"${titleAttr}>`,
      `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}" fill="transparent" pointer-events="all"/>`,
      '</a>',
    ].join('');
  }).join('');

  const overlay = `<g id="export-link-hotspots">${linkLayer}</g>`;

  if (!svgText.includes('</svg>')) {
    return svgText;
  }

  return svgText.replace('</svg>', `${overlay}</svg>`);
}

function downloadSvgText(svgText, filename) {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(blobUrl);
}

function waitForImage(img) {
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Image failed to load.'));
    };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image.'));
    reader.readAsDataURL(blob);
  });
}

const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ZkAAAAASUVORK5CYII=';

async function inlineImage(img) {
  const src = img.getAttribute('src');
  if (!src || src.startsWith('data:') || src.startsWith('blob:')) {
    return;
  }

  img.crossOrigin = 'anonymous';

  try {
    const response = await fetch(src, {
      mode: 'cors',
      credentials: src.startsWith(env.apiUrl) ? 'include' : 'omit',
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`Image fetch failed (${response.status}).`);
    }

    const blob = await response.blob();
    img.src = await blobToDataUrl(blob);
    await waitForImage(img);
  } catch {
    img.src = TRANSPARENT_PIXEL;
  }
}

async function prepareNodeForExport(node) {
  const images = [...node.querySelectorAll('img')];
  await Promise.all(images.map((img) => inlineImage(img)));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export async function exportPreviewNode(node, { format, filenameBase }) {
  if (!node) throw new Error('Nothing to export.');

  await prepareNodeForExport(node);

  const { toPng, toSvg } = await import('html-to-image');
  const baseOptions = {
    cacheBust: false,
    skipAutoScale: false,
    includeQueryParams: true,
    skipFonts: true,
    filter: (element) => !element.dataset?.exportIgnore,
    imagePlaceholder: () => TRANSPARENT_PIXEL,
    fetchRequestInit: {
      mode: 'cors',
      credentials: 'include',
    },
  };

  if (format === 'png') {
    const dataUrl = await toPng(node, {
      ...baseOptions,
      pixelRatio: 3,
      backgroundColor: '#f4f4f5',
    });
    downloadDataUrl(dataUrl, `${filenameBase}.png`);
    return;
  }

  const dataUrl = await toSvg(node, {
    ...baseOptions,
    pixelRatio: 1,
    backgroundColor: '#f4f4f5',
  });

  const hotspots = collectLinkHotspots(node);
  let svgText = decodeSvgDataUrl(dataUrl);
  svgText = ensureSvgLinkNamespace(svgText);
  svgText = injectClickableLinksIntoSvg(svgText, hotspots);
  downloadSvgText(svgText, `${filenameBase}.svg`);
}
