export function getDeviceType() {
  const ua = navigator.userAgent || '';
  const width = window.innerWidth;

  if (/Mobi|Android|iPhone|iPod/i.test(ua) || width < 640) return 'mobile';
  if (/iPad|Tablet/i.test(ua) || (width >= 640 && width < 1024)) return 'tablet';
  return 'desktop';
}

export function getUserAgent() {
  return navigator.userAgent || 'Unknown';
}
