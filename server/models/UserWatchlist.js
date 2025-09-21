const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserWatchlist = sequelize.define('UserWatchlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '코인 심볼 (예: BTCUSDT)'
  },
  coinName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '코인 이름 (예: Bitcoin)'
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '관심목록 추가 시간'
  },
  targetPrice: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: true,
    comment: '목표 가격 (선택사항)'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '사용자 메모'
  }
}, {
  tableName: 'user_watchlists',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'symbol']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['symbol']
    }
  ]
});

module.exports = UserWatchlist;
