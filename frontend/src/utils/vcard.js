/**
 * Utility for generating and downloading client-side vCard (.vcf) contact cards
 * Compatible with iOS (Apple Contacts), Android Contacts, macOS, and Windows.
 */

async function getBase64Photo(url) {
  if (!url) return null;
  try {
    if (url.startsWith('data:image/')) {
      const parts = url.split(',');
      return parts.length > 1 ? parts[1] : null;
    }

    return await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 300;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          const minDim = Math.min(img.naturalWidth || size, img.naturalHeight || size);
          const sx = ((img.naturalWidth || size) - minDim) / 2;
          const sy = ((img.naturalHeight || size) - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const base64 = dataUrl.split(',')[1];
          resolve(base64 || null);
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } catch {
    return null;
  }
}

export async function buildVCardString({ profile, links = [], publicUrl = '', photoUrl = '' }) {
  const displayName = (profile?.displayName || profile?.username || 'Contact').trim();
  const role = (profile?.role || '').trim();
  const bio = (profile?.bio || '').trim();
  const username = profile?.username || 'contact';
  
  // Resolve target URL
  const targetUrl = publicUrl || (typeof window !== 'undefined' ? window.location.href : `https://linkmakeup.com/${username}`);

  // Split name into first and last name
  const nameParts = displayName.split(/\s+/);
  const firstName = nameParts[0] || displayName;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  // Extract phone, email, and social links if present in active links
  const activeLinks = Array.isArray(links) ? links.filter((l) => l && l.isActive !== false) : [];
  
  let email = profile?.email || '';
  let phone = profile?.phone || '';

  activeLinks.forEach((link) => {
    const url = link.url || '';
    if (!email && (url.startsWith('mailto:') || (url.includes('@') && !url.startsWith('http')))) {
      email = url.replace(/^mailto:/i, '').trim();
    }
    if (!phone && (url.startsWith('tel:') || url.startsWith('whatsapp:') || url.includes('wa.me'))) {
      if (url.startsWith('tel:')) {
        phone = url.replace(/^tel:/i, '').trim();
      } else if (url.includes('wa.me/')) {
        const match = url.match(/wa\.me\/([0-9+]+)/);
        if (match) phone = match[1];
      }
    }
  });

  // Attempt to load photo base64
  const avatarToFetch = photoUrl || profile?.avatarUrl || profile?.avatar;
  const photoBase64 = await getBase64Photo(avatarToFetch);

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${displayName}`,
    `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
    photoBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}` : '',
    role ? `TITLE;CHARSET=UTF-8:${role}` : '',
    `ORG;CHARSET=UTF-8:LinkMakeup`,
    email ? `EMAIL;TYPE=INTERNET;TYPE=WORK:${email}` : '',
    phone ? `TEL;TYPE=CELL;TYPE=VOICE:${phone}` : '',
    `URL;TYPE=WORK:${targetUrl}`,
    bio ? `NOTE;CHARSET=UTF-8:${bio.replace(/\n/g, '\\n')}` : '',
    'END:VCARD',
  ];

  return lines.filter(Boolean).join('\r\n');
}

export async function downloadVCard({ profile, links = [], publicUrl = '', photoUrl = '' }) {
  try {
    const vcardContent = await buildVCardString({ profile, links, publicUrl, photoUrl });
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    const filename = `${(profile?.username || profile?.displayName || 'contact').toLowerCase().replace(/[^a-z0-9_-]/gi, '_')}.vcf`;
    
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.setAttribute('download', filename);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    
    setTimeout(() => {
      if (document.body.contains(anchor)) {
        document.body.removeChild(anchor);
      }
      URL.revokeObjectURL(blobUrl);
    }, 250);

    return true;
  } catch (err) {
    console.error('Failed to download vCard:', err);
    return false;
  }
}
