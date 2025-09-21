const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  donorName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
    validate: {
      min: 0.00000001
    }
  },
  currency: {
    type: DataTypes.ENUM('BTC', 'ETH', 'USDT'),
    allowNull: false
  },
  transactionHash: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  walletAddress: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usdValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'donations',
  indexes: [
    {
      fields: ['donorId']
    },
    {
      fields: ['currency']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Donation;
