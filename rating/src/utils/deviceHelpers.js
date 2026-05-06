
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  return "Desktop";
};
