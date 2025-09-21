import { useState, useEffect } from 'react';
import { getScreenSize, addResizeListener, isMobile, isTablet, isDesktop } from '../utils/responsive';

// 반응형 디자인을 위한 커스텀 훅
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());
  const [isTabletDevice, setIsTabletDevice] = useState(isTablet());
  const [isDesktopDevice, setIsDesktopDevice] = useState(isDesktop());

  useEffect(() => {
    const cleanup = addResizeListener((newScreenSize) => {
      setScreenSize(newScreenSize);
      setIsMobileDevice(isMobile());
      setIsTabletDevice(isTablet());
      setIsDesktopDevice(isDesktop());
    });

    return cleanup;
  }, []);

  return {
    screenSize,
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    isDesktop: isDesktopDevice,
    isMobileOrTablet: isMobileDevice || isTabletDevice
  };
};

// 화면 크기별 조건부 렌더링을 위한 훅
export const useBreakpoint = (breakpoint) => {
  const { screenSize } = useResponsive();
  
  const breakpoints = {
    mobile: 'mobile',
    tablet: 'tablet',
    desktop: 'desktop',
    largeDesktop: 'largeDesktop'
  };
  
  return screenSize === breakpoints[breakpoint];
};

// 모바일에서만 실행되는 훅
export const useMobileOnly = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

// 데스크톱에서만 실행되는 훅
export const useDesktopOnly = () => {
  const { isDesktop } = useResponsive();
  return isDesktop;
};

// 터치 디바이스 감지 훅
export const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouch();
    window.addEventListener('resize', checkTouch);
    
    return () => {
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  return isTouch;
};

// 뷰포트 크기 훅
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
};

// 스크롤 위치 훅 (모바일 최적화)
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { isMobile } = useResponsive();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    // 모바일에서는 passive 이벤트 리스너 사용
    const options = isMobile ? { passive: true } : false;
    window.addEventListener('scroll', handleScroll, options);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return scrollPosition;
};

// 디바이스 방향 훅
export const useOrientation = () => {
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};
