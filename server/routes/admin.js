const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/sqlite/Admin');
const User = require('../models/sqlite/User');
const Post = require('../models/sqlite/Post');
const Donation = require('../models/sqlite/Donation');
const auth = require('../middleware/auth');

const router = express.Router();

// 관리자 인증 미들웨어
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 기본 관리자 계정 확인
    if (decoded.id === 'default-admin') {
      req.admin = {
        id: 'default-admin',
        username: 'admin',
        email: 'admin@coinnexus.com',
        role: 'super_admin',
        isActive: true,
        permissions: {
          userManagement: true,
          postManagement: true,
          donationManagement: true,
          systemSettings: true,
          analytics: true
        }
      };
      return next();
    }
    
    // SQLite에서 관리자 확인
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: '유효하지 않은 관리자입니다.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('관리자 인증 오류:', error);
    res.status(401).json({ success: false, message: '인증에 실패했습니다.' });
  }
};

// 관리자 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '사용자명과 비밀번호를 입력해주세요.' 
      });
    }

    console.log('🔐 관리자 로그인 시도:', username);

    // 기본 관리자 계정 확인
    const defaultAdmin = {
      username: 'admin',
      email: 'admin@coinnexus.com',
      password: '61756175@'
    };

    const isDefaultAdmin = (username === defaultAdmin.username || username === defaultAdmin.email) && 
                          password === defaultAdmin.password;

    if (isDefaultAdmin) {
      const token = jwt.sign(
        { id: 'default-admin', role: 'super_admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('✅ 기본 관리자 로그인 성공');
      return res.json({
        success: true,
        token,
        admin: {
          id: 'default-admin',
          username: 'admin',
          email: 'admin@coinnexus.com',
          role: 'super_admin',
          permissions: {
            userManagement: true,
            postManagement: true,
            donationManagement: true,
            systemSettings: true,
            analytics: true
          },
          profile: {
            firstName: '관리자',
            lastName: '시스템'
          }
        }
      });
    }

    // SQLite에서 관리자 확인
    const admin = await Admin.findOne({ 
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email: username }
        ],
        isActive: true
      }
    });

    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: '잘못된 사용자명 또는 비밀번호입니다.' 
      });
    }

    // SQLite 모델에는 계정 잠금 기능이 없으므로 제거

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: '잘못된 사용자명 또는 비밀번호입니다.' 
      });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role }, // SQLite는 admin.id 사용
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ SQLite 관리자 로그인 성공');
    res.json({
      success: true,
      token,
      admin: {
        id: admin.id, // SQLite는 admin.id 사용
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        profile: admin.profile
      }
    });
  } catch (error) {
    console.error('관리자 로그인 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 관리자 정보 조회
router.get('/profile', adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    console.error('관리자 프로필 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 대시보드 통계
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    console.log('📊 관리자 대시보드 통계 조회 시작');
    
    // SQLite 통계 조회
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalPosts = await Post.count();
    const pendingPosts = await Post.count({ where: { status: 'pending' } });
    const totalDonations = await Donation.sum('amount') || 0;

    // 최근 활동 (SQLite)
    const recentUsers = await User.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'username', 'email', 'createdAt']
    });

    const recentPosts = await Post.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'status', 'createdAt'],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });

    const recentDonations = await Donation.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'amount', 'currency', 'createdAt']
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: totalUsers - activeUsers
      },
      posts: {
        total: totalPosts,
        pending: pendingPosts,
        approved: totalPosts - pendingPosts
      },
      donations: {
        total: totalDonations,
        monthly: 0 // 월별 계산은 추후 구현
      }
    };

    console.log('📊 통계 조회 완료:', stats);

    res.json({
      success: true,
      stats,
      recent: {
        users: recentUsers.map(u => u.toJSON()),
        posts: recentPosts.map(p => p.toJSON()),
        donations: recentDonations.map(d => d.toJSON())
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('대시보드 통계 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 사용자 관리
router.get('/users', adminAuth, async (req, res) => {
  try {
    console.log('👥 사용자 목록 조회 시작');
    
    const users = await User.findAll({ 
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`👥 사용자 ${users.length}명 조회됨`);
    
    res.json({ 
      success: true, 
      users: users.map(u => u.toJSON())
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 사용자 프리미엄 상태 변경
router.put('/users/:id/premium', adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { isPremium } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    user.isPremium = isPremium !== undefined ? isPremium : !user.isPremium;
    await user.save();

    res.json({
      success: true,
      message: `사용자가 ${user.isPremium ? '프리미엄' : '일반'} 회원으로 변경되었습니다.`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('프리미엄 상태 변경 오류:', error);
    res.status(500).json({
      success: false,
      message: '프리미엄 상태 변경 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;