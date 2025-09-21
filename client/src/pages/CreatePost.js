import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreatePostContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const CreatePostContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const CreatePostHeader = styled.div`
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
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const PostForm = styled.form`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
  
  label {
    display: block;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-base);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    outline: none;
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    outline: none;
  }
  
  option {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  min-height: 50px;
  
  .tag {
    background: var(--accent-primary);
    color: var(--bg-primary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius);
    font-size: var(--font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    
    .remove {
      cursor: pointer;
      font-weight: bold;
      
      &:hover {
        color: var(--accent-danger);
      }
    }
  }
  
  input {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: var(--font-size-base);
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: var(--text-muted);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: none;
  font-size: var(--font-size-base);
  
  &.primary {
    background: var(--gradient-primary);
    color: var(--bg-primary);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    
    &:hover {
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid var(--accent-danger);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  color: var(--accent-danger);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
`;

const categories = [
  { value: 'analysis', label: '분석' },
  { value: 'strategy', label: '전략' },
  { value: 'news', label: '뉴스' },
  { value: 'education', label: '교육' },
  { value: 'general', label: '일반' }
];

function CreatePost() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/posts', formData);
      toast.success('게시글이 작성되었습니다. 관리자 승인 후 공개됩니다.');
      navigate('/community');
    } catch (err) {
      const message = err.response?.data?.message || '게시글 작성 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/community');
  };

  return (
    <CreatePostContainer>
      <Helmet>
        <title data-i18n="createPost.title">글쓰기 - CoinNexus</title>
        <meta name="description" content="새로운 게시글을 작성하세요" />
      </Helmet>

      <CreatePostContent>
        <CreatePostHeader>
          <h1 data-i18n="createPost.header.title">새 게시글 작성</h1>
          <p data-i18n="createPost.header.description">
            지식과 경험을 공유해주세요
          </p>
        </CreatePostHeader>

        <PostForm onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <label htmlFor="title" data-i18n="createPost.form.title">제목</label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="게시글 제목을 입력하세요"
              maxLength={200}
              required
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="category" data-i18n="createPost.form.category">카테고리</label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <label htmlFor="content" data-i18n="createPost.form.content">내용</label>
            <TextArea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="게시글 내용을 입력하세요. 마크다운 문법을 지원합니다."
              required
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <label data-i18n="createPost.form.tags">태그 (최대 5개)</label>
            <TagInput>
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <span className="remove" onClick={() => removeTag(tag)}>×</span>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                onBlur={addTag}
                placeholder="태그를 입력하고 Enter를 누르세요"
                disabled={isLoading || formData.tags.length >= 5}
              />
            </TagInput>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={handleCancel} disabled={isLoading}>
              <i className="fas fa-times"></i>
              취소
            </Button>
            <Button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  작성 중...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  게시글 작성
                </>
              )}
            </Button>
          </ButtonGroup>
        </PostForm>
      </CreatePostContent>
    </CreatePostContainer>
  );
}

export default CreatePost;
