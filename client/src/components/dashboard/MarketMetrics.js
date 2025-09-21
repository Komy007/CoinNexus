import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { api } from '../../contexts/AuthContext';

const MetricsContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
`;

const MetricCard = styled(motion.div)`
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.gradient || 'var(--gradient-primary)'};
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  
  .title {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    color: white;
    background: ${props => props.iconBg || 'var(--gradient-primary)'};
  }
`;

const MetricValue = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
  }
`;

const MetricChange = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  
  &.positive {
    color: var(--accent-success);
  }
  
  &.negative {
    color: var(--accent-danger);
  }
  
  &.neutral {
    color: var(--text-secondary);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--bg-tertiary);
    border-top: 3px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: var(--accent-danger);
  padding: var(--spacing-xl);
`;

function MarketMetrics() {
  // 시장 데이터 조회
  const { data: marketData, isLoading: marketLoading, error: marketError } = useQuery(
    'market-data',
    () => api.get('/market/data').then(res => res.data),
    { refetchInterval: 30000 } // 30초마다 갱신
  );

  // 공포 및 탐욕 지수 조회
  const { data: fearGreedData, isLoading: fearGreedLoading } = useQuery(
    'fear-greed',
    () => api.get('/market/fear-greed').then(res => res.data),
    { refetchInterval: 30000 }
  );

  // 펀딩비 조회
  const { data: fundingData, isLoading: fundingLoading } = useQuery(
    'funding-rates',
    () => api.get('/market/funding-rates').then(res => res.data),
    { refetchInterval: 60000 }
  );

  // 미결제 약정 조회
  const { data: openInterestData, isLoading: openInterestLoading } = useQuery(
    'open-interest',
    () => api.get('/market/open-interest').then(res => res.data),
    { refetchInterval: 60000 }
  );

  if (marketLoading || fearGreedLoading || fundingLoading || openInterestLoading) {
    return (
      <MetricsContainer>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </MetricsContainer>
    );
  }

  if (marketError) {
    return (
      <MetricsContainer>
        <ErrorMessage>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <p data-i18n="dashboard.metrics.error">시장 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </ErrorMessage>
      </MetricsContainer>
    );
  }

  const btcData = marketData?.data?.find(coin => coin.symbol === 'BTC');
  const ethData = marketData?.data?.find(coin => coin.symbol === 'ETH');
  
  // eslint-disable-next-line no-unused-vars
  const getFearGreedColor = (value) => {
    if (value >= 75) return 'positive';
    if (value <= 25) return 'negative';
    return 'neutral';
  };

  const getFearGreedText = (value) => {
    if (value >= 75) return '극도의 탐욕';
    if (value >= 55) return '탐욕';
    if (value >= 45) return '중립';
    if (value >= 25) return '공포';
    return '극도의 공포';
  };

  const metrics = [
    {
      title: 'BTC 가격',
      value: btcData ? `$${btcData.price?.toLocaleString()}` : '--',
      change: btcData?.changePercent24h,
      icon: 'fab fa-bitcoin',
      iconBg: 'linear-gradient(135deg, #f7931a, #ffb347)',
      gradient: 'linear-gradient(135deg, #f7931a, #ffb347)'
    },
    {
      title: 'ETH 가격',
      value: ethData ? `$${ethData.price?.toLocaleString()}` : '--',
      change: ethData?.changePercent24h,
      icon: 'fab fa-ethereum',
      iconBg: 'linear-gradient(135deg, #627eea, #4f46e5)',
      gradient: 'linear-gradient(135deg, #627eea, #4f46e5)'
    },
    {
      title: '공포 & 탐욕 지수',
      value: fearGreedData?.value || '--',
      change: fearGreedData?.value ? (fearGreedData.value - 50) : 0,
      icon: 'fas fa-brain',
      iconBg: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
      gradient: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
      subtitle: getFearGreedText(fearGreedData?.value || 50)
    },
    {
      title: '평균 펀딩비',
      value: fundingData?.data?.[0] ? 
        `${(fundingData.data[0].fundingRate * 100).toFixed(4)}%` : '--',
      change: fundingData?.data?.[0] ? 
        (fundingData.data[0].fundingRate * 100) : 0,
      icon: 'fas fa-percentage',
      iconBg: 'linear-gradient(135deg, #00d4aa, #00a8cc)',
      gradient: 'linear-gradient(135deg, #00d4aa, #00a8cc)'
    },
    {
      title: '총 미결제 약정',
      value: openInterestData?.data?.length ? 
        `${(openInterestData.data.reduce((sum, item) => sum + item.openInterest, 0) / 1000000000).toFixed(2)}B` : '--',
      change: 0,
      icon: 'fas fa-chart-line',
      iconBg: 'linear-gradient(135deg, #9c27b0, #e91e63)',
      gradient: 'linear-gradient(135deg, #9c27b0, #e91e63)'
    },
    {
      title: '시장 총 가치',
      value: marketData?.data?.length ? 
        `$${marketData.data.reduce((sum, coin) => sum + (coin.marketCap || 0), 0).toLocaleString()}` : '--',
      change: 0,
      icon: 'fas fa-globe',
      iconBg: 'linear-gradient(135deg, #4caf50, #8bc34a)',
      gradient: 'linear-gradient(135deg, #4caf50, #8bc34a)'
    }
  ];

  return (
    <MetricsContainer>
      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            gradient={metric.gradient}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MetricHeader iconBg={metric.iconBg}>
              <div className="title" data-i18n={`dashboard.metrics.${metric.title.toLowerCase().replace(/\s+/g, '')}`}>
                {metric.title}
              </div>
              <div className="icon">
                <i className={metric.icon}></i>
              </div>
            </MetricHeader>
            
            <MetricValue>{metric.value}</MetricValue>
            
            {metric.subtitle && (
              <div style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--text-secondary)', 
                marginBottom: 'var(--spacing-sm)' 
              }}>
                {metric.subtitle}
              </div>
            )}
            
            <MetricChange className={
              metric.change > 0 ? 'positive' : 
              metric.change < 0 ? 'negative' : 'neutral'
            }>
              <i className={`fas fa-arrow-${metric.change >= 0 ? 'up' : 'down'}`}></i>
              {metric.change !== 0 && `${Math.abs(metric.change).toFixed(2)}%`}
            </MetricChange>
          </MetricCard>
        ))}
      </MetricsGrid>
    </MetricsContainer>
  );
}

export default MarketMetrics;
