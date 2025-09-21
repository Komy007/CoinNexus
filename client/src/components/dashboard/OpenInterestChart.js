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
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const BarItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
`;

const SymbolLabel = styled.div`
  width: 80px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  text-align: right;
`;

const BarContainer = styled.div`
  flex: 1;
  height: 20px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled.div`
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 10px;
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const ValueLabel = styled.div`
  width: 80px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: left;
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
    color: var(--accent-primary);
  }
`;

function OpenInterestChart() {
  const { data: openInterestData, isLoading, error } = useQuery(
    'open-interest',
    () => api.get('/market/open-interest').then(res => res.data),
    { refetchInterval: 60000 }
  );

  const formatValue = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartHeader>
          <h3 data-i18n="dashboard.openInterest.title">미결제 약정</h3>
        </ChartHeader>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </ChartContainer>
    );
  }

  if (error || !openInterestData?.data?.length) {
    return (
      <ChartContainer>
        <ChartHeader>
          <h3 data-i18n="dashboard.openInterest.title">미결제 약정</h3>
        </ChartHeader>
        <EmptyState>
          <i className="fas fa-exclamation-triangle"></i>
          <p data-i18n="dashboard.openInterest.error">미결제 약정 데이터를 불러올 수 없습니다</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const data = openInterestData.data.slice(0, 8);
  const maxValue = Math.max(...data.map(item => item.openInterest));

  return (
    <ChartContainer>
      <ChartHeader>
        <h3 data-i18n="dashboard.openInterest.title">미결제 약정</h3>
      </ChartHeader>
      
      <ChartContent>
        {data.map((item, index) => {
          const percentage = (item.openInterest / maxValue) * 100;
          
          return (
            <BarItem key={item.symbol}>
              <SymbolLabel>{item.symbol}</SymbolLabel>
              <BarContainer>
                <BarFill $percentage={percentage} />
              </BarContainer>
              <ValueLabel>{formatValue(item.openInterest)}</ValueLabel>
            </BarItem>
          );
        })}
      </ChartContent>
    </ChartContainer>
  );
}

export default OpenInterestChart;
