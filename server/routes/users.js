const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 사용자 프로필 조회
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('사용자 프로필 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 정보를 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 프로필 수정
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, profile, preferences } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    // 사용자명 중복 검사
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ 
          message: '이미 사용 중인 사용자명입니다.' 
        });
      }
      user.username = username;
    }

    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      message: '프로필이 업데이트되었습니다.',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    res.status(500).json({ 
      message: '프로필 수정 중 오류가 발생했습니다.' 
    });
  }
});

// 사용자 통계
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('totalDonations reputation createdAt');

    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    // 추가 통계는 필요에 따라 구현
    const stats = {
      totalDonations: user.totalDonations,
      reputation: user.reputation,
      memberSince: user.createdAt,
      // 게시글 수, 댓글 수 등은 별도 쿼리로 구현 가능
    };

    res.json({ stats });
  } catch (error) {
    console.error('사용자 통계 조회 오류:', error);
    res.status(500).json({ 
      message: '사용자 통계를 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

module.exports = router;
