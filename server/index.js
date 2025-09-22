const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { testConnection, syncDatabase } = require('./config/database');
const { createInitialData } = require('./models/sqlite');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://coinnexus.onrender.com'] 
      : ['http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling']
});

// 미들웨어
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://coinnexus.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (개발 환경에서 완화)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 개발: 1000, 프로덕션: 100
  message: {
    success: false,
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
  }
});
app.use('/api/', limiter);

// 헬스체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CoinNexus API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// SQLite 데이터베이스 초기화
const initDatabase = async () => {
  console.log('🗄️ SQLite 데이터베이스 초기화 시작...');
  
  const connected = await testConnection();
  if (connected) {
    await syncDatabase(true); // force: true (테이블 재생성으로 스키마 업데이트)
    await createInitialData();
    console.log('✅ SQLite 데이터베이스 준비 완료');
  } else {
    console.log('❌ SQLite 데이터베이스 초기화 실패');
  }
};

// 데이터베이스 초기화 실행
initDatabase();

// SQLite만 사용 - MongoDB 제거됨
console.log('SQLite 데이터베이스를 메인 데이터베이스로 사용합니다.');

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/market', require('./routes/market'));
app.use('/api/news', require('./routes/news'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/watchlist', require('./routes/watchlist'));

// React 빌드 폴더 확인
const buildPath = path.join(__dirname, '../client/build');
const indexHtmlPath = path.join(buildPath, 'index.html');

if (!fs.existsSync(buildPath) || !fs.existsSync(indexHtmlPath)) {
  console.error('❌ React 앱이 빌드되지 않았습니다!');
  console.error('🔧 빌드를 실행합니다...');
  
  try {
    const { execSync } = require('child_process');
    execSync('node ../build.js', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ 빌드 완료!');
  } catch (error) {
    console.error('❌ 빌드 실패:', error.message);
    console.error('🔧 수동으로 다음 명령어를 실행하세요:');
    console.error('   node build.js');
    process.exit(1);
  }
}

// 정적 파일 서빙 (React 앱)
app.use(express.static(buildPath));

// Socket.IO 연결
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`사용자 ${socket.id}가 ${room}에 참여했습니다.`);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`사용자 ${socket.id}가 ${room}에서 나갔습니다.`);
  });
  
  socket.on('disconnect', () => {
    console.log('사용자 연결 해제됨:', socket.id);
  });
});

// 실시간 데이터 업데이트를 위한 Socket.IO 이벤트
setInterval(() => {
  // 시장 데이터 업데이트
  io.emit('market-update', {
    timestamp: new Date(),
    // 실제 시장 데이터는 별도 서비스에서 가져옴
  });
}, 5000); // 5초마다 업데이트

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// SPA를 위한 모든 라우트 처리 (API가 아닌 경우에만)
app.get('*', (req, res) => {
  // API 요청은 404 처리
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: '요청한 API를 찾을 수 없습니다.' });
  }
  // React 앱 제공
  res.sendFile(indexHtmlPath);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CoinNexus 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`🌐 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 정적 파일 경로: ${buildPath}`);
  console.log(`✅ 서버 준비 완료!`);
});

// 서버 종료 처리
process.on('SIGTERM', () => {
  console.log('🛑 서버 종료 신호 받음');
  server.close(() => {
    console.log('✅ 서버가 정상적으로 종료되었습니다');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 서버 인터럽트 신호 받음');
  server.close(() => {
    console.log('✅ 서버가 정상적으로 종료되었습니다');
    process.exit(0);
  });
});

module.exports = { app, io };
