const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

async function createInitialAdmin() {
  try {
    // MongoDB 연결
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== '') {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB 연결 성공');
    } else {
      console.log('MongoDB URI가 설정되지 않았습니다. 기본 관리자 계정만 생성합니다.');
    }

    // 기존 관리자 확인
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('관리자 계정이 이미 존재합니다.');
      console.log('사용자명:', existingAdmin.username);
      console.log('이메일:', existingAdmin.email);
      console.log('역할:', existingAdmin.role);
      return;
    }

    // 초기 관리자 계정 생성
    const admin = new Admin({
      username: 'admin',
      email: 'admin@coinnexus.com',
      password: '61756175@', // 초기 비밀번호
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
        lastName: '시스템',
        phone: '010-0000-0000'
      },
      settings: {
        notifications: {
          email: true,
          push: true
        },
        theme: 'dark'
      }
    });

    await admin.save();
    
    console.log('✅ 초기 관리자 계정이 생성되었습니다!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 관리자 로그인 정보:');
    console.log('   사용자명: admin');
    console.log('   이메일: admin@coinnexus.com');
    console.log('   비밀번호: 61756175@');
    console.log('   역할: super_admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  보안을 위해 로그인 후 비밀번호를 변경해주세요!');
    
  } catch (error) {
    console.error('❌ 관리자 계정 생성 오류:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB 연결 종료');
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  createInitialAdmin();
}

module.exports = createInitialAdmin;
