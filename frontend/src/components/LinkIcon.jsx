import { useState, useMemo } from 'react';
import { getPlatformIcon, getPlatformContainerStyle } from './SocialIcons';
import { resolveLinkIcon } from '../utils/linkIcon';

export function LinkIcon({ icon, title, url, className = 'w-4 h-4', imgClassName = '' }) {
  const resolved = resolveLinkIcon(icon, url);
  const srcList = useMemo(() => resolved.srcList || (resolved.src ? [resolved.src] : []), [resolved.src, resolved.srcList]);
  const [srcIndex, setSrcIndex] = useState(0);

  if (resolved.type === 'favicon' && srcList.length > 0 && srcIndex < srcList.length) {
    return (
      <img
        key={srcList[srcIndex]}
        src={srcList[srcIndex]}
        alt=""
        className={imgClassName || `${className} rounded-sm object-contain`}
        // No crossOrigin for display — avoids CORS taint on subdomains (user.linkmakeup.com → api.linkmakeup.com).
        // html-to-image export inlines via fetch separately.
        onError={() => setSrcIndex((i) => i + 1)}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
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
