import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../../contexts/AuthContext';

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

const CoinList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
    transform: translateX(4px);
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const RankBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => {
    if (props.$rank <= 3) return 'var(--gradient-primary)';
    return 'var(--bg-hover)';
  }};
  color: ${props => props.$rank <= 3 ? 'var(--bg-primary)' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
`;

const Symbol = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-base);
`;

const VolumeInfo = styled.div`
  text-align: right;
`;

const Volume = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
`;

const Change = styled.div`
  font-size: var(--font-size-xs);
  color: ${props => props.$positive ? 'var(--accent-success)' : 'var(--accent-danger)'};
  font-weight: 500;
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

function TopVolumeCoins() {
  const { data: volumeData, isLoading, error } = useQuery(
    'top-volume',
    () => api.get('/market/top-volume').then(res => res.data),
    { refetchInterval: 60000 }
  );

  const formatVolume = (volume) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <h3 data-i18n="dashboard.topVolume.title">거래량 상위</h3>
        </Header>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </Container>
    );
  }

  if (error || !volumeData?.data?.length) {
    return (
      <Container>
        <Header>
          <h3 data-i18n="dashboard.topVolume.title">거래량 상위</h3>
        </Header>
        <EmptyState>
          <i className="fas fa-exclamation-triangle"></i>
          <p data-i18n="dashboard.topVolume.error">거래량 데이터를 불러올 수 없습니다</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3 data-i18n="dashboard.topVolume.title">거래량 상위</h3>
      </Header>
      
      <CoinList>
        {volumeData.data.slice(0, 8).map((coin, index) => (
          <CoinItem key={coin.symbol}>
            <CoinInfo>
              <RankBadge $rank={index + 1}>
                {index + 1}
              </RankBadge>
              <Symbol>{coin.symbol}</Symbol>
            </CoinInfo>
            
            <VolumeInfo>
              <Volume>{formatVolume(coin.volume)}</Volume>
              <Change $positive={coin.priceChangePercent >= 0}>
                {coin.priceChangePercent >= 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
              </Change>
            </VolumeInfo>
          </CoinItem>
        ))}
      </CoinList>
    </Container>
  );
}

export default TopVolumeCoins;
