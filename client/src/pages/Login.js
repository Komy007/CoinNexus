import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: var(--spacing-md);
`;

const LoginCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: var(--text-secondary);
    font-size: var(--font-size-base);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  
  label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: var(--font-size-sm);
  }
`;

const Input = styled.input`
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const Button = styled.button`
  padding: var(--spacing-md);
  background: var(--gradient-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  
  a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: var(--text-primary);
    }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid var(--accent-danger);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  color: var(--accent-danger);
  font-size: var(--font-size-sm);
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  // URL 파라미터에서 관리자 모드 확인
  const searchParams = new URLSearchParams(location.search);
  const isAdminMode = searchParams.get('admin') === 'true';
  
  const [formData, setFormData] = useState({
    email: isAdminMode ? 'admin@coinnexus.com' : '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 이미 로그인된 경우 리다이렉트
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'; // 홈페이지로 이동
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 제거
    
    // 관리자 계정 입력 감지
    if (name === 'email' && (value === 'admin@coinnexus.com' || value === 'admin')) {
      console.log('관리자 계정 감지됨:', value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🚀 로그인 폼 제출됨:', formData);
    console.log('🔍 현재 URL:', window.location.href);
    console.log('🔍 이메일 값:', formData.email);
    console.log('🔍 비밀번호 길이:', formData.password.length);
    
    try {
      // 관리자 계정인지 확인
      const isAdminAccount = isAdminMode || formData.email === 'admin@coinnexus.com' || formData.email === 'admin';
      console.log('관리자 모드:', isAdminMode);
      console.log('관리자 계정 확인:', isAdminAccount);
      
      if (isAdminAccount) {
        console.log('🔐 관리자 로그인 시도:', formData);
        
        // 관리자 API 직접 호출
        const response = await fetch('http://localhost:5000/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.email,
            password: formData.password
          })
        });

        console.log('관리자 API 응답 상태:', response.status);
        const data = await response.json();
        console.log('🔐 관리자 API 응답 데이터:', data);

        if (data.success) {
          // 관리자 토큰 저장
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminInfo', JSON.stringify(data.admin));
          
          console.log('✅ 관리자 토큰 저장 완료');
          console.log('🚀 관리자 대시보드로 이동 중...');
          
          toast.success('관리자 로그인 성공!');
          
          // 강제 페이지 이동 (즉시)
          console.log('💫 페이지 이동 시작...');
          window.location.replace('/admin/dashboard');
          return;
        } else {
          throw new Error(data.message || '관리자 로그인에 실패했습니다.');
        }
      }

      // 일반 사용자 로그인
      const result = await login(formData.email, formData.password);
      if (result.success) {
        const from = location.state?.from?.pathname || '/'; // 홈페이지로 이동
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      const message = err.message || '로그인 중 오류가 발생했습니다.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Helmet>
        <title data-i18n="login.title">로그인 - CoinNexus</title>
        <meta name="description" content="CoinNexus 계정으로 로그인하세요" />
      </Helmet>

      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <h1 data-i18n="login.header.title">
            {isAdminMode ? '관리자 로그인' : '로그인'}
          </h1>
          <p data-i18n="login.header.description">
            {isAdminMode ? 'CoinNexus 관리자 패널에 접속하세요' : 'CoinNexus에 오신 것을 환영합니다'}
          </p>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <label htmlFor="email" data-i18n="login.form.email">이메일</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password" data-i18n="login.form.password">비밀번호</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                로그인 중...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                로그인
              </>
            )}
          </Button>
        </Form>

        <Divider>
          <span data-i18n="login.divider">또는</span>
        </Divider>

        <LinkText>
          <span data-i18n="login.register.text">계정이 없으신가요? </span>
          <Link to="/register" data-i18n="login.register.link">회원가입</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
