@echo off
echo CoinNexus 프로젝트를 시작합니다...
echo.

echo 1. 의존성 설치 중...
call npm run install-all
if %errorlevel% neq 0 (
    echo 의존성 설치에 실패했습니다.
    pause
    exit /b 1
)

echo.
echo 2. MongoDB가 실행 중인지 확인하세요.
echo    - Windows: net start MongoDB
echo    - 또는 MongoDB Compass를 사용하여 연결 확인
echo.
pause

echo.
echo 3. 환경 변수 설정...
if not exist .env (
    copy env.example .env
    echo .env 파일이 생성되었습니다. 필요한 API 키를 설정하세요.
    pause
)

echo.
echo 4. 개발 서버 시작...
call npm run dev

pause
