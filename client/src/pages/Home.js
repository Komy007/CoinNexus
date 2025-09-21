import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// 컴포넌트
import HeroSection from '../components/home/HeroSection';
import TodayNews from '../components/home/TodayNews';
import MarketOverview from '../components/home/MarketOverview';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import NewsSection from '../components/home/NewsSection';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Section = styled.section`
  padding: var(--spacing-2xl) 0;
  
  @media (max-width: 768px) {
    padding: var(--spacing-xl) 0;
  }
`;

function Home() {
  return (
    <HomeContainer>
      <Helmet>
        <title data-i18n="home.title">CoinNexus - 암호화폐 선물 거래 플랫폼</title>
        <meta name="description" content="실시간 암호화폐 데이터, 커뮤니티, 교육 콘텐츠를 제공하는 종합 플랫폼" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        
        {/* Today's News Section - Hero Section 바로 아래 */}
        <Section style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
          <TodayNews />
        </Section>
        
        <Section>
          <MarketOverview />
        </Section>
        
        <Section>
          <FeaturesSection />
        </Section>
        
        <Section>
          <StatsSection />
        </Section>
        
        <Section>
          <NewsSection />
        </Section>
      </motion.div>
    </HomeContainer>
  );
}

export default Home;
