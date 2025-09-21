import React, { useState } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const AdminCard = styled.div`
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: #00d4aa;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  
  p {
    color: #888;
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #0a0a0a;
  color: #fff;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(135deg, #00d4aa 0%, #00a085 100%);
  color: #0a0a0a;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 20px;
  
  a {
    color: #00d4aa;
    text-decoration: none;
    font-size: 14px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Admin() {
  const [formData, setFormData] = useState({
    username: 'admin@coinnexus.com',
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

    console.log('🔐 관리자 로그인 시도:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 API 응답 상태:', response.status);
      const data = await response.json();
      console.log('📊 API 응답 데이터:', data);

      if (data.success) {
        // 관리자 정보 저장
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        
        console.log('✅ 관리자 인증 정보 저장 완료');
        console.log('🎯 저장된 토큰:', data.token.substring(0, 20) + '...');
        
        toast.success('관리자 로그인 성공!');
        
        // 관리자 대시보드로 이동
        console.log('🚀 관리자 대시보드로 이동...');
        setTimeout(() => {
          window.location.replace('/admin-dashboard');
        }, 500);
        
      } else {
        throw new Error(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('❌ 관리자 로그인 오류:', error);
      setError(error.message || '로그인에 실패했습니다.');
      toast.error(error.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContainer>
      <Helmet>
        <title>관리자 로그인 - CoinNexus</title>
      </Helmet>
      
      <AdminCard>
        <Header>
          <h1>🔐 관리자 로그인</h1>
          <p>CoinNexus 관리자 패널에 접속하세요</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="사용자명 또는 이메일"
            required
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호: 61756175@"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '🔐 관리자 로그인'}
          </Button>
        </Form>

        <BackLink>
          <a href="/">← 메인 사이트로 돌아가기</a>
        </BackLink>
      </AdminCard>
    </AdminContainer>
  );
}

export default Admin;
