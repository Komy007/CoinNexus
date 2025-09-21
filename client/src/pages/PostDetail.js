import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

const PostDetailContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const PostDetailContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const PostCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
`;

const PostHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  
  .title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-md);
    line-height: 1.3;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-weight: 600;
  font-size: var(--font-size-lg);
`;

const AuthorDetails = styled.div`
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

const PostContent = styled.div`
  color: var(--text-primary);
  line-height: 1.8;
  font-size: var(--font-size-base);
  
  h1, h2, h3, h4, h5, h6 {
    color: var(--text-primary);
    margin: var(--spacing-lg) 0 var(--spacing-md) 0;
    font-weight: 600;
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  code {
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: var(--bg-tertiary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    overflow-x: auto;
    margin: var(--spacing-md) 0;
  }
  
  blockquote {
    border-left: 4px solid var(--accent-primary);
    padding-left: var(--spacing-md);
    margin: var(--spacing-md) 0;
    color: var(--text-secondary);
    font-style: italic;
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
  
  i {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }
`;

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: postData, isLoading, error } = useQuery(
    ['post', id],
    () => api.get(`/posts/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <PostDetailContainer>
        <PostDetailContent>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </PostDetailContent>
      </PostDetailContainer>
    );
  }

  if (error || !postData?.post) {
    return (
      <PostDetailContainer>
        <PostDetailContent>
          <ErrorMessage>
            <i className="fas fa-exclamation-triangle"></i>
            <h3>게시글을 찾을 수 없습니다</h3>
            <p>요청하신 게시글이 존재하지 않거나 삭제되었을 수 있습니다.</p>
          </ErrorMessage>
        </PostDetailContent>
      </PostDetailContainer>
    );
  }

  const { post } = postData;

  return (
    <PostDetailContainer>
      <Helmet>
        <title>{post.title} - CoinNexus</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>

      <PostDetailContent>
        <PostCard>
          <PostHeader>
            <h1 className="title">{post.title}</h1>
          </PostHeader>

          <PostMeta>
            <AuthorInfo>
              <AuthorAvatar>
                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
              </AuthorAvatar>
              <AuthorDetails>
                <div className="author-name">
                  {post.author?.username || '익명'}
                </div>
                <div className="post-date">
                  {formatDate(post.createdAt)}
                </div>
              </AuthorDetails>
            </AuthorInfo>

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
          </PostMeta>

          <PostContent>
            {post.content}
          </PostContent>
        </PostCard>
      </PostDetailContent>
    </PostDetailContainer>
  );
}

export default PostDetail;
