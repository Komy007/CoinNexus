import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: var(--spacing-md);
`;

const RegisterCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
`;

const RegisterHeader = styled.div`
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

const PasswordStrength = styled.div`
  margin-top: var(--spacing-xs);
  
  .strength-bar {
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--spacing-xs);
  }
  
  .strength-fill {
    height: 100%;
    transition: all var(--transition-fast);
    border-radius: 2px;
    
    &.weak {
      width: 33%;
      background: var(--accent-danger);
    }
    
    &.medium {
      width: 66%;
      background: var(--accent-warning);
    }
    
    &.strong {
      width: 100%;
      background: var(--accent-success);
    }
  }
  
  .strength-text {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
  }
`;

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 이미 로그인된 경우 리다이렉트
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/community', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력 시 에러 메시지 제거
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { level: 'weak', text: '약함' };
    if (password.length < 10) return { level: 'medium', text: '보통' };
    return { level: 'strong', text: '강함' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 강도 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData.email, formData.password, formData.username);
      if (result.success) {
        // 회원가입 성공 후 즉시 커뮤니티로 이동
        navigate('/community', { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <RegisterContainer>
      <Helmet>
        <title data-i18n="register.title">회원가입 - CoinNexus</title>
        <meta name="description" content="CoinNexus 계정을 만들어보세요" />
      </Helmet>

      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RegisterHeader>
          <h1 data-i18n="register.header.title">회원가입</h1>
          <p data-i18n="register.header.description">
            CoinNexus와 함께 시작하세요
          </p>
        </RegisterHeader>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <label htmlFor="email" data-i18n="register.form.email">이메일</label>
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
            <label htmlFor="username" data-i18n="register.form.username">사용자명</label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="사용자명을 입력하세요"
              required
              disabled={isLoading}
              maxLength={20}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="password" data-i18n="register.form.password">비밀번호</label>
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
            {formData.password && (
              <PasswordStrength>
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength.level}`}></div>
                </div>
                <div className="strength-text">
                  비밀번호 강도: {passwordStrength.text}
                </div>
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <label htmlFor="confirmPassword" data-i18n="register.form.confirmPassword">비밀번호 확인</label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={isLoading}
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                회원가입 중...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                회원가입
              </>
            )}
          </Button>
        </Form>

        <Divider>
          <span data-i18n="register.divider">또는</span>
        </Divider>

        <LinkText>
          <span data-i18n="register.login.text">이미 계정이 있으신가요? </span>
          <Link to="/login" data-i18n="register.login.link">로그인</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;
