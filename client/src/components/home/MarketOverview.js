import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { api } from '../../contexts/AuthContext';

const SectionContainer = styled.section`
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

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
`;

const MarketCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    
    &.fear-greed {
      background: linear-gradient(135deg, #ff6b6b, #ffa726);
      color: white;
    }
    
    &.funding {
      background: linear-gradient(135deg, #00d4aa, #00a8cc);
      color: white;
    }
    
    &.volume {
      background: linear-gradient(135deg, #9c27b0, #e91e63);
      color: white;
    }
  }
`;

const CardContent = styled.div`
  .value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .description {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.5;
  }
  
  .change {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
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
  }
`;

const TopCoinsSection = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const TopCoinsHeader = styled.div`
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
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
  }
  
  .coin-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    .symbol {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
  }
  
  .price-info {
    text-align: right;
    
    .price {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .change {
      font-size: var(--font-size-sm);
      font-weight: 500;
      
      &.positive {
        color: var(--accent-success);
      }
      
      &.negative {
        color: var(--accent-danger);
      }
    }
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

function MarketOverview() {
  // 실시간 가격 정보 조회
  const { data: pricesData, isLoading: pricesLoading, error: pricesError } = useQuery(
    'market-prices',
    async () => {
      try {
        console.log('API 호출 시작: /market/prices');
        const response = await api.get('/market/prices');
        console.log('API 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
      }
    },
    { 
      refetchInterval: 10000, // 10초마다 갱신
      refetchOnWindowFocus: true,
      staleTime: 5000, // 5초 후 stale로 간주
      retry: 3, // 3번 재시도
      retryDelay: 1000 // 1초 후 재시도
    }
  );

  // 공포 및 탐욕 지수 조회
  const { data: fearGreedData, isLoading: fearGreedLoading } = useQuery(
    'fear-greed',
    async () => {
      console.log('🧠 공포탐욕지수 API 호출 시작');
      const response = await api.get('/market/fear-greed');
      console.log('🧠 공포탐욕지수 API 응답:', response.data);
      return response.data;
    },
    { 
      refetchInterval: 120000, // 2분마다 갱신 (Rate Limit 방지)
      staleTime: 60000, // 1분 후 stale
      retry: 2,
      retryDelay: 3000
    }
  );

  // 펀딩비 조회
  const { data: fundingData, isLoading: fundingLoading } = useQuery(
    'funding-rates',
    () => api.get('/market/funding-rates').then(res => res.data),
    { 
      refetchInterval: 180000, // 3분마다 갱신 (Rate Limit 방지)
      staleTime: 120000, // 2분 후 stale
      retry: 2,
      retryDelay: 5000
    }
  );

  // 거래량 상위 코인 조회
  const { data: volumeData, isLoading: volumeLoading } = useQuery(
    'top-volume',
    () => api.get('/market/top-volume').then(res => res.data),
    { 
      refetchInterval: 240000, // 4분마다 갱신 (Rate Limit 방지)
      staleTime: 180000, // 3분 후 stale
      retry: 2,
      retryDelay: 7000
    }
  );

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

  // 디버깅을 위한 콘솔 로그
  console.log('MarketOverview - fearGreedData:', fearGreedData);
  console.log('MarketOverview - fearGreedLoading:', fearGreedLoading);
  console.log('MarketOverview - pricesData:', pricesData);
  console.log('MarketOverview - pricesLoading:', pricesLoading);
  
  if (pricesData?.data) {
    console.log('실제 가격 데이터:', pricesData.data);
    console.log('첫 번째 코인:', pricesData.data[0]);
  }

  if (pricesLoading || fearGreedLoading || fundingLoading || volumeLoading) {
    return (
      <SectionContainer>
        <SectionHeader>
          <h2 data-i18n="market.title">실시간 시장 개요</h2>
          <p data-i18n="market.description">최신 시장 데이터와 인사이트를 확인하세요</p>
        </SectionHeader>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <h2 data-i18n="market.title">실시간 시장 개요</h2>
        <p data-i18n="market.description">최신 시장 데이터와 인사이트를 확인하세요</p>
      </SectionHeader>

      {/* 실시간 가격 정보 */}
      {pricesError ? (
        <ErrorMessage>
          <i className="fas fa-exclamation-triangle"></i>
          <p>실시간 가격 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
        </ErrorMessage>
      ) : pricesData?.data ? (
        <MarketGrid>
          {pricesData.data.slice(0, 4).map((coin, index) => (
            <MarketCard
              key={coin.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardHeader>
                <h3>{coin.symbol.replace('USDT', '')}</h3>
                <div className="icon price">
                  <i className="fas fa-coins"></i>
                </div>
              </CardHeader>
              <CardContent>
                <div className="value">
                  ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`change ${coin.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
                  <i className={`fas fa-${coin.priceChangePercent >= 0 ? 'arrow-up' : 'arrow-down'}`}></i>
                  {coin.priceChangePercent >= 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
                </div>
                <div className="description">
                  24h Volume: {coin.volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </CardContent>
            </MarketCard>
          ))}
        </MarketGrid>
      ) : (
        <LoadingSpinner>
          <div className="spinner" />
          <p>실시간 가격 정보를 불러오는 중...</p>
        </LoadingSpinner>
      )}

      <MarketGrid>
        <MarketCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <h3 data-i18n="market.fearGreed.title">공포 & 탐욕 지수</h3>
            <div className="icon fear-greed">
              <i className="fas fa-brain"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="value">
              {fearGreedData?.data?.value || '--'}
            </div>
            <div className="description">
              {getFearGreedText(fearGreedData?.data?.value || 50)}
            </div>
            <div className={`change ${getFearGreedColor(fearGreedData?.data?.value || 50)}`}>
              <i className={`fas fa-${fearGreedData?.data?.value >= 50 ? 'arrow-up' : 'arrow-down'}`}></i>
              {fearGreedData?.data?.classification || 'N/A'}
            </div>
          </CardContent>
        </MarketCard>

        <MarketCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardHeader>
            <h3 data-i18n="market.funding.title">평균 펀딩비</h3>
            <div className="icon funding">
              <i className="fas fa-percentage"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="value">
              {fundingData?.data?.[0]?.fundingRate ? 
                `${(fundingData.data[0].fundingRate * 100).toFixed(4)}%` : '--'
              }
            </div>
            <div className="description" data-i18n="market.funding.description">
              최고 펀딩비율 기준
            </div>
            <div className="change neutral">
              <i className="fas fa-info-circle"></i>
              {fundingData?.data?.[0]?.symbol || 'N/A'}
            </div>
          </CardContent>
        </MarketCard>

        <MarketCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardHeader>
            <h3 data-i18n="market.volume.title">24시간 거래량</h3>
            <div className="icon volume">
              <i className="fas fa-chart-bar"></i>
            </div>
          </CardHeader>
          <CardContent>
            <div className="value">
              {volumeData?.data?.[0]?.volume ? 
                `${(volumeData.data[0].volume / 1000000).toFixed(1)}M` : '--'
              }
            </div>
            <div className="description" data-i18n="market.volume.description">
              최고 거래량 코인
            </div>
            <div className="change positive">
              <i className="fas fa-arrow-up"></i>
              {volumeData?.data?.[0]?.symbol || 'N/A'}
            </div>
          </CardContent>
        </MarketCard>
      </MarketGrid>

      <TopCoinsSection>
        <TopCoinsHeader>
          <h3 data-i18n="market.topCoins.title">거래량 상위 코인</h3>
        </TopCoinsHeader>
        <CoinList>
          {volumeData?.data?.slice(0, 6).map((coin, index) => (
            <CoinItem key={coin.symbol}>
              <div className="coin-info">
                <div>
                  <div className="symbol">{coin.symbol}</div>
                  <div className="name">#{index + 1}</div>
                </div>
              </div>
              <div className="price-info">
                <div className="price">
                  ${(coin.volume / 1000000).toFixed(1)}M
                </div>
                <div className={`change ${coin.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
                  {coin.priceChangePercent >= 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
                </div>
              </div>
            </CoinItem>
          ))}
        </CoinList>
      </TopCoinsSection>
    </SectionContainer>
  );
}

export default MarketOverview;
