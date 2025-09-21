import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

// 액션 타입
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// 초기 상태
const initialState = {
  language: localStorage.getItem('language') || 'ko',
  translations: {},
  loading: true,
  error: null
};

// 리듀서
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
        loading: false
      };
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case LANGUAGE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// 번역 파일 동적 로드
const loadTranslations = async (language) => {
  try {
    const translations = await import(`../locales/${language}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    // 폴백으로 한국어 로드
    if (language !== 'ko') {
      const fallbackTranslations = await import('../locales/ko.json');
      return fallbackTranslations.default;
    }
    throw error;
  }
};

// 번역 함수
const getTranslation = (translations, key, fallback = key) => {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback;
    }
  }
  
  return typeof value === 'string' ? value : fallback;
};

export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // 언어 변경
  const setLanguage = async (language) => {
    dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const translations = await loadTranslations(language);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
      localStorage.setItem('language', language);
      
      // HTML lang 속성 업데이트
      document.documentElement.lang = language;
      
      // 번역 데이터를 상태에 저장
      dispatch({ 
        type: 'SET_TRANSLATIONS', 
        payload: translations 
      });
    } catch (error) {
      dispatch({ type: LANGUAGE_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // 번역 함수
  const t = useCallback((key, fallback) => {
    return getTranslation(state.translations, key, fallback);
  }, [state.translations]);

  // 초기 언어 로드
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const translations = await loadTranslations(state.language);
        dispatch({ 
          type: 'SET_TRANSLATIONS', 
          payload: translations 
        });
        dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
        
        // HTML lang 속성 설정
        document.documentElement.lang = state.language;
      } catch (error) {
        dispatch({ type: LANGUAGE_ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    initializeLanguage();
  }, [state.language]);

  // data-i18n 속성을 가진 요소들의 텍스트 업데이트
  useEffect(() => {
    if (!state.loading && state.translations) {
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        if (translation && translation !== key) {
          element.textContent = translation;
        }
      });
    }
  }, [state.language, state.translations, state.loading, t]);

  const value = {
    ...state,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage은 LanguageProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

// 언어 선택 컴포넌트
export const LanguageSelector = () => {
  const { language, setLanguage, loading } = useLanguage();

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '8px 12px', 
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      style={{
        padding: '8px 12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        cursor: 'pointer'
      }}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
