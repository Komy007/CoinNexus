import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  height: 80px;
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);
  }
`;

const Logo = styled(Link)`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
  position: relative;
  
  &:hover {
    color: var(--text-primary);
  }
  
  &.active {
    color: var(--accent-primary);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent-primary);
      border-radius: 1px;
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    gap: var(--spacing-sm);
  }
`;

const Button = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
  
  &.primary {
    background: var(--gradient-primary);
    color: var(--bg-primary);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }
  
  &.secondary {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--bg-secondary);
      border-color: var(--accent-primary);
    }
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-weight: 600;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: var(--font-size-sm);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  overflow: hidden;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all var(--transition-fast);
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  text-align: left;
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
  }
`;

// eslint-disable-next-line no-unused-vars
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-xl);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: ${props => props.$connected ? 'var(--accent-success)' : 'var(--accent-danger)'};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$connected ? 'var(--accent-success)' : 'var(--accent-danger)'};
  }
`;

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { connected } = useSocket();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/" data-i18n="app.title">CoinNexus</Logo>
        
        <NavLinks>
          <NavLink 
            to="/" 
            className={isActive('/') ? 'active' : ''}
            data-i18n="nav.home"
          >
            홈
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'active' : ''}
            data-i18n="nav.dashboard"
          >
            대시보드
          </NavLink>
          {isAuthenticated && (
            <NavLink 
              to="/watchlist" 
              className={isActive('/watchlist') ? 'active' : ''}
              data-i18n="nav.watchlist"
            >
              📈 관심목록
            </NavLink>
          )}
          <NavLink 
            to="/community" 
            className={isActive('/community') ? 'active' : ''}
            data-i18n="nav.community"
          >
            커뮤니티
          </NavLink>
          <NavLink 
            to="/donation" 
            className={isActive('/donation') ? 'active' : ''}
            data-i18n="nav.donation"
          >
            기부
          </NavLink>
        </NavLinks>
        
        <AuthButtons>
          <ConnectionStatus $connected={connected}>
            {connected ? '실시간' : '연결 끊김'}
          </ConnectionStatus>
          
          {isAuthenticated ? (
            <UserMenu>
              <UserAvatar onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </UserAvatar>
              <Dropdown $isOpen={dropdownOpen}>
                <DropdownItem to="/profile" data-i18n="nav.profile">
                  프로필
                </DropdownItem>
                <DropdownItem to="/create-post" data-i18n="nav.createPost">
                  글쓰기
                </DropdownItem>
                <DropdownButton onClick={handleLogout} data-i18n="nav.logout">
                  로그아웃
                </DropdownButton>
              </Dropdown>
            </UserMenu>
          ) : (
            <>
              <Button as={Link} to="/login" className="secondary" data-i18n="nav.login">
                로그인
              </Button>
              <Button as={Link} to="/register" className="primary" data-i18n="nav.register">
                회원가입
              </Button>
            </>
          )}
        </AuthButtons>
      </NavContent>
    </NavbarContainer>
  );
}

export default Navbar;
