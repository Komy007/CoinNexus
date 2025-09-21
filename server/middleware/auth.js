const jwt = require('jsonwebtoken');
const { User } = require('../models/sqlite');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: '인증 토큰이 필요합니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId); // SQLite 스타일
    
    if (!user) {
      return res.status(401).json({ 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    req.userId = user.id; // SQLite 스타일
    req.user = user;
    next();
  } catch (error) {
    console.error('인증 오류:', error);
    res.status(401).json({ 
      message: '유효하지 않은 토큰입니다.' 
    });
  }
};

module.exports = auth;
