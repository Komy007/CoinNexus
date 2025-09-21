import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { api } from '../../contexts/AuthContext';

const NewsContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
  }
  
  @media (max-width: 768px) {
    margin: 0 var(--spacing-md);
    padding: var(--spacing-xl) var(--spacing-md);
  }
`;

const NewsHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
    }
  }
  
  .update-time {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-weight: 400;
  }
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const NewsItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-sm);
    border-color: var(--accent-primary);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
`;

const ImpactIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
  flex-shrink: 0;
  
  &.positive {
    background: var(--accent-success);
    color: var(--bg-primary);
  }
  
  &.negative {
    background: var(--accent-danger);
    color: var(--bg-primary);
  }
  
  &.neutral {
    background: var(--accent-warning);
    color: var(--bg-primary);
  }
`;

const NewsContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NewsTitle = styled.h3`
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: var(--spacing-xs);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`;

const NewsTime = styled.div`
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
  
  .spinner {
    width: 32px;
    height: 32px;
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

function TodayNews() {
  const { data: newsData, isLoading, error } = useQuery(
    'today-news',
    async () => {
      console.log('📰 오늘의 뉴스 API 호출 시작');
      try {
        const response = await api.get('/news/today', { params: { limit: 3 } });
        console.log('📰 뉴스 API 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error('📰 뉴스 API 오류:', error);
        throw error;
      }
    },
    { 
      refetchInterval: 900000, // 15분마다 갱신
      staleTime: 300000, // 5분 후 stale
      cacheTime: 1800000 // 30분 캐시
    }
  );

  console.log('📰 TodayNews 상태:', { loading: isLoading, error: !!error, data: !!newsData });

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return '🟢';
      case 'negative': return '🔴';
      default: return '🟡';
    }
  };

  const getImpactClass = (impact) => {
    switch (impact) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      default: return 'neutral';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  const handleNewsClick = (news) => {
    // 뉴스 클릭 시 외부 링크로 이동 (실제 구현 시 news.url 사용)
    console.log('뉴스 클릭:', news.title);
    // window.open(news.url, '_blank'); // 실제 URL이 있을 때 사용
  };

  if (isLoading) {
    return (
      <NewsContainer>
        <NewsHeader>
          <h2>
            <i className="fas fa-newspaper"></i>
            오늘의 주요 뉴스
          </h2>
        </NewsHeader>
        <LoadingState>
          <div className="spinner" />
        </LoadingState>
      </NewsContainer>
    );
  }

  if (error || !newsData?.news?.length) {
    return (
      <NewsContainer>
        <NewsHeader>
          <h2>
            <i className="fas fa-newspaper"></i>
            오늘의 주요 뉴스
          </h2>
        </NewsHeader>
        <EmptyState>
          <i className="fas fa-exclamation-triangle"></i>
          <p>뉴스를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
        </EmptyState>
      </NewsContainer>
    );
  }

  const currentTime = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <NewsContainer>
      <NewsHeader>
        <h2>
          <i className="fas fa-newspaper"></i>
          오늘의 주요 뉴스
        </h2>
        <div className="update-time">
          마지막 업데이트: {currentTime}
        </div>
      </NewsHeader>

      <NewsList>
        {newsData.news.slice(0, 3).map((news, index) => (
          <NewsItem
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleNewsClick(news)}
          >
            <ImpactIcon className={getImpactClass(news.impact)}>
              {getImpactIcon(news.impact)}
            </ImpactIcon>
            
            <NewsContent>
              <NewsTitle>{news.title}</NewsTitle>
              <NewsTime>
                <i className="fas fa-clock"></i>
                {formatTime(news.publishedAt)}
                <span>•</span>
                <span>{news.source}</span>
              </NewsTime>
            </NewsContent>
          </NewsItem>
        ))}
      </NewsList>
    </NewsContainer>
  );
}

export default TodayNews;
