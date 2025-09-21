const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true
  },
  change24h: {
    type: Number,
    required: true
  },
  changePercent24h: {
    type: Number,
    required: true
  },
  volume24h: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number
  },
  high24h: {
    type: Number
  },
  low24h: {
    type: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 인덱스 설정
marketDataSchema.index({ symbol: 1, lastUpdated: -1 });

module.exports = mongoose.model('MarketData', marketDataSchema);
