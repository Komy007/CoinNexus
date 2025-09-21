import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StatsContainer = styled.section`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  margin: 0 auto;
  max-width: 1200px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h2 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: var(--spacing-lg);
`;

const StatNumber = styled.div`
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-3xl);
  }
`;

const StatLabel = styled.div`
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatDescription = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
`;

function StatsSection() {
  const stats = [
    {
      number: '10,000+',
      label: '활성 사용자',
      description: '전 세계 트레이더들'
    },
    {
      number: '50+',
      label: '지원 코인',
      description: '주요 암호화폐'
    },
    {
      number: '24/7',
      label: '실시간 모니터링',
      description: '끊임없는 시장 감시'
    },
    {
      number: '99.9%',
      label: '서비스 가동률',
      description: '안정적인 서비스'
    }
  ];

  return (
    <StatsContainer>
      <SectionHeader>
        <h2 data-i18n="stats.title">플랫폼 통계</h2>
        <p data-i18n="stats.description">
          CoinNexus의 성장과 성과를 확인해보세요
        </p>
      </SectionHeader>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel data-i18n={`stats.${index}.label`}>
              {stat.label}
            </StatLabel>
            <StatDescription data-i18n={`stats.${index}.description`}>
              {stat.description}
            </StatDescription>
          </StatCard>
        ))}
      </StatsGrid>
    </StatsContainer>
  );
}

export default StatsSection;
