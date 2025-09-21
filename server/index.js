const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { testConnection, syncDatabase } = require('./config/database');
const { createInitialData } = require('./models/sqlite');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 미들웨어
app.use(helmet());
app.use(compression());
app.use(cors());
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

// MongoDB 연결 (선택사항 - 백업용)
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== '') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB 연결 성공 (백업용)'))
  .catch(err => console.log('MongoDB 연결 실패 (선택사항):', err.message));
} else {
  console.log('MongoDB는 사용하지 않습니다. SQLite를 메인 데이터베이스로 사용합니다.');
}

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/market', require('./routes/market'));
app.use('/api/news', require('./routes/news'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Socket.IO 연결
io.on('connection', (socket) => {
  console.log('사용자 연결됨:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`사용자 ${socket.id}가 ${room}에 참여했습니다.`);
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

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청한 리소스를 찾을 수 없습니다.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = { app, io };
