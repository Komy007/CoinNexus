import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const ProfileHeader = styled.div`
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

const ProfileCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  
  label {
    font-weight: 500;
    color: var(--text-primary);
    font-size: var(--font-size-base);
  }
`;

const Input = styled.input`
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
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
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

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--gradient-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-weight: 600;
  font-size: var(--font-size-3xl);
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    font-size: var(--font-size-2xl);
  }
`;

const UserDetails = styled.div`
  flex: 1;
  
  .username {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
    }
  }
  
  .email {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }
  
  .member-since {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }
`;

function Profile() {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    profile: {
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
      socialLinks: {
        twitter: user?.profile?.socialLinks?.twitter || '',
        telegram: user?.profile?.socialLinks?.telegram || '',
        discord: user?.profile?.socialLinks?.discord || ''
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          socialLinks: {
            ...prev.profile.socialLinks,
            [socialKey]: value
          }
        }
      }));
    } else if (name.startsWith('profile.')) {
      const profileKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('프로필이 업데이트되었습니다.');
      }
    } catch (error) {
      toast.error('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProfileContainer>
      <Helmet>
        <title data-i18n="profile.title">프로필 - CoinNexus</title>
        <meta name="description" content="사용자 프로필 관리" />
      </Helmet>

      <ProfileContent>
        <ProfileHeader>
          <h1 data-i18n="profile.header.title">프로필</h1>
          <p data-i18n="profile.header.description">
            개인 정보를 관리하고 업데이트하세요
          </p>
        </ProfileHeader>

        <ProfileCard>
          <UserInfo>
            <UserAvatar>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </UserAvatar>
            <UserDetails>
              <div className="username">{user?.username}</div>
              <div className="email">{user?.email}</div>
              <div className="member-since">
                가입일: {formatDate(user?.createdAt)}
              </div>
            </UserDetails>
          </UserInfo>

          <ProfileForm onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="username" data-i18n="profile.form.username">사용자명</label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="사용자명을 입력하세요"
                maxLength={20}
                required
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="profile.bio" data-i18n="profile.form.bio">자기소개</label>
              <TextArea
                id="profile.bio"
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                placeholder="자기소개를 입력하세요"
                maxLength={500}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="profile.location" data-i18n="profile.form.location">위치</label>
              <Input
                type="text"
                id="profile.location"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                placeholder="위치를 입력하세요"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="profile.website" data-i18n="profile.form.website">웹사이트</label>
              <Input
                type="url"
                id="profile.website"
                name="profile.website"
                value={formData.profile.website}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <label data-i18n="profile.form.socialLinks">소셜 링크</label>
              <Input
                type="text"
                name="socialLinks.twitter"
                value={formData.profile.socialLinks.twitter}
                onChange={handleChange}
                placeholder="Twitter 사용자명"
                disabled={isLoading}
              />
              <Input
                type="text"
                name="socialLinks.telegram"
                value={formData.profile.socialLinks.telegram}
                onChange={handleChange}
                placeholder="Telegram 사용자명"
                disabled={isLoading}
              />
              <Input
                type="text"
                name="socialLinks.discord"
                value={formData.profile.socialLinks.discord}
                onChange={handleChange}
                placeholder="Discord 사용자명"
                disabled={isLoading}
              />
            </FormGroup>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  업데이트 중...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  프로필 저장
                </>
              )}
            </Button>
          </ProfileForm>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
}

export default Profile;
