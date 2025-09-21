import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeaturesContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
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
    max-width: 600px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
`;

const FeatureCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-size-2xl);
  color: var(--bg-primary);
`;

const FeatureTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

function FeaturesSection() {
  const features = [
    {
      icon: 'fas fa-chart-line',
      title: '실시간 데이터',
      description: 'Binance, CoinGecko 등 신뢰할 수 있는 소스의 실시간 암호화폐 데이터를 제공합니다.'
    },
    {
      icon: 'fas fa-users',
      title: '전문가 커뮤니티',
      description: '경험 많은 트레이더들과 지식을 공유하고 인사이트를 얻을 수 있습니다.'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: '교육 콘텐츠',
      description: '초보자부터 전문가까지 모든 레벨에 맞는 교육 자료를 제공합니다.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: '안전한 거래',
      description: '검증된 정보와 신뢰할 수 있는 분석으로 안전한 거래를 지원합니다.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: '모바일 최적화',
      description: '언제 어디서나 모바일에서 최적화된 경험을 제공합니다.'
    },
    {
      icon: 'fas fa-globe',
      title: '다국어 지원',
      description: '한국어와 영어를 지원하여 전 세계 사용자들이 이용할 수 있습니다.'
    }
  ];

  return (
    <FeaturesContainer>
      <SectionHeader>
        <h2 data-i18n="features.title">주요 기능</h2>
        <p data-i18n="features.description">
          CoinNexus가 제공하는 강력한 기능들을 확인해보세요
        </p>
      </SectionHeader>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeatureIcon>
              <i className={feature.icon}></i>
            </FeatureIcon>
            <FeatureTitle data-i18n={`features.${index}.title`}>
              {feature.title}
            </FeatureTitle>
            <FeatureDescription data-i18n={`features.${index}.description`}>
              {feature.description}
            </FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesContainer>
  );
}

export default FeaturesSection;
