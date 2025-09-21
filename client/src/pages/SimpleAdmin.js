import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

function SimpleAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 기존 관리자 토큰 확인
    const token = localStorage.getItem('adminToken');
    if (token) {
      console.log('기존 관리자 토큰 발견:', token.substring(0, 20) + '...');
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔐 관리자 로그인 시도');
    console.log('사용자명:', username);
    console.log('비밀번호 길이:', password.length);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      console.log('API 응답 상태:', response.status);
      const data = await response.json();
      console.log('API 응답 데이터:', data);

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        
        console.log('✅ 관리자 로그인 성공! 관리자 패널로 이동...');
        // 관리자 패널로 리다이렉트
        window.location.href = '/admin-panel';
      } else {
        setError(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setIsLoggedIn(false);
    console.log('🚪 관리자 로그아웃');
  };

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      background: '#1e1e1e',
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      color: '#00d4aa',
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#888',
      fontSize: '14px',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    input: {
      padding: '12px 16px',
      border: '1px solid #333',
      borderRadius: '8px',
      background: '#0a0a0a',
      color: '#fff',
      fontSize: '16px',
      outline: 'none'
    },
    button: {
      padding: '12px',
      background: 'linear-gradient(135deg, #00d4aa 0%, #00a085 100%)',
      color: '#0a0a0a',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    error: {
      background: 'rgba(255, 107, 107, 0.1)',
      border: '1px solid rgba(255, 107, 107, 0.3)',
      color: '#ff6b6b',
      padding: '12px',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center'
    },
    dashboard: {
      color: '#fff',
      padding: '20px'
    },
    logoutBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '8px 16px',
      background: '#ff4757',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  if (isLoggedIn) {
    return (
      <div style={styles.container}>
        <Helmet>
          <title>관리자 패널 - CoinNexus</title>
        </Helmet>
        
        <button style={styles.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
        
        <div style={styles.dashboard}>
          <h1 style={styles.title}>🎉 관리자 패널</h1>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#00d4aa', marginBottom: '20px' }}>관리자 기능</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '600px' }}>
              <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                <div>사용자 관리</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>150명 등록</div>
              </div>
              <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
                <div>게시글 관리</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>45개 게시글</div>
              </div>
              <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                <div>기부 관리</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>23건 기부</div>
              </div>
              <div style={{ padding: '20px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
                <div>시스템 설정</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>모든 권한</div>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', padding: '20px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
              <h3 style={{ color: '#00d4aa', marginBottom: '16px' }}>📊 시스템 상태</h3>
              <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.6' }}>
                <div>✅ 서버: 정상 작동</div>
                <div>✅ API: 모든 엔드포인트 작동</div>
                <div>✅ 실시간 데이터: 바이낸스 연동</div>
                <div>✅ Socket 통신: 정상</div>
                <div>⚠️ MongoDB: 연결 없음 (폴백 모드)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Helmet>
        <title>관리자 로그인 - CoinNexus</title>
      </Helmet>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 관리자 로그인</h1>
          <p style={styles.subtitle}>CoinNexus 관리자 패널에 접속하세요</p>
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: 'rgba(0, 212, 170, 0.1)', 
            border: '1px solid rgba(0, 212, 170, 0.3)', 
            borderRadius: '8px', 
            fontSize: '12px', 
            color: '#00d4aa' 
          }}>
            💡 관리자 계정 정보가 필요하시면 시스템 관리자에게 문의하세요
          </div>
        </div>

        <form style={styles.form} onSubmit={handleLogin}>
          {error && <div style={styles.error}>{error}</div>}
          
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자명 또는 이메일을 입력하세요"
            required
          />

          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />

          <button 
            style={styles.button} 
            type="submit" 
            disabled={loading}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? '로그인 중...' : '🔐 관리자 로그인'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: '#00d4aa', textDecoration: 'none', fontSize: '14px' }}>
            ← 메인 사이트로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

export default SimpleAdmin;
