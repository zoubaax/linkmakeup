import { useEffect } from 'react';

/**
 * SeoHead component for dynamically updating title, meta tags,
 * canonical link, and JSON-LD structured data in client-side React.
 */
export default function SeoHead({
  title = 'LinkMakeup | Bio Link & NFC Smart Card for Tech Creators & Engineers',
  description = 'Build your ultimate tech bio link and tap-to-share NFC smart business card. Showcase your GitHub, LinkedIn, tech stack, and booking links in one sleek hub.',
  keywords = 'link in bio, software engineer bio link, nfc business card, linkedin creators, tech portfolio',
  canonicalUrl,
  ogImage = '/og-image.jpg',
  structuredData,
}) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to set or create meta tags
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

    // 3. OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // 4. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    const currentPath = window.location.pathname;
    const href = canonicalUrl || `https://www.linkmakeup.com${currentPath === '/' ? '' : currentPath}`;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);

    // 6. JSON-LD Structured Data
    let scriptTag = document.querySelector('#seo-structured-data');
    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null;
}
