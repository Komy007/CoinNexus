const express = require('express');
const Donation = require('../models/Donation');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 기부 목록 조회
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, currency } = req.query;

    const query = { status: 'confirmed' };
    if (currency) {
      query.currency = currency;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'username profile.avatar')
      .sort({ confirmedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('기부 목록 조회 오류:', error);
    res.status(500).json({ 
      message: '기부 목록을 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 기부 통계
router.get('/stats', async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDonations = await Donation.countDocuments({ status: 'confirmed' });
    const totalAmount = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);

    res.json({
      totalDonations,
      totalAmount,
      byCurrency: stats
    });
  } catch (error) {
    console.error('기부 통계 조회 오류:', error);
    res.status(500).json({ 
      message: '기부 통계를 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 명예의 전당 (기부자 순위)
router.get('/hall-of-fame', async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: '$donor',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 },
          lastDonation: { $max: '$confirmedAt' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donorInfo'
        }
      },
      { $unwind: '$donorInfo' },
      {
        $project: {
          donor: {
            username: '$donorInfo.username',
            avatar: '$donorInfo.profile.avatar'
          },
          totalAmount: 1,
          donationCount: 1,
          lastDonation: 1
        }
      }
    ]);

    res.json({ topDonors });
  } catch (error) {
    console.error('명예의 전당 조회 오류:', error);
    res.status(500).json({ 
      message: '명예의 전당을 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 기부 등록 (관리자용)
router.post('/', auth, async (req, res) => {
  try {
    // 관리자만 기부 등록 가능
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: '기부 등록 권한이 없습니다.' 
      });
    }

    const { 
      donorId, 
      amount, 
      currency, 
      transactionHash, 
      message, 
      isAnonymous = false,
      network 
    } = req.body;

    if (!donorId || !amount || !currency || !transactionHash || !network) {
      return res.status(400).json({ 
        message: '필수 정보를 모두 입력해주세요.' 
      });
    }

    // 중복 트랜잭션 검사
    const existingDonation = await Donation.findOne({ transactionHash });
    if (existingDonation) {
      return res.status(400).json({ 
        message: '이미 등록된 트랜잭션입니다.' 
      });
    }

    const donation = new Donation({
      donor: donorId,
      amount,
      currency,
      transactionHash,
      message,
      isAnonymous,
      network,
      status: 'confirmed',
      confirmedAt: new Date()
    });

    await donation.save();

    // 사용자 총 기부액 업데이트
    await User.findByIdAndUpdate(donorId, {
      $inc: { totalDonations: amount }
    });

    res.status(201).json({
      message: '기부가 등록되었습니다.',
      donation
    });
  } catch (error) {
    console.error('기부 등록 오류:', error);
    res.status(500).json({ 
      message: '기부 등록 중 오류가 발생했습니다.' 
    });
  }
});

// 지갑 주소 조회
router.get('/wallet-addresses', (req, res) => {
  try {
    const addresses = {
      BTC: process.env.BTC_WALLET_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ETH: process.env.ETH_WALLET_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      USDT: process.env.USDT_WALLET_ADDRESS || 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE'
    };

    res.json({ addresses });
  } catch (error) {
    console.error('지갑 주소 조회 오류:', error);
    res.status(500).json({ 
      message: '지갑 주소를 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;
