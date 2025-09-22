#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 CoinNexus 자동 빌드 시작...');

// 1. 서버 의존성 설치
console.log('📦 서버 의존성 설치 중...');
try {
  process.chdir(path.join(__dirname, 'server'));
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ 서버 의존성 설치 완료');
} catch (error) {
  console.error('❌ 서버 의존성 설치 실패:', error.message);
  process.exit(1);
}

// 2. 클라이언트 의존성 설치
console.log('📦 클라이언트 의존성 설치 중...');
try {
  process.chdir(path.join(__dirname, 'client'));
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ 클라이언트 의존성 설치 완료');
} catch (error) {
  console.error('❌ 클라이언트 의존성 설치 실패:', error.message);
  process.exit(1);
}

// 3. React 앱 빌드
console.log('🏗️ React 앱 빌드 중...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React 앱 빌드 완료');
} catch (error) {
  console.error('❌ React 앱 빌드 실패:', error.message);
  process.exit(1);
}

// 4. 빌드 결과 확인
const buildPath = path.join(__dirname, 'client', 'build');
const indexPath = path.join(buildPath, 'index.html');

if (fs.existsSync(buildPath) && fs.existsSync(indexPath)) {
  console.log('🎉 빌드 완료! client/build/index.html 생성됨');
  console.log('📁 빌드 폴더:', buildPath);
  
  // 빌드된 파일 목록 표시
  const files = fs.readdirSync(buildPath);
  console.log('📄 빌드된 파일들:', files.join(', '));
} else {
  console.error('❌ 빌드 파일이 생성되지 않았습니다');
  process.exit(1);
}

console.log('🎯 모든 빌드 작업이 완료되었습니다!');
