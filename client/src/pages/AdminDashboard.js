import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Header = styled.header`
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  .admin-details {
    text-align: right;
    
    .name {
      color: var(--text-primary);
      font-weight: 600;
    }
    
    .role {
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
    }
  }
  
  .logout-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--accent-danger);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
    
    &:hover {
      background: #d32f2f;
    }
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
`;

const StatCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    color: var(--bg-primary);
    
    &.users { background: var(--accent-primary); }
    &.posts { background: var(--accent-secondary); }
    &.donations { background: var(--accent-success); }
    &.pending { background: var(--accent-warning); }
  }
  
  h3 {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }
`;

const StatValue = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const StatDescription = styled.div`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
`;

const Section = styled.section`
  margin-bottom: var(--spacing-2xl);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h2 {
    color: var(--text-primary);
    font-size: var(--font-size-2xl);
    font-weight: 700;
  }
  
  .view-all {
    color: var(--accent-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Table = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  
  &.status {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: var(--font-size-xs);
    font-weight: 500;
    text-align: center;
    
    &.active {
      background: rgba(102, 187, 106, 0.1);
      color: var(--accent-success);
    }
    
    &.inactive {
      background: rgba(239, 83, 80, 0.1);
      color: var(--accent-danger);
    }
    
    &.pending {
      background: rgba(255, 167, 38, 0.1);
      color: var(--accent-warning);
    }
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔥 관리자 대시보드 로드됨');
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminInfo');
    
    console.log('관리자 인증 체크:', { token: !!token, admin: !!admin });
    
    if (!token || !admin) {
      console.log('❌ 관리자 인증 실패, 로그인 페이지로 이동');
      console.log('토큰 존재:', !!token);
      console.log('관리자 정보 존재:', !!admin);
      toast.error('관리자 인증이 필요합니다.');
      
      // 1초 후 이동 (토스트 메시지를 볼 수 있도록)
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return;
    }
    
    try {
      const adminData = JSON.parse(admin);
      console.log('관리자 정보:', adminData);
      setAdminInfo(adminData);
    } catch (error) {
      console.error('관리자 정보 파싱 오류:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      navigate('/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // 폴백 데이터 (MongoDB 연결 없을 때 사용)
      const fallbackStats = {
        users: { total: 150, active: 120, pending: 30 },
        posts: { total: 45, pending: 8, approved: 37 },
        donations: { total: 23, monthly: 5 }
      };

      const fallbackRecent = {
        users: [
          { _id: '1', username: 'demo', email: 'demo@coinnexus.com', createdAt: new Date(), isActive: true },
          { _id: '2', username: 'test', email: 'test@coinnexus.com', createdAt: new Date(), isActive: true }
        ],
        posts: [
          { _id: '1', title: '비트코인 분석', author: { username: 'demo' }, createdAt: new Date(), status: 'approved' },
          { _id: '2', title: '이더리움 전망', author: { username: 'test' }, createdAt: new Date(), status: 'pending' }
        ],
        donations: [
          { _id: '1', amount: 0.001, currency: 'BTC', donor: { username: 'demo' }, createdAt: new Date() }
        ]
      };

      try {
        const response = await api.get('/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setStats(response.data.stats);
          setRecentData(response.data.recent);
        } else {
          throw new Error('API 응답 실패');
        }
      } catch (apiError) {
        console.log('API 호출 실패, 폴백 데이터 사용:', apiError.message);
        setStats(fallbackStats);
        setRecentData(fallbackRecent);
      }
    } catch (error) {
      console.error('대시보드 데이터 로드 오류:', error);
      
      // 최종 폴백 데이터
      setStats({
        users: { total: 0, active: 0, pending: 0 },
        posts: { total: 0, pending: 0, approved: 0 },
        donations: { total: 0, monthly: 0 }
      });
      setRecentData({
        users: [],
        posts: [],
        donations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    toast.success('로그아웃되었습니다.');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Helmet>
        <title>관리자 대시보드 - CoinNexus</title>
        <meta name="description" content="CoinNexus 관리자 대시보드" />
      </Helmet>

      <Header>
        <HeaderContent>
          <Logo>CoinNexus Admin</Logo>
          <AdminInfo>
            <div className="admin-details">
              <div className="name">{adminInfo?.username}</div>
              <div className="role">{adminInfo?.role}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> 로그아웃
            </button>
          </AdminInfo>
        </HeaderContent>
      </Header>

      <MainContent>
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatHeader>
              <h3>총 사용자</h3>
              <div className="icon users">
                <i className="fas fa-users"></i>
              </div>
            </StatHeader>
            <StatValue>{stats?.users?.total || 0}</StatValue>
            <StatDescription>활성 사용자: {stats?.users?.active || 0}</StatDescription>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatHeader>
              <h3>총 게시글</h3>
              <div className="icon posts">
                <i className="fas fa-file-alt"></i>
              </div>
            </StatHeader>
            <StatValue>{stats?.posts?.total || 0}</StatValue>
            <StatDescription>승인 대기: {stats?.posts?.pending || 0}</StatDescription>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatHeader>
              <h3>총 기부</h3>
              <div className="icon donations">
                <i className="fas fa-heart"></i>
              </div>
            </StatHeader>
            <StatValue>{stats?.donations?.total || 0}</StatValue>
            <StatDescription>이번 달: {stats?.donations?.monthly || 0}</StatDescription>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatHeader>
              <h3>승인 대기</h3>
              <div className="icon pending">
                <i className="fas fa-clock"></i>
              </div>
            </StatHeader>
            <StatValue>{stats?.posts?.pending || 0}</StatValue>
            <StatDescription>게시글 승인 대기</StatDescription>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionHeader>
            <h2>최근 사용자</h2>
            <a href="/admin/users" className="view-all">전체 보기</a>
          </SectionHeader>
          <Table>
            <TableHeader>
              <div>사용자명</div>
              <div>이메일</div>
              <div>가입일</div>
              <div>상태</div>
            </TableHeader>
            {recentData?.users?.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? '활성' : '비활성'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Section>

        <Section>
          <SectionHeader>
            <h2>최근 게시글</h2>
            <a href="/admin/posts" className="view-all">전체 보기</a>
          </SectionHeader>
          <Table>
            <TableHeader>
              <div>제목</div>
              <div>작성자</div>
              <div>작성일</div>
              <div>상태</div>
            </TableHeader>
            {recentData?.posts?.map((post, index) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author?.username}</TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`status ${post.status === 'approved' ? 'active' : post.status === 'pending' ? 'pending' : 'inactive'}`}>
                    {post.status === 'approved' ? '승인' : post.status === 'pending' ? '대기' : '거부'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Section>
      </MainContent>
    </DashboardContainer>
  );
}

export default AdminDashboard;
