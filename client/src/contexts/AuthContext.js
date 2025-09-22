import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// 액션 타입
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
};

// 초기 상태
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false, // 토큰 검증 후에만 true로 설정
  loading: true
};

// 리듀서
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// API 설정

// Axios 인스턴스 생성
const api = axios.create(API_CONFIG);

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 401 오류 - 토큰 제거 및 로그인 상태 초기화');
      localStorage.removeItem('token');
      // AuthContext의 상태를 직접 업데이트하지 않고, 컴포넌트에서 처리하도록 함
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 토큰 검증
  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    console.log('🔍 토큰 검증 시작:', { hasToken: !!token, token: token?.substring(0, 20) + '...' });
    
    if (!token) {
      console.log('❌ 토큰 없음 - 로그인 실패');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      console.log('📡 토큰 검증 API 호출 중...');
      const response = await api.get('/auth/verify');
      console.log('✅ 토큰 검증 성공:', response.data);
      
      if (response.data.userId) {
        console.log('👤 사용자 정보 조회 중...');
        const userResponse = await api.get('/auth/me');
        console.log('✅ 사용자 정보 조회 성공:', userResponse.data);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userResponse.data.user,
            token
          }
        });
        console.log('🎉 로그인 상태 복원 완료');
      } else {
        console.log('❌ 토큰이 유효하지 않음');
        localStorage.removeItem('token');
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      }
    } catch (error) {
      console.error('❌ 토큰 검증 실패:', error.message, error.response?.status);
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
    } finally {
      console.log('🏁 토큰 검증 완료 - loading 상태 해제');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // 로그인
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      toast.success('로그인 성공!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error(message);
      return { success: false, message };
    }
  };

  // 회원가입
  const register = async (email, password, username) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await api.post('/auth/register', { email, password, username });
      const { token, user } = response.data;
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', token);
      
      // 상태 업데이트
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      toast.success('회원가입이 완료되었습니다!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE });
      toast.error(message);
      return { success: false, message };
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('로그아웃되었습니다.');
  };

  // 사용자 정보 업데이트
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData
    });
  };

  // 프로필 업데이트
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      updateUser(response.data.user);
      toast.success('프로필이 업데이트되었습니다.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // 컴포넌트 마운트 시 토큰 검증
  useEffect(() => {
    verifyToken();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export { api };
