import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_CONFIG } from '../config/api';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Socket.IO 연결
    const newSocket = io(SOCKET_CONFIG.url, SOCKET_CONFIG.options);

    // 연결 성공
    newSocket.on('connect', () => {
      console.log('Socket 연결됨:', newSocket.id);
      setConnected(true);
      
      // 인증된 사용자인 경우 사용자 정보 전송
      if (isAuthenticated && user) {
        newSocket.emit('authenticate', { userId: user._id });
      }
    });

    // 연결 해제
    newSocket.on('disconnect', () => {
      console.log('Socket 연결 해제됨');
      setConnected(false);
    });

    // 연결 오류
    newSocket.on('connect_error', (error) => {
      console.error('Socket 연결 오류:', error);
      setConnected(false);
    });

    // 실시간 시장 데이터 업데이트
    newSocket.on('market-update', (data) => {
      // 시장 데이터 업데이트 이벤트 처리
      console.log('시장 데이터 업데이트:', data);
    });

    // 기부 알림
    newSocket.on('donation-notification', (donation) => {
      const message = donation.isAnonymous 
        ? `익명 사용자가 ${donation.amount} ${donation.currency}를 기부했습니다!`
        : `${donation.donor.username}님이 ${donation.amount} ${donation.currency}를 기부했습니다!`;
      
      toast.success(message, {
        duration: 5000,
        icon: '💰'
      });
    });

    // 새 게시글 알림
    newSocket.on('new-post', (post) => {
      if (isAuthenticated) {
        toast.success(`새로운 게시글이 등록되었습니다: ${post.title}`, {
          duration: 4000,
          icon: '📝'
        });
      }
    });

    // 댓글 알림
    newSocket.on('new-comment', (comment) => {
      if (isAuthenticated && comment.postAuthor !== user?._id) {
        toast.success(`새로운 댓글이 달렸습니다`, {
          duration: 3000,
          icon: '💬'
        });
      }
    });

    setSocket(newSocket);

    // 클린업
    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, user]);

  // 방 참여
  const joinRoom = (room) => {
    if (socket && connected) {
      socket.emit('join-room', room);
    }
  };

  // 방 나가기
  const leaveRoom = (room) => {
    if (socket && connected) {
      socket.emit('leave-room', room);
    }
  };

  // 커스텀 이벤트 전송
  const emit = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  // 커스텀 이벤트 리스너 등록
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  // 이벤트 리스너 제거
  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const value = {
    socket,
    connected,
    joinRoom,
    leaveRoom,
    emit,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket은 SocketProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
