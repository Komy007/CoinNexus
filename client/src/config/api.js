// API 설정
export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // 프로덕션에서는 같은 도메인 사용
    : 'http://localhost:5000/api', // 개발환경
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const SOCKET_CONFIG = {
  url: process.env.NODE_ENV === 'production' 
    ? '' // 프로덕션에서는 같은 도메인 사용
    : 'http://localhost:5000',
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  }
};
