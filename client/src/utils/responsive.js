// 반응형 디자인 유틸리티 함수들

// 브레이크포인트 정의
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
  largeDesktop: '1400px'
};

// 미디어 쿼리 헬퍼 함수
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.tablet})`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop})`
};

// 화면 크기 감지 함수
export const getScreenSize = () => {
  const width = window.innerWidth;
  
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  if (width <= 1200) return 'desktop';
  return 'largeDesktop';
};

// 모바일 여부 확인
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// 태블릿 여부 확인
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// 데스크톱 여부 확인
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

// 터치 디바이스 여부 확인
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// 화면 크기 변경 이벤트 리스너
export const addResizeListener = (callback) => {
  const handleResize = () => {
    callback(getScreenSize());
  };
  
  window.addEventListener('resize', handleResize);
  
  // 클린업 함수 반환
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

// 모바일 최적화된 터치 이벤트
export const getTouchEvents = () => {
  if (isTouchDevice()) {
    return {
      onTouchStart: true,
      onTouchEnd: true,
      onTouchMove: true
    };
  }
  return {};
};

// 반응형 그리드 시스템
export const getGridColumns = (screenSize) => {
  switch (screenSize) {
    case 'mobile':
      return 1;
    case 'tablet':
      return 2;
    case 'desktop':
      return 3;
    case 'largeDesktop':
      return 4;
    default:
      return 3;
  }
};

// 반응형 폰트 크기
export const getResponsiveFontSize = (baseSize, screenSize) => {
  const multipliers = {
    mobile: 0.8,
    tablet: 0.9,
    desktop: 1,
    largeDesktop: 1.1
  };
  
  return `${baseSize * (multipliers[screenSize] || 1)}rem`;
};

// 반응형 패딩/마진
export const getResponsiveSpacing = (baseSpacing, screenSize) => {
  const multipliers = {
    mobile: 0.5,
    tablet: 0.75,
    desktop: 1,
    largeDesktop: 1.25
  };
  
  return `${baseSpacing * (multipliers[screenSize] || 1)}rem`;
};

// 모바일 네비게이션 헬퍼
export const getMobileNavigationHeight = () => {
  return isMobile() ? '70px' : '80px';
};

// 스크롤 동작 최적화
export const optimizeScroll = () => {
  if (isMobile()) {
    // 모바일에서 부드러운 스크롤 활성화
    document.documentElement.style.scrollBehavior = 'smooth';
  }
};

// 뷰포트 메타 태그 설정
export const setViewportMeta = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
};

// 모바일 키보드 대응
export const handleMobileKeyboard = () => {
  if (isMobile()) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // 키보드가 올라올 때 뷰포트 조정
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });
  }
};

// 초기화 함수
export const initResponsive = () => {
  setViewportMeta();
  optimizeScroll();
  handleMobileKeyboard();
};
