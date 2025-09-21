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

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const NewsItem = styled.div`
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  border-left: 3px solid ${props => {
    if (props.impact === 'positive') return 'var(--accent-success)';
    if (props.impact === 'negative') return 'var(--accent-danger)';
    return 'var(--accent-warning)';
  }};
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
    transform: translateX(4px);
  }
`;

const NewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
`;

const NewsSource = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: 500;
`;

const NewsTime = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
`;

const NewsTitle = styled.h4`
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ImpactBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  margin-top: var(--spacing-xs);
  
  &.positive {
    background: rgba(102, 187, 106, 0.1);
    color: var(--accent-success);
  }
  
  &.negative {
    background: rgba(239, 83, 80, 0.1);
    color: var(--accent-danger);
  }
  
  &.neutral {
    background: rgba(255, 167, 38, 0.1);
    color: var(--accent-warning);
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
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
    color: var(--accent-primary);
  }
`;

function EconomicNews() {
  const { data: newsData, isLoading, error } = useQuery(
    'economic-news',
    () => api.get('/news/economic', { params: { limit: 5 } }).then(res => res.data),
    { refetchInterval: 300000 }
  );

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  const getImpactText = (impact) => {
    switch (impact) {
      case 'positive': return '긍정적 영향';
      case 'negative': return '부정적 영향';
      default: return '중립적 영향';
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <h3 data-i18n="dashboard.economicNews.title">경제 뉴스</h3>
        </Header>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </Container>
    );
  }

  if (error || !newsData?.news?.length) {
    return (
      <Container>
        <Header>
          <h3 data-i18n="dashboard.economicNews.title">경제 뉴스</h3>
        </Header>
        <EmptyState>
          <i className="fas fa-newspaper"></i>
          <p data-i18n="dashboard.economicNews.error">경제 뉴스를 불러올 수 없습니다</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h3 data-i18n="dashboard.economicNews.title">경제 뉴스</h3>
      </Header>
      
      <NewsList>
        {newsData.news.map((news, index) => (
          <NewsItem key={index} impact={news.impact}>
            <NewsHeader>
              <NewsSource>
                <i className="fas fa-newspaper"></i>
                {news.source}
              </NewsSource>
              <NewsTime>{formatTime(news.publishedAt)}</NewsTime>
            </NewsHeader>
            
            <NewsTitle>{news.title}</NewsTitle>
            <NewsSummary>{news.summary}</NewsSummary>
            
            <ImpactBadge className={news.impact || 'neutral'}>
              <i className={`fas fa-${news.impact === 'positive' ? 'arrow-up' : news.impact === 'negative' ? 'arrow-down' : 'minus'}`}></i>
              {getImpactText(news.impact)}
            </ImpactBadge>
          </NewsItem>
        ))}
      </NewsList>
    </Container>
  );
}

export default EconomicNews;
