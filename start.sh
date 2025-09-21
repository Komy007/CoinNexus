#!/bin/bash

echo "CoinNexus 프로젝트를 시작합니다..."
echo

echo "1. 의존성 설치 중..."
npm run install-all
if [ $? -ne 0 ]; then
    echo "의존성 설치에 실패했습니다."
    exit 1
fi

echo
echo "2. MongoDB가 실행 중인지 확인하세요."
echo "   - macOS: brew services start mongodb-community"
echo "   - Ubuntu/Debian: sudo systemctl start mongod"
echo "   - 또는 MongoDB Compass를 사용하여 연결 확인"
echo
read -p "MongoDB가 실행 중인지 확인했습니까? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "MongoDB를 먼저 실행해주세요."
    exit 1
fi

echo
echo "3. 환경 변수 설정..."
if [ ! -f .env ]; then
    cp env.example .env
    echo ".env 파일이 생성되었습니다. 필요한 API 키를 설정하세요."
    read -p "API 키 설정을 완료했습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "API 키를 설정한 후 다시 실행해주세요."
        exit 1
    fi
fi

echo
echo "4. 개발 서버 시작..."
npm run dev
