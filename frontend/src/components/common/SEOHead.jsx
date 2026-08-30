import React, { useEffect } from 'react';

/**
 * SEOHead Component
 * Dynamically updates page titles, meta descriptions, canonical URLs, hreflangs,
 * OpenGraph cards, Twitter cards, and JSON-LD structured data.
 * 
 * Ensures all pages adhere to Link Make Up brand standards and SEO strategy.
 */
export default function SEOHead({
  title = "Link Make Up — Digital Identity Platform | Link in Bio, Digital Business Card & NFC",
  description = "Link Make Up is the professional digital identity platform. Build your link in bio, personal subdomain, digital business card, CV portfolio, and smart NFC cards.",
  keywords = "Link Make Up, link in bio, digital business card, NFC business card, carte de visite digitale Maroc, carte NFC Maroc, personal subdomain, online CV, portfolio builder",
  canonicalUrl = "https://www.linkmakeup.com/",
  ogType = "website",
  ogImage = "https://www.linkmakeup.com/og-image.png",
  noindex = false,
  jsonLd = null
}) {
  useEffect(() => {
    // 1. Update Title (Strict Link Make Up brand format)
    const formattedTitle = title.includes("Link Make Up") 
      ? title 
      : `${title} | Link Make Up`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          const propMatch = selector.match(/property="([^"]+)"/);
          if (propMatch) element.setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Set Basic Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="keywords"]', 'content', keywords);
    setMetaTag('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="geo.region"]', 'content', 'MA');
    setMetaTag('meta[name="geo.placename"]', 'content', 'Morocco');

    // 3. Set OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'content', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[property="og:image"]', 'content', ogImage);
    setMetaTag('meta[property="og:site_name"]', 'content', 'Link Make Up');

    // 4. Set Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Schema
    const schemaId = 'dynamic-seo-jsonld';
    let scriptTag = document.getElementById(schemaId);
    if (scriptTag) scriptTag.remove();

    if (jsonLd) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptTag);
    }
  }, [title, description, keywords, canonicalUrl, ogType, ogImage, noindex, jsonLd]);

  return null;
}
