import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';

// 컨텍스트
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { LanguageProvider } from './contexts/LanguageContext';

// 컴포넌트
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 페이지
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Donation from './pages/Donation';
import HallOfFame from './pages/HallOfFame';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Admin from './pages/Admin';
import AdminPanel from './pages/AdminPanel';
import SimpleAdmin from './pages/SimpleAdmin';
import Watchlist from './pages/Watchlist';

// 스타일
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Navbar 높이만큼 여백 */
  
  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

function App() {
  return (
        <LanguageProvider>
          <AuthProvider>
            <SocketProvider>
              <Helmet>
                <title data-i18n="app.title">CoinNexus - 암호화폐 선물 거래 플랫폼</title>
                <meta name="description" content="암호화폐 선물 거래에 특화된 정보 및 커뮤니티 플랫폼" />
              </Helmet>
              
              <AppContainer>
                <Navbar />
                <MainContent>
                  <Routes>
                    {/* 최신 간단한 관리자 라우트 */}
                    <Route path="/simple-admin" element={<SimpleAdmin />} />
                    
                    {/* 새로운 관리자 라우트 (완전 독립) */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin-dashboard" element={<AdminPanel />} />
                    <Route path="/admin-panel" element={<AdminPanel />} />
                    
                    {/* 기존 관리자 라우트 (독립 레이아웃) */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    
                    {/* 공개 라우트 */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/donation" element={<Donation />} />
                    <Route path="/hall-of-fame" element={<HallOfFame />} />
                    
                    {/* 보호된 라우트 */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/watchlist" element={
                      <ProtectedRoute>
                        <Watchlist />
                      </ProtectedRoute>
                    } />
                    <Route path="/create-post" element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 페이지 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainContent>
                <Footer />
              </AppContainer>
            </SocketProvider>
          </AuthProvider>
        </LanguageProvider>
  );
}

export default App;
