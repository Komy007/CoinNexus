const { sequelize } = require('../../config/database');
const User = require('./User');
const Admin = require('./Admin');
const Post = require('./Post');
const Donation = require('./Donation');
const UserWatchlist = require('../UserWatchlist');

// 모델 관계 설정
User.hasMany(Post, { 
  foreignKey: 'author', 
  as: 'posts',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, { 
  foreignKey: 'author', 
  as: 'user'
});

User.hasMany(Donation, { 
  foreignKey: 'donorId', 
  as: 'donations',
  onDelete: 'SET NULL'
});

Donation.belongsTo(User, { 
  foreignKey: 'donorId', 
  as: 'donor'
});

User.hasMany(UserWatchlist, { 
  foreignKey: 'userId', 
  as: 'watchlists',
  onDelete: 'CASCADE'
});

UserWatchlist.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user'
});

// 초기 데이터 생성
const createInitialData = async () => {
  try {
    // 관리자 계정 확인 및 생성
    const existingAdmin = await Admin.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        email: 'admin@coinnexus.com',
        password: '61756175@',
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
      });
      console.log('✅ 초기 관리자 계정 생성 완료');
    }

    // 데모 사용자 계정 확인 및 생성
    const existingUser = await User.findOne({ where: { email: 'demo@coinnexus.com' } });
    
    if (!existingUser) {
      await User.create({
        username: 'demo',
        email: 'demo@coinnexus.com',
        password: 'demo123',
        profile: {
          firstName: '데모',
          lastName: '사용자'
        }
      });
      console.log('✅ 데모 사용자 계정 생성 완료');
    }

    console.log('✅ 초기 데이터 설정 완료');
  } catch (error) {
    console.error('❌ 초기 데이터 생성 오류:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Admin,
  Post,
  Donation,
  UserWatchlist,
  createInitialData
};
