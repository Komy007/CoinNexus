const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/sqlite/User');
const auth = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // 입력 검증
    if (!email || !password || !username) {
      return res.status(400).json({ 
        message: '이메일, 비밀번호, 사용자명을 모두 입력해주세요.' 
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: '올바른 이메일 형식을 입력해주세요.' 
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return res.status(400).json({ 
        message: '비밀번호는 최소 6자 이상이어야 합니다.' 
      });
    }

    // 중복 검사 (SQLite)
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: '이미 사용 중인 이메일 또는 사용자명입니다.' 
      });
    }

    // 사용자 생성 (SQLite)
    const user = await User.create({
      email,
      password,
      username
    });

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력 검증
    if (!email || !password) {
      return res.status(400).json({ 
        message: '이메일과 비밀번호를 입력해주세요.' 
      });
    }

    // 사용자 찾기 (SQLite)
    const user = await User.findOne({ 
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 비밀번호 검증
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 마지막 로그인 시간 업데이트 (SQLite)
    await user.update({ lastLogin: new Date() });

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: '로그인 성공',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 현재 사용자 정보 조회
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 토큰 검증
router.get('/verify', auth, (req, res) => {
  res.json({ 
    message: '유효한 토큰입니다.',
    userId: req.userId 
  });
});

module.exports = router;
