
import { useState, useEffect } from 'react';

export type DeviceOS = 'ios' | 'android' | 'desktop';

export const useDevice = (): DeviceOS => {
  const [os, setOs] = useState<DeviceOS>('desktop');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIos) {
      setOs('ios');
    } else if (isAndroid) {
      setOs('android');
    } else {
      setOs('desktop');
    }
  }, []);

  return os;
};
