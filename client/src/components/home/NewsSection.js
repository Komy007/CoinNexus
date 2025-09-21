import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { api } from '../../contexts/AuthContext';

const NewsContainer = styled.section`
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

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
`;

const NewsCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const NewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
`;

const NewsSource = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .source-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xs);
    color: var(--bg-primary);
  }
  
  .source-name {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const NewsTime = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`;

const NewsTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: var(--font-size-sm);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NewsImpact = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-xs);
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
  
  i {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
    color: var(--accent-primary);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }
`;

function NewsSection() {
  const { data: newsData, isLoading, error } = useQuery(
    'crypto-news',
    () => api.get('/news/crypto', { params: { limit: 6 } }).then(res => res.data),
    { refetchInterval: 300000 } // 5분마다 갱신
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return 'fas fa-arrow-up';
      case 'negative': return 'fas fa-arrow-down';
      default: return 'fas fa-minus';
    }
  };

  if (isLoading) {
    return (
      <NewsContainer>
        <SectionHeader>
          <h2 data-i18n="news.title">최신 뉴스</h2>
          <p data-i18n="news.description">
            암호화폐 시장의 최신 소식을 확인하세요
          </p>
        </SectionHeader>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </NewsContainer>
    );
  }

  if (error || !newsData?.news?.length) {
    return (
      <NewsContainer>
        <SectionHeader>
          <h2 data-i18n="news.title">최신 뉴스</h2>
          <p data-i18n="news.description">
            암호화폐 시장의 최신 소식을 확인하세요
          </p>
        </SectionHeader>
        <EmptyState>
          <i className="fas fa-newspaper"></i>
          <h3 data-i18n="news.empty.title">뉴스를 불러올 수 없습니다</h3>
          <p data-i18n="news.empty.description">
            잠시 후 다시 시도해주세요.
          </p>
        </EmptyState>
      </NewsContainer>
    );
  }

  return (
    <NewsContainer>
      <SectionHeader>
        <h2 data-i18n="news.title">최신 뉴스</h2>
        <p data-i18n="news.description">
          암호화폐 시장의 최신 소식을 확인하세요
        </p>
      </SectionHeader>

      <NewsGrid>
        {newsData.news.map((news, index) => (
          <NewsCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <NewsHeader>
              <NewsSource>
                <div className="source-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <div className="source-name">{news.source}</div>
              </NewsSource>
              <NewsTime>{formatTime(news.publishedAt)}</NewsTime>
            </NewsHeader>

            <NewsTitle>{news.title}</NewsTitle>
            <NewsSummary>{news.summary}</NewsSummary>

            <NewsImpact className={news.impact || 'neutral'}>
              <i className={getImpactIcon(news.impact)}></i>
              <span>
                {news.impact === 'positive' ? '긍정적 영향' :
                 news.impact === 'negative' ? '부정적 영향' : '중립적 영향'}
              </span>
            </NewsImpact>
          </NewsCard>
        ))}
      </NewsGrid>
    </NewsContainer>
  );
}

export default NewsSection;
