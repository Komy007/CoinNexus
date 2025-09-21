import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #e0e0e0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const AdminHeader = styled.div`
  background: #1e1e1e;
  border-bottom: 2px solid #00d4aa;
  padding: 20px 0;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #00d4aa;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button`
  background: ${props => props.active ? '#00d4aa' : 'transparent'};
  color: ${props => props.active ? '#0a0a0a' : '#e0e0e0'};
  border: none;
  padding: 12px 24px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#00d4aa' : '#333'};
  }
`;

const TabContent = styled(motion.div)`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #2a2a2a;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #333;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00d4aa;
    transform: translateY(-2px);
  }

  .stat-number {
    font-size: 36px;
    font-weight: 700;
    color: #00d4aa;
    margin-bottom: 10px;
  }

  .stat-label {
    font-size: 16px;
    color: #ccc;
    font-weight: 500;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #333;
  }

  th {
    background: #333;
    color: #00d4aa;
    font-weight: 600;
  }

  tr:hover {
    background: #333;
  }
`;

const ActionButton = styled.button`
  background: ${props => {
    if (props.variant === 'approve') return '#28a745';
    if (props.variant === 'reject') return '#dc3545';
    if (props.variant === 'delete') return '#6c757d';
    return '#007bff';
  }};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
    border: 3px solid #333;
    border-top: 3px solid #00d4aa;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminInfo, setAdminInfo] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // 로컬 스토리지에서 관리자 정보 가져오기
    const token = localStorage.getItem('adminToken');
    const info = localStorage.getItem('adminInfo');
    if (token && info) {
      try {
        setAdminInfo(JSON.parse(info));
      } catch (e) {
        handleLogout();
      }
    } else {
      // 관리자 인증이 없으면 로그인 페이지로
      window.location.href = '/simple-admin';
    }
  }, []);

  // 대시보드 통계 조회
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'admin-stats',
    async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('통계 조회 실패');
      return response.json();
    },
    { enabled: !!adminInfo }
  );

  // 사용자 목록 조회
  const { data: usersData, isLoading: usersLoading } = useQuery(
    'admin-users',
    async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('사용자 목록 조회 실패');
      return response.json();
    },
    { enabled: activeTab === 'users' && !!adminInfo }
  );

  // 게시글 목록 조회 (승인 대기 중)
  const { data: postsData, isLoading: postsLoading } = useQuery(
    'admin-posts',
    async () => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/posts?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('게시글 목록 조회 실패');
      return response.json();
    },
    { enabled: activeTab === 'posts' && !!adminInfo }
  );

  // 게시글 승인/거부 뮤테이션
  const postActionMutation = useMutation(
    async ({ postId, action }) => {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`게시글 ${action} 실패`);
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-posts');
        queryClient.invalidateQueries('admin-stats');
      }
    }
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    window.location.href = '/simple-admin';
  };

  const handlePostAction = (postId, action) => {
    if (window.confirm(`정말로 이 게시글을 ${action === 'approve' ? '승인' : '거부'}하시겠습니까?`)) {
      postActionMutation.mutate({ postId, action });
    }
  };

  if (!adminInfo) {
    return <LoadingSpinner><div className="spinner" /></LoadingSpinner>;
  }

  const renderDashboard = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ color: '#00d4aa', marginBottom: '20px' }}>📊 시스템 개요</h2>
      
      {statsLoading ? (
        <LoadingSpinner><div className="spinner" /></LoadingSpinner>
      ) : (
        <StatsGrid>
          <StatCard>
            <div className="stat-number">{statsData?.stats?.users?.total || 0}</div>
            <div className="stat-label">총 사용자</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{statsData?.stats?.users?.active || 0}</div>
            <div className="stat-label">활성 사용자</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{statsData?.stats?.posts?.total || 0}</div>
            <div className="stat-label">총 게시글</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{statsData?.stats?.posts?.pending || 0}</div>
            <div className="stat-label">승인 대기</div>
          </StatCard>
        </StatsGrid>
      )}

      <h3 style={{ color: '#ccc', marginBottom: '15px' }}>🔥 최근 활동</h3>
      <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0', color: '#ccc' }}>
          • 새로운 사용자 {statsData?.recent?.users?.length || 0}명 가입
        </p>
        <p style={{ margin: '0 0 10px 0', color: '#ccc' }}>
          • 승인 대기 게시글 {statsData?.stats?.posts?.pending || 0}개
        </p>
        <p style={{ margin: '0', color: '#ccc' }}>
          • 총 기부금액 ${statsData?.stats?.donations?.total || 0}
        </p>
      </div>
    </TabContent>
  );

  const renderUsers = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ color: '#00d4aa', marginBottom: '20px' }}>👥 사용자 관리</h2>
      
      {usersLoading ? (
        <LoadingSpinner><div className="spinner" /></LoadingSpinner>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>사용자명</th>
              <th>이메일</th>
              <th>가입일</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {usersData?.users?.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                <td>
                  <span style={{ 
                    color: user.isActive ? '#28a745' : '#dc3545',
                    fontWeight: '600'
                  }}>
                    {user.isActive ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <ActionButton variant="edit">수정</ActionButton>
                  <ActionButton variant="delete">삭제</ActionButton>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                  사용자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </TabContent>
  );

  const renderPosts = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ color: '#00d4aa', marginBottom: '20px' }}>📝 게시글 승인</h2>
      
      {postsLoading ? (
        <LoadingSpinner><div className="spinner" /></LoadingSpinner>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>제목</th>
              <th>작성자</th>
              <th>카테고리</th>
              <th>작성일</th>
              <th>상태</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {postsData?.posts?.map(post => (
              <tr key={post.id}>
                <td>#{post.id}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.title}
                </td>
                <td>{post.author?.username || 'Unknown'}</td>
                <td>{post.category}</td>
                <td>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
                <td>
                  <span style={{ 
                    color: '#ffc107',
                    fontWeight: '600'
                  }}>
                    승인 대기
                  </span>
                </td>
                <td>
                  <ActionButton 
                    variant="approve"
                    onClick={() => handlePostAction(post.id, 'approve')}
                    disabled={postActionMutation.isLoading}
                  >
                    승인
                  </ActionButton>
                  <ActionButton 
                    variant="reject"
                    onClick={() => handlePostAction(post.id, 'reject')}
                    disabled={postActionMutation.isLoading}
                  >
                    거부
                  </ActionButton>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: '#888' }}>
                  승인 대기 중인 게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </TabContent>
  );

  const renderSettings = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 style={{ color: '#00d4aa', marginBottom: '20px' }}>⚙️ 시스템 설정</h2>
      
      <div style={{ background: '#2a2a2a', padding: '25px', borderRadius: '12px' }}>
        <h3 style={{ color: '#ccc', marginBottom: '15px' }}>관리자 정보</h3>
        <p style={{ margin: '0 0 10px 0', color: '#e0e0e0' }}>
          <strong>사용자명:</strong> {adminInfo?.username}
        </p>
        <p style={{ margin: '0 0 10px 0', color: '#e0e0e0' }}>
          <strong>이메일:</strong> {adminInfo?.email}
        </p>
        <p style={{ margin: '0 0 20px 0', color: '#e0e0e0' }}>
          <strong>역할:</strong> {adminInfo?.role}
        </p>
        
        <h3 style={{ color: '#ccc', marginBottom: '15px' }}>권한</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {Object.entries(adminInfo?.permissions || {}).map(([key, value]) => (
            <div key={key} style={{ 
              background: value ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
              padding: '10px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#e0e0e0' }}>{key}</span>
              <span style={{ 
                color: value ? '#28a745' : '#dc3545',
                fontWeight: '600'
              }}>
                {value ? '✅' : '❌'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TabContent>
  );

  return (
    <AdminContainer>
      <Helmet>
        <title>관리자 패널 - CoinNexus</title>
      </Helmet>
      
      <AdminHeader>
        <HeaderContent>
          <Title>🔐 CoinNexus 관리자 패널</Title>
          <LogoutButton onClick={handleLogout}>
            로그아웃
          </LogoutButton>
        </HeaderContent>
      </AdminHeader>

      <AdminContent>
        <TabContainer>
          <Tab 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          >
            📊 대시보드
          </Tab>
          <Tab 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            👥 사용자 관리
          </Tab>
          <Tab 
            active={activeTab === 'posts'} 
            onClick={() => setActiveTab('posts')}
          >
            📝 게시글 승인
          </Tab>
          <Tab 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ 설정
          </Tab>
        </TabContainer>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'settings' && renderSettings()}
      </AdminContent>
    </AdminContainer>
  );
}

export default AdminPanel;