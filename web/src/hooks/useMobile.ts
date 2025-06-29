import { useState, useEffect } from 'react';

const mobileWidth = 768; // Mobile breakpoint in pixels

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < mobileWidth : false
  );

  const handleWindowSizeChange = () => {
    setIsMobile(window.innerWidth < mobileWidth);
  };

  useEffect(() => {
    // Set initial state
    handleWindowSizeChange();

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return isMobile;
};
