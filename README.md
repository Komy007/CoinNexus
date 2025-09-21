# CoinNexus 🚀

암호화폐 선물 거래에 특화된 정보 및 커뮤니티 플랫폼

## ✨ 주요 기능

### 📊 실시간 데이터
- **바이낸스 API 연동**: 실시간 암호화폐 가격 및 거래량 데이터
- **현물 & 선물 거래**: 바이낸스 현물과 선물 거래소 데이터 통합
- **실시간 업데이트**: WebSocket을 통한 실시간 데이터 스트리밍

### 📈 관심목록 (Watchlist)
- **개인화된 관심목록**: 사용자별 코인 관심목록 관리
- **사용자 등급별 제한**: 일반 사용자 5개, 프리미엄 사용자 20개 코인 등록 가능
- **실시간 가격 추적**: 관심 코인의 실시간 가격 변동 모니터링

### 👥 커뮤니티
- **게시글 시스템**: 분석, 전략, 뉴스, 교육, 일반 카테고리별 게시글
- **관리자 승인 시스템**: 게시글 작성 후 관리자 승인을 통한 품질 관리
- **실시간 상호작용**: 좋아요, 댓글, 조회수 기능

### 🔐 사용자 관리
- **JWT 인증**: 안전한 토큰 기반 인증 시스템
- **사용자 등급**: 일반/프리미엄 사용자 구분
- **관리자 시스템**: 독립적인 관리자 패널

### 📰 뉴스 시스템
- **경제 뉴스**: NewsAPI.org 연동을 통한 실시간 경제 뉴스
- **암호화폐 뉴스**: CoinGecko API를 통한 암호화폐 관련 뉴스
- **폴백 시스템**: API 장애 시 대체 뉴스 제공

## 🛠️ 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **Styled Components**: CSS-in-JS 스타일링
- **React Query**: 서버 상태 관리 및 캐싱
- **React Router**: 클라이언트 사이드 라우팅
- **Framer Motion**: 애니메이션 라이브러리
- **Socket.IO Client**: 실시간 통신

### Backend
- **Node.js**: 서버 런타임
- **Express.js**: 웹 프레임워크
- **SQLite**: 경량 데이터베이스 (Sequelize ORM)
- **Socket.IO**: 실시간 양방향 통신
- **JWT**: 인증 토큰 관리
- **Axios**: HTTP 클라이언트

### APIs
- **Binance API**: 암호화폐 가격 및 거래 데이터
- **NewsAPI.org**: 경제 뉴스 데이터
- **CoinGecko API**: 암호화폐 뉴스 및 정보

## 🚀 설치 및 실행

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/[사용자명]/CoinNexus.git
cd CoinNexus
\`\`\`

### 2. 의존성 설치
\`\`\`bash
# 서버 의존성 설치
cd server
npm install

# 클라이언트 의존성 설치
cd ../client
npm install
\`\`\`

### 3. 환경 변수 설정
\`\`\`bash
# server/.env 파일 생성
cd server
cp .env.example .env
\`\`\`

필요한 환경 변수:
- `JWT_SECRET`: JWT 토큰 암호화 키
- `NEWS_API_KEY`: NewsAPI.org API 키 (선택사항)
- `PORT`: 서버 포트 (기본값: 5000)

### 4. 데이터베이스 초기화
\`\`\`bash
cd server
npm run dev
# 서버 시작 시 자동으로 SQLite 데이터베이스가 초기화됩니다
\`\`\`

### 5. 애플리케이션 실행
\`\`\`bash
# 터미널 1: 서버 실행
cd server
npm run dev

# 터미널 2: 클라이언트 실행
cd client
npm start
\`\`\`

## 📱 접속 정보

- **메인 사이트**: http://localhost:3000
- **관리자 패널**: http://localhost:3000/simple-admin
- **API 서버**: http://localhost:5000

### 기본 계정 정보
- **관리자 계정**: admin / admin123
- **데모 사용자**: user@example.com / password123

## 🏗️ 프로젝트 구조

\`\`\`
CoinNexus/
├── client/                 # React 클라이언트
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── contexts/       # React Context (인증, 소켓, 언어)
│   │   ├── hooks/          # 커스텀 훅
│   │   └── utils/          # 유틸리티 함수
│   └── public/             # 정적 파일
├── server/                 # Node.js 서버
│   ├── routes/             # API 라우트
│   ├── models/             # 데이터베이스 모델
│   ├── middleware/         # 미들웨어
│   ├── config/             # 설정 파일
│   └── utils/              # 서버 유틸리티
└── README.md
\`\`\`

## 🔧 주요 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `GET /api/auth/verify` - 토큰 검증

### 암호화폐 데이터
- `GET /api/market/prices` - 실시간 가격 데이터
- `GET /api/watchlist/search` - 코인 검색
- `GET /api/watchlist/prices` - 관심목록 가격 조회

### 커뮤니티
- `GET /api/posts` - 게시글 목록
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:id` - 게시글 상세
- `PUT /api/posts/:id/approve` - 게시글 승인 (관리자)

### 관리자
- `POST /api/admin/login` - 관리자 로그인
- `GET /api/admin/dashboard/stats` - 대시보드 통계
- `GET /api/admin/users` - 사용자 목록

## 🌟 주요 특징

### 실시간 데이터 처리
- 바이낸스 API와의 안정적인 연동
- 오류 처리 및 폴백 메커니즘
- 효율적인 데이터 캐싱

### 확장 가능한 아키텍처
- 모듈화된 컴포넌트 구조
- 재사용 가능한 API 설계
- 유연한 데이터베이스 스키마

### 사용자 경험 최적화
- 반응형 디자인 (모바일 우선)
- 직관적인 사용자 인터페이스
- 실시간 업데이트 알림

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 \`LICENSE\` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 GitHub Issues를 통해 연락해주세요.

---

**CoinNexus** - 암호화폐 거래의 새로운 기준 🚀