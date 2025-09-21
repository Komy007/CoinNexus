import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../../contexts/AuthContext';

const ChartContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const ChartHeader = styled.div`
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

const ChartContent = styled.div`
  text-align: center;
`;

const GaugeContainer = styled.div`
  position: relative;
  width: 200px;
  height: 100px;
  margin: 0 auto var(--spacing-lg);
`;

const GaugeBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 100px 100px 0 0;
  background: conic-gradient(
    from 180deg,
    var(--accent-danger) 0deg,
    var(--accent-warning) 90deg,
    var(--accent-success) 180deg
  );
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 0;
    background: var(--bg-secondary);
    border-radius: 80px 80px 0 0;
  }
`;

const GaugeNeedle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 60px;
  background: var(--text-primary);
  transform-origin: bottom center;
  transform: translateX(-50%) rotate(${props => props.$rotation}deg);
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background: var(--text-primary);
    border-radius: 50%;
  }
`;

const GaugeValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  z-index: 3;
`;

const GaugeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
`;

const StatusText = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: ${props => {
    if (props.value >= 75) return 'var(--accent-success)';
    if (props.value <= 25) return 'var(--accent-danger)';
    return 'var(--accent-warning)';
  }};
  margin-bottom: var(--spacing-sm);
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

function FearGreedChart() {
  const { data: fearGreedData, isLoading } = useQuery(
    'fear-greed',
    () => api.get('/market/fear-greed').then(res => res.data),
    { refetchInterval: 30000 }
  );

  const getStatusText = (value) => {
    if (value >= 75) return '극도의 탐욕';
    if (value >= 55) return '탐욕';
    if (value >= 45) return '중립';
    if (value >= 25) return '공포';
    return '극도의 공포';
  };

  const getNeedleRotation = (value) => {
    // 0-100 값을 -90도에서 90도로 매핑
    return (value - 50) * 1.8;
  };

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <h3 data-i18n="dashboard.fearGreed.title">공포 & 탐욕 지수</h3>
        </ChartHeader>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </ChartContainer>
    );
  }

  const value = fearGreedData?.data?.value || 50;

  return (
    <ChartContainer>
      <ChartHeader>
        <h3 data-i18n="dashboard.fearGreed.title">공포 & 탐욕 지수</h3>
      </ChartHeader>
      
      <ChartContent>
        <GaugeContainer>
          <GaugeBackground />
          <GaugeNeedle $rotation={getNeedleRotation(value)} />
          <GaugeValue>{value}</GaugeValue>
        </GaugeContainer>
        
        <StatusText value={value}>
          {getStatusText(value)}
        </StatusText>
        
        <GaugeLabels>
          <span>극도의 공포</span>
          <span>중립</span>
          <span>극도의 탐욕</span>
        </GaugeLabels>
      </ChartContent>
    </ChartContainer>
  );
}

export default FearGreedChart;
