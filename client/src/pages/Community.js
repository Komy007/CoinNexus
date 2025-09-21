import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

const CommunityContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const CommunityContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const CommunityHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h1 {
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

const CommunityActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const CategoryTab = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'var(--bg-primary)' : 'var(--text-primary)'};
  border: 1px solid ${props => props.active ? 'var(--accent-primary)' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-hover)'};
    border-color: var(--accent-primary);
  }
`;

const CreatePostButton = styled(Link)`
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-primary);
  color: var(--bg-primary);
  text-decoration: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const PostCard = styled(motion.div)`
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

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  .author-name {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .post-date {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
`;

const CategoryBadge = styled.span`
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
`;

const PostContent = styled.div`
  margin-bottom: var(--spacing-md);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    line-height: 1.4;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  
  .stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    
    i {
      color: var(--accent-primary);
    }
  }
`;

const ReadMoreButton = styled(Link)`
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
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

function Community() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { key: 'all', label: '전체' },
    { key: 'analysis', label: '분석' },
    { key: 'strategy', label: '전략' },
    { key: 'news', label: '뉴스' },
    { key: 'education', label: '교육' },
    { key: 'general', label: '일반' }
  ];

  // 게시글 목록 조회
  const { data: postsData, isLoading, error } = useQuery(
    ['posts', selectedCategory, currentPage],
    () => api.get('/posts', {
      params: {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: currentPage,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    }).then(res => res.data),
    { refetchInterval: 30000 } // 30초마다 갱신
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const getCategoryLabel = (category) => {
    const categoryObj = categories.find(cat => cat.key === category);
    return categoryObj ? categoryObj.label : category;
  };

  if (isLoading) {
    return (
      <CommunityContainer>
        <CommunityContent>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </CommunityContent>
      </CommunityContainer>
    );
  }

  if (error) {
    return (
      <CommunityContainer>
        <CommunityContent>
          <EmptyState>
            <i className="fas fa-exclamation-triangle"></i>
            <h3 data-i18n="community.error.title">오류가 발생했습니다</h3>
            <p data-i18n="community.error.description">
              게시글을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
          </EmptyState>
        </CommunityContent>
      </CommunityContainer>
    );
  }

  return (
    <CommunityContainer>
      <Helmet>
        <title data-i18n="community.title">커뮤니티 - CoinNexus</title>
        <meta name="description" content="암호화폐 거래자들의 지식과 경험을 공유하는 커뮤니티" />
      </Helmet>

      <CommunityContent>
        <CommunityHeader>
          <h1 data-i18n="community.header.title">커뮤니티</h1>
          <p data-i18n="community.header.description">
            암호화폐 거래자들의 지식과 경험을 공유하는 공간입니다
          </p>
        </CommunityHeader>

        <CommunityActions>
          <CategoryTabs>
            {categories.map(category => (
              <CategoryTab
                key={category.key}
                active={selectedCategory === category.key}
                onClick={() => setSelectedCategory(category.key)}
                data-i18n={`community.category.${category.key}`}
              >
                {category.label}
              </CategoryTab>
            ))}
          </CategoryTabs>

          {isAuthenticated && (
            <CreatePostButton to="/create-post" data-i18n="community.createPost">
              <i className="fas fa-plus"></i>
              글쓰기
            </CreatePostButton>
          )}
        </CommunityActions>

        <PostsGrid>
          {postsData?.posts?.length > 0 ? (
            postsData.posts.map((post, index) => (
              <PostCard
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PostHeader>
                  <PostMeta>
                    <AuthorAvatar>
                      {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </AuthorAvatar>
                    <AuthorInfo>
                      <div className="author-name">
                        {post.author?.username || '익명'}
                      </div>
                      <div className="post-date">
                        {formatDate(post.createdAt)}
                      </div>
                    </AuthorInfo>
                  </PostMeta>
                  <CategoryBadge>
                    {getCategoryLabel(post.category)}
                  </CategoryBadge>
                </PostHeader>

                <PostContent>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </PostContent>

                <PostFooter>
                  <PostStats>
                    <div className="stat">
                      <i className="fas fa-eye"></i>
                      <span>{post.views || 0}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-heart"></i>
                      <span>{post.likesCount || 0}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-comment"></i>
                      <span>{post.commentsCount || 0}</span>
                    </div>
                  </PostStats>
                  <ReadMoreButton to={`/post/${post.id}`} data-i18n="community.readMore">
                    자세히 보기
                    <i className="fas fa-arrow-right"></i>
                  </ReadMoreButton>
                </PostFooter>
              </PostCard>
            ))
          ) : (
            <EmptyState>
              <i className="fas fa-file-alt"></i>
              <h3 data-i18n="community.empty.title">게시글이 없습니다</h3>
              <p data-i18n="community.empty.description">
                아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!
              </p>
            </EmptyState>
          )}
        </PostsGrid>
      </CommunityContent>
    </CommunityContainer>
  );
}

export default Community;
