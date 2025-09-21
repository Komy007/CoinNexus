import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
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
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h1 {
    font-size: var(--font-size-3xl);
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
`;

const Label = styled.label`
  color: var(--text-primary);
  font-weight: 500;
  font-size: var(--font-size-sm);
`;

const Input = styled.input`
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
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

const ErrorMessage = styled.div`
  color: var(--accent-danger);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-sm);
  background: rgba(239, 83, 80, 0.1);
  border-radius: var(--border-radius);
  border: 1px solid rgba(239, 83, 80, 0.2);
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  
  a {
    color: var(--accent-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('관리자 로그인 시도:', formData);

    try {
      console.log('API 호출 시작: /admin/login');
      const response = await api.post('/admin/login', formData);
      console.log('API 응답:', response.data);
      
      if (response.data.success) {
        // 관리자 토큰 저장
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        
        console.log('관리자 로그인 성공, 대시보드로 이동');
        toast.success('관리자 로그인 성공!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('관리자 로그인 오류:', error);
      console.error('오류 응답:', error.response?.data);
      
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Helmet>
        <title>관리자 로그인 - CoinNexus</title>
        <meta name="description" content="CoinNexus 관리자 로그인" />
      </Helmet>
      
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <h1>관리자 로그인</h1>
          <p>CoinNexus 관리자 패널에 접속하세요</p>
        </LoginHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label htmlFor="username">사용자명 또는 이메일</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="admin 또는 admin@coinnexus.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? (
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

        <BackLink>
          <a href="/">← 메인 사이트로 돌아가기</a>
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default AdminLogin;
