import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const NoticeBox = styled(motion.div)`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  text-align: center;
`;

const NoticeIcon = styled.div`
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
`;

const NoticeTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--accent-warning);
  margin-bottom: var(--spacing-sm);
`;

const NoticeText = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
`;

function ExchangeRates() {
  return (
    <Container>
      <Header>
        <h3 data-i18n="dashboard.exchange.title">환율 정보</h3>
        <div style={{ color: 'var(--accent-warning)' }}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>
      </Header>
      
      <NoticeBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <NoticeIcon>⚠️</NoticeIcon>
        <NoticeTitle>환율 서비스 일시 중단</NoticeTitle>
        <NoticeText>
          정확한 환율 정보 제공을 위해 현재 환율 서비스를 일시 중단했습니다.<br />
          한국은행 ECOS API 또는 신한은행 Open API 등 공신력 있는 소스 연동 후 재개 예정입니다.<br />
          <strong>부정확한 정보보다는 정확성을 우선합니다.</strong>
        </NoticeText>
      </NoticeBox>
    </Container>
  );
}

export default ExchangeRates;