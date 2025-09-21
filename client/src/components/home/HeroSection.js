import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { api } from '../../contexts/AuthContext';

const HeroContainer = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    text-align: center;
    padding: 0 var(--spacing-sm);
  }
`;

const HeroText = styled.div`
  h1 {
    font-size: var(--font-size-4xl);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-lg);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-3xl);
    }
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
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
      box-shadow: var(--shadow-lg);
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
    justify-content: center;
    padding: var(--spacing-lg) var(--spacing-xl);
  }
`;

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    order: -1;
  }
`;

const ChartContainer = styled.div`
  width: 420px;
  height: 480px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 350px;
    height: 400px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
  }
`;

const ChartTitle = styled.h3`
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const Price = styled.div`
  .symbol {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }
  
  .value {
    color: var(--text-primary);
    font-size: var(--font-size-2xl);
    font-weight: 700;
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
`;

const MiniChart = styled.div`
  height: 60px;
  background: linear-gradient(45deg, 
    var(--accent-primary) 0%, 
    var(--accent-secondary) 50%, 
    var(--accent-primary) 100%);
  border-radius: var(--border-radius);
  position: relative;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

// 환율 제거로 인해 사용되지 않음
/*
// eslint-disable-next-line no-unused-vars
const ExchangeRate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-sm);
  
  .label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
  
  .value {
    color: var(--text-primary);
    font-weight: 600;
    font-size: var(--font-size-sm);
  }
`;
*/

const NewsSection = styled.div`
  margin-top: var(--spacing-lg);
  
  h4 {
    color: var(--text-primary);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const NewsItem = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1.4;
  padding: var(--spacing-xs) 0;
  border-left: 2px solid ${props => {
    if (props.impact === 'positive') return 'var(--accent-success)';
    if (props.impact === 'negative') return 'var(--accent-danger)';
    return 'var(--accent-warning)';
  }};
  padding-left: var(--spacing-xs);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const FloatingElement = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  
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
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

function HeroSection() {
  // 실시간 가격 정보 조회
  const { data: pricesData, isLoading } = useQuery(
    'hero-prices',
    () => api.get('/market/prices').then(res => res.data),
    { 
      refetchInterval: 10000, // 10초마다 갱신
      refetchOnWindowFocus: true,
      staleTime: 5000
    }
  );

  // 환율 정확도 우선으로 환율 표시 제거
  // const { data: exchangeData } = useQuery(...);

  // 경제 뉴스 조회
  const { data: newsData } = useQuery(
    'hero-news',
    () => api.get('/news/economic', { params: { limit: 4 } }).then(res => res.data),
    { 
      refetchInterval: 600000, // 10분마다 갱신
      staleTime: 300000
    }
  );

  // BTC와 ETH 데이터 추출 (환율 제거)
  const btcData = pricesData?.data?.find(coin => coin.symbol === 'BTCUSDT');
  const ethData = pricesData?.data?.find(coin => coin.symbol === 'ETHUSDT');
  // const usdKrw = exchangeData?.data?.USD_KRW; // 환율 정확도 문제로 제거

  return (
    <HeroContainer>
      <FloatingElements>
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
      </FloatingElements>
      
      <HeroContent>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroText>
            <h1 data-i18n="hero.title">
              암호화폐 선물 거래의<br />
              새로운 기준
            </h1>
            <p data-i18n="hero.description">
              실시간 데이터, 전문가 인사이트, 그리고 활발한 커뮤니티가 
              만나는 곳. CoinNexus와 함께 더 스마트한 거래를 시작하세요.
            </p>
            <ButtonGroup>
              <Button to="/dashboard" className="primary" data-i18n="hero.cta.primary">
                <i className="fas fa-chart-line"></i>
                대시보드 시작하기
              </Button>
              <Button to="/community" className="secondary" data-i18n="hero.cta.secondary">
                <i className="fas fa-users"></i>
                커뮤니티 둘러보기
              </Button>
            </ButtonGroup>
          </HeroText>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroVisual>
            <ChartContainer>
              <ChartTitle data-i18n="hero.chart.title">실시간 시장 현황</ChartTitle>
              <PriceDisplay>
                <Price>
                  <div className="symbol" data-i18n="hero.chart.btc">BTC/USDT</div>
                  <div className="value">
                    {isLoading ? '로딩 중...' : btcData ? `$${btcData.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$--'}
                  </div>
                      <div className={`change ${btcData?.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
                        {btcData ? `${btcData.priceChangePercent >= 0 ? '+' : ''}${btcData.priceChangePercent.toFixed(2)}%` : '--%'}
                      </div>
                </Price>
                <Price>
                  <div className="symbol" data-i18n="hero.chart.eth">ETH/USDT</div>
                  <div className="value">
                    {isLoading ? '로딩 중...' : ethData ? `$${ethData.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '$--'}
                  </div>
                      <div className={`change ${ethData?.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
                        {ethData ? `${ethData.priceChangePercent >= 0 ? '+' : ''}${ethData.priceChangePercent.toFixed(2)}%` : '--%'}
                      </div>
                </Price>
              </PriceDisplay>
              
              <MiniChart />
              
              {/* 환율 정보 제거 (정확도 문제) */}
              {/* 
              <ExchangeRate>
                <div className="label">🇺🇸 USD/KRW</div>
                <div className="value">환율 정확도 검증 중</div>
              </ExchangeRate>
              */}
              
              {/* 경제 뉴스 */}
              {newsData?.news && newsData.news.length > 0 && (
                <NewsSection>
                  <h4>
                    <i className="fas fa-newspaper"></i>
                    주요 경제 뉴스
                  </h4>
                  <NewsList>
                    {newsData.news.slice(0, 4).map((news, index) => (
                      <NewsItem key={index} impact={news.impact}>
                        • {news.title}
                      </NewsItem>
                    ))}
                  </NewsList>
                </NewsSection>
              )}
            </ChartContainer>
          </HeroVisual>
        </motion.div>
      </HeroContent>
    </HeroContainer>
  );
}

export default HeroSection;
