import { useState } from 'react';
import { getPlatformIcon, getPlatformContainerStyle } from './SocialIcons';
import { resolveLinkIcon } from '../utils/linkIcon';

export function LinkIcon({ icon, title, url, className = 'w-4 h-4', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveLinkIcon(icon, url);

  if (!failed && resolved.type === 'favicon' && resolved.src) {
    return (
      <img
        src={resolved.src}
        alt=""
        className={imgClassName || `${className} rounded-sm object-contain`}
        crossOrigin="anonymous"
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return getPlatformIcon(resolved.icon || title, className);
}

export function getLinkIconContainerStyle(icon, title, url) {
  const resolved = resolveLinkIcon(icon, url);
  if (resolved.type === 'favicon') {
    return 'bg-surface border border-border';
  }
  return getPlatformContainerStyle(icon || title);
}
