const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '../database.sqlite');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ SQLite 데이터베이스 연결 실패:', error);
    return false;
  }
};

// 데이터베이스 동기화
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ 데이터베이스 테이블 동기화 완료');
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 동기화 실패:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
