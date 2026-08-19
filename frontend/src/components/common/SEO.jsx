import { useEffect } from 'react';

/**
 * Lightweight SEO helper component to update document head metadata
 * on client-side route changes in React SPA.
 */
export default function SEO({ title, description, canonicalPath = '', type = 'website' }) {
  useEffect(() => {
    const fullCanonicalUrl = `https://www.linkmakeup.com${canonicalPath}`;

    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Update Description
    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);

      let ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) ogDescMeta.setAttribute('content', description);
    }

    // 3. Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 4. Update OG URL
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute('content', fullCanonicalUrl);
    }
  }, [title, description, canonicalPath, type]);

  return null;
}
