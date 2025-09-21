import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';

// 컴포넌트
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MarketMetrics from '../components/dashboard/MarketMetrics';
import FearGreedChart from '../components/dashboard/FearGreedChart';
import FundingRatesTable from '../components/dashboard/FundingRatesTable';
import OpenInterestChart from '../components/dashboard/OpenInterestChart';
import TopVolumeCoins from '../components/dashboard/TopVolumeCoins';
import EconomicNews from '../components/dashboard/EconomicNews';
import ExchangeRates from '../components/dashboard/ExchangeRates';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

function Dashboard() {
  return (
    <DashboardContainer>
      <Helmet>
        <title data-i18n="dashboard.title">대시보드 - CoinNexus</title>
        <meta name="description" content="실시간 암호화폐 시장 데이터와 분석 도구" />
      </Helmet>

      <DashboardContent>
        <DashboardHeader />
        
        <FullWidthSection>
          <MarketMetrics />
        </FullWidthSection>
        
        <DashboardGrid>
          <FearGreedChart />
          <ExchangeRates />
        </DashboardGrid>
        
        <FullWidthSection>
          <FundingRatesTable />
        </FullWidthSection>
        
        <TwoColumnGrid>
          <OpenInterestChart />
          <TopVolumeCoins />
        </TwoColumnGrid>
        
        <FullWidthSection>
          <EconomicNews />
        </FullWidthSection>
      </DashboardContent>
    </DashboardContainer>
  );
}

export default Dashboard;
