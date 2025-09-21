import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
`;

const HeaderText = styled.div`
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }
  
  p {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const LastUpdated = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-success);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }
  
  &.primary {
    background: var(--gradient-primary);
    color: var(--bg-primary);
    border-color: transparent;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }
`;

function DashboardHeader() {
  const currentTime = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // 데이터 내보내기 기능 구현
    console.log('데이터 내보내기');
  };

  const handleSettings = () => {
    // 설정 페이지로 이동
    console.log('설정 페이지');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderText>
            <h1 data-i18n="dashboard.header.title">실시간 대시보드</h1>
            <p data-i18n="dashboard.header.description">
              암호화폐 시장의 모든 것을 한눈에
            </p>
          </HeaderText>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-md)' }}>
            <LastUpdated>
              <div className="indicator"></div>
              <span data-i18n="dashboard.header.lastUpdated">마지막 업데이트:</span>
              <span>{currentTime}</span>
            </LastUpdated>
            
            <QuickActions>
              <ActionButton onClick={handleRefresh} data-i18n="dashboard.header.refresh">
                <i className="fas fa-sync-alt"></i>
                새로고침
              </ActionButton>
              <ActionButton onClick={handleExport} data-i18n="dashboard.header.export">
                <i className="fas fa-download"></i>
                내보내기
              </ActionButton>
              <ActionButton onClick={handleSettings} data-i18n="dashboard.header.settings">
                <i className="fas fa-cog"></i>
                설정
              </ActionButton>
            </QuickActions>
          </div>
        </motion.div>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default DashboardHeader;
