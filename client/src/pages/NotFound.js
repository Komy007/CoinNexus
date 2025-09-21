import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: var(--spacing-md);
`;

const NotFoundContent = styled(motion.div)`
  text-align: center;
  max-width: 600px;
  
  .error-code {
    font-size: 8rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--spacing-md);
    line-height: 1;
    
    @media (max-width: 768px) {
      font-size: 6rem;
    }
  }
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-2xl);
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  &.primary {
    background: var(--gradient-primary);
    color: var(--bg-primary);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--text-primary);
    border: 2px solid var(--accent-primary);
    
    &:hover {
      background: var(--accent-primary);
      color: var(--bg-primary);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.1;
  animation: float 8s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
  
  &:nth-child(4) {
    top: 40%;
    right: 30%;
    animation-delay: 6s;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-30px) rotate(180deg);
    }
  }
`;

function NotFound() {
  return (
    <NotFoundContainer>
      <Helmet>
        <title data-i18n="404.title">페이지를 찾을 수 없습니다 - CoinNexus</title>
        <meta name="description" content="요청하신 페이지를 찾을 수 없습니다" />
      </Helmet>

      <FloatingElements>
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
      </FloatingElements>

      <NotFoundContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="error-code">404</div>
        <h1 data-i18n="404.title">페이지를 찾을 수 없습니다</h1>
        <p data-i18n="404.description">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
          URL을 확인하시거나 홈페이지로 돌아가시기 바랍니다.
        </p>
        
        <ActionButtons>
          <Button to="/" className="primary" data-i18n="404.action.home">
            <i className="fas fa-home"></i>
            홈으로 가기
          </Button>
          <Button to="/dashboard" className="secondary" data-i18n="404.action.dashboard">
            <i className="fas fa-chart-line"></i>
            대시보드
          </Button>
        </ActionButtons>
      </NotFoundContent>
    </NotFoundContainer>
  );
}

export default NotFound;
