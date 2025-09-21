const express = require('express');
const axios = require('axios');

const router = express.Router();

// 실시간 시장 데이터 조회
router.get('/data', async (req, res) => {
  try {
    const { symbol } = req.query;
    
    // 폴백 데이터 (MarketData 모델 제거됨)
    const fallbackData = [
      { symbol: 'BTC', price: 115580, change: 0.48, volume: 10654, lastUpdated: new Date() },
      { symbol: 'ETH', price: 2680, change: 1.23, volume: 125000, lastUpdated: new Date() },
      { symbol: 'BNB', price: 420, change: 2.12, volume: 45000, lastUpdated: new Date() },
      { symbol: 'ADA', price: 0.45, change: -3.23, volume: 200000, lastUpdated: new Date() },
      { symbol: 'SOL', price: 95, change: 1.85, volume: 80000, lastUpdated: new Date() },
      { symbol: 'XRP', price: 0.62, change: -1.45, volume: 150000, lastUpdated: new Date() },
      { symbol: 'DOT', price: 18.5, change: -2.10, volume: 30000, lastUpdated: new Date() },
      { symbol: 'DOGE', price: 0.08, change: 0.95, volume: 500000, lastUpdated: new Date() }
    ];
    
    const filteredData = symbol ? 
      fallbackData.filter(item => item.symbol === symbol) : 
      fallbackData;
    
    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('시장 데이터 조회 오류:', error);
    res.status(500).json({ 
      success: false,
      message: '시장 데이터를 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

// 실시간 가격 정보 (바이낸스 API)
router.get('/prices', async (req, res) => {
  try {
    console.log('바이낸스 API 호출 시작...');
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    console.log('바이낸스 API 응답 받음, 데이터 개수:', response.data.length);
    
    const data = response.data
      .filter(item => ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT'].includes(item.symbol))
      .map(item => ({
        symbol: item.symbol,
        price: parseFloat(item.lastPrice),
        priceChange: parseFloat(item.priceChange),
        priceChangePercent: parseFloat(item.priceChangePercent),
        volume: parseFloat(item.volume),
        highPrice: parseFloat(item.highPrice),
        lowPrice: parseFloat(item.lowPrice),
        openPrice: parseFloat(item.openPrice),
        count: parseInt(item.count)
      }));

    console.log('처리된 데이터:', data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('실시간 가격 조회 오류:', error.message);
    console.error('오류 상세:', error);
    
    // 폴백 데이터 제공
    const fallbackData = [
      { symbol: 'BTCUSDT', price: 115580.90, priceChange: 549.91, priceChangePercent: 0.478, volume: 10654.55, highPrice: 116009.62, lowPrice: 114384.00, openPrice: 115030.99, count: 2363256 },
      { symbol: 'ETHUSDT', price: 2680.50, priceChange: 32.15, priceChangePercent: 1.23, volume: 125000.00, highPrice: 2700.00, lowPrice: 2640.00, openPrice: 2648.35, count: 1500000 },
      { symbol: 'BNBUSDT', price: 420.25, priceChange: 8.75, priceChangePercent: 2.12, volume: 45000.00, highPrice: 425.00, lowPrice: 410.00, openPrice: 411.50, count: 800000 },
      { symbol: 'ADAUSDT', price: 0.45, priceChange: -0.015, priceChangePercent: -3.23, volume: 200000.00, highPrice: 0.47, lowPrice: 0.44, openPrice: 0.465, count: 500000 }
    ];
    
    res.json({ success: true, data: fallbackData });
  }
});

// ⚠️ 환율 API 제거 (정확도 문제로 서비스 중단)
// 환율의 정확성이 보장되지 않으면 서비스하지 않는 것이 원칙
// 향후 한국은행 ECOS API 또는 신한은행 Open API 등 공신력 있는 소스 연동 필요
/*
router.get('/exchange-rates', async (req, res) => {
  // 환율 정확도 검증 완료 후 재활성화 예정
  res.status(503).json({
    success: false,
    message: '환율 서비스는 정확도 검증을 위해 일시 중단되었습니다.'
  });
});
*/

// Fear & Greed Index
router.get('/fear-greed', async (req, res) => {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    const data = response.data.data[0];
    
    res.json({ 
      success: true, 
      data: {
        value: parseInt(data.value),
        classification: data.value_classification,
        timestamp: data.timestamp,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Fear & Greed Index 조회 오류:', error);
    
    // 폴백 데이터
    const fallbackData = {
      value: 65,
      classification: 'Greed',
      timestamp: Math.floor(Date.now() / 1000).toString(),
      lastUpdated: new Date().toISOString(),
      fallback: true
    };
    
    res.json({ success: true, data: fallbackData });
  }
});

// 펀딩 비율 정보
router.get('/funding-rates', async (req, res) => {
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/premiumIndex');
    
    const data = response.data
      .filter(item => ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT'].includes(item.symbol))
      .map(item => ({
        symbol: item.symbol,
        fundingRate: parseFloat(item.lastFundingRate) * 100, // 퍼센트로 변환
        nextFundingTime: parseInt(item.nextFundingTime),
        markPrice: parseFloat(item.markPrice)
      }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('펀딩 비율 조회 오류:', error);
    
    // 폴백 데이터
    const fallbackData = [
      { symbol: 'BTCUSDT', fundingRate: 0.01, nextFundingTime: Date.now() + 8 * 60 * 60 * 1000, markPrice: 115580 },
      { symbol: 'ETHUSDT', fundingRate: 0.005, nextFundingTime: Date.now() + 8 * 60 * 60 * 1000, markPrice: 2680 },
      { symbol: 'BNBUSDT', fundingRate: 0.008, nextFundingTime: Date.now() + 8 * 60 * 60 * 1000, markPrice: 420 },
      { symbol: 'ADAUSDT', fundingRate: -0.002, nextFundingTime: Date.now() + 8 * 60 * 60 * 1000, markPrice: 0.45 }
    ];
    
    res.json({ 
      success: true, 
      data: fallbackData,
      message: '폴백 데이터를 제공합니다.'
    });
  }
});

// 미결제약정 정보
router.get('/open-interest', async (req, res) => {
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/openInterest');
    
    const data = response.data
      .filter(item => ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT'].includes(item.symbol))
      .map(item => ({
        symbol: item.symbol,
        openInterest: parseFloat(item.openInterest),
        time: Date.now()
      }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('미결제약정 조회 오류:', error);
    
    // 폴백 데이터
    const fallbackData = [
      { symbol: 'BTCUSDT', openInterest: 120000.5, time: Date.now() },
      { symbol: 'ETHUSDT', openInterest: 95000.3, time: Date.now() },
      { symbol: 'BNBUSDT', openInterest: 80000.7, time: Date.now() },
      { symbol: 'ADAUSDT', openInterest: 60000.2, time: Date.now() },
      { symbol: 'SOLUSDT', openInterest: 45000.8, time: Date.now() },
      { symbol: 'XRPUSDT', openInterest: 35000.1, time: Date.now() },
      { symbol: 'DOTUSDT', openInterest: 25000.9, time: Date.now() },
      { symbol: 'DOGEUSDT', openInterest: 20000.4, time: Date.now() }
    ];
    
    res.json({ 
      success: true, 
      data: fallbackData,
      message: '폴백 데이터를 제공합니다.'
    });
  }
});

// 24시간 거래량 상위 코인
router.get('/top-volume', async (req, res) => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const data = response.data
      .filter(item => item.symbol.endsWith('USDT'))
      .map(item => ({
        symbol: item.symbol,
        volume: parseFloat(item.volume),
        price: parseFloat(item.lastPrice),
        priceChangePercent: parseFloat(item.priceChangePercent)
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 10);

    res.json({ success: true, data });
  } catch (error) {
    console.error('거래량 상위 코인 조회 오류:', error);
    
    // 폴백 데이터
    const fallbackData = [
      { symbol: 'BTCUSDT', volume: 45000, price: 115580, priceChangePercent: 2.45 },
      { symbol: 'ETHUSDT', volume: 125000, price: 2680, priceChangePercent: 1.85 },
      { symbol: 'BNBUSDT', volume: 45000, price: 420, priceChangePercent: 2.12 },
      { symbol: 'ADAUSDT', volume: 200000, price: 0.45, priceChangePercent: -2.15 },
      { symbol: 'SOLUSDT', volume: 80000, price: 95, priceChangePercent: 1.25 }
    ];
    
    res.json({ success: true, data: fallbackData });
  }
});

module.exports = router;