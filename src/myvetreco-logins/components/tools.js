export const isMobileApp = () => {
  const devices = navigator.userAgent.toLowerCase();
  return /iphone/.test(devices) || /android/.test(devices);
};