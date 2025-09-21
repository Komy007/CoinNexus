const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['BTC', 'ETH', 'USDT'],
    required: true
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    maxlength: 500,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  confirmedAt: {
    type: Date
  },
  blockNumber: {
    type: Number
  },
  network: {
    type: String,
    enum: ['bitcoin', 'ethereum', 'tron'],
    required: true
  }
}, {
  timestamps: true
});

// 인덱스 설정
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ currency: 1, createdAt: -1 });
donationSchema.index({ status: 1 });

// 가상 필드
donationSchema.virtual('donorInfo').get(function() {
  if (this.isAnonymous) {
    return { username: '익명', isAnonymous: true };
  }
  return this.donor;
});

// JSON 변환 시 가상 필드 포함
donationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Donation', donationSchema);
