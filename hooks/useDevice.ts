
import { useState, useEffect } from 'react';

export type DeviceOS = 'ios' | 'android' | 'desktop';

export const useDevice = (): DeviceOS => {
  const [os, setOs] = useState<DeviceOS>('desktop');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setOs('ios');
    } else if (/android/.test(ua)) {
      setOs('android');
    } else {
      setOs('desktop');
    }
  }, []);

  return os;
};
