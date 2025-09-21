const axios = require('axios');

class BinanceService {
  constructor() {
    this.baseURL = 'https://api.binance.com/api/v3';
    this.futuresURL = 'https://fapi.binance.com/fapi/v1';
  }

  // 실시간 가격 정보 가져오기
  async getTickerPrices(symbols = []) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/24hr`);
      let data = response.data;

      // 특정 심볼만 필터링
      if (symbols.length > 0) {
        data = data.filter(ticker => 
          symbols.some(symbol => ticker.symbol === symbol)
        );
      }

      // 주요 코인만 필터링 (USDT 페어)
      const majorCoins = data.filter(ticker => 
        ticker.symbol.endsWith('USDT') && 
        ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'XRPUSDT', 'DOTUSDT', 'DOGEUSDT'].includes(ticker.symbol)
      );

      return majorCoins.map(ticker => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        priceChange: parseFloat(ticker.priceChange),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        highPrice: parseFloat(ticker.highPrice),
        lowPrice: parseFloat(ticker.lowPrice),
        openPrice: parseFloat(ticker.openPrice),
        count: parseInt(ticker.count)
      }));
    } catch (error) {
      console.error('바이낸스 가격 정보 조회 오류:', error.message);
      throw error;
    }
  }

  // 특정 코인 가격 정보
  async getSymbolPrice(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/24hr`, {
        params: { symbol: symbol }
      });
      
      const ticker = response.data;
      return {
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        priceChange: parseFloat(ticker.priceChange),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        highPrice: parseFloat(ticker.highPrice),
        lowPrice: parseFloat(ticker.lowPrice),
        openPrice: parseFloat(ticker.openPrice)
      };
    } catch (error) {
      console.error(`바이낸스 ${symbol} 가격 조회 오류:`, error.message);
      throw error;
    }
  }

  // 선물 펀딩비 정보
  async getFundingRates() {
    try {
      const response = await axios.get(`${this.futuresURL}/premiumIndex`);
      
      return response.data.map(item => ({
        symbol: item.symbol,
        fundingRate: parseFloat(item.lastFundingRate),
        nextFundingTime: parseInt(item.nextFundingTime),
        markPrice: parseFloat(item.markPrice),
        indexPrice: parseFloat(item.indexPrice)
      }));
    } catch (error) {
      console.error('바이낸스 펀딩비 조회 오류:', error.message);
      throw error;
    }
  }

  // 선물 미결제 약정 정보
  async getOpenInterest() {
    try {
      const response = await axios.get(`${this.futuresURL}/openInterest`);
      
      return response.data.map(item => ({
        symbol: item.symbol,
        openInterest: parseFloat(item.openInterest),
        time: parseInt(item.time)
      }));
    } catch (error) {
      console.error('바이낸스 미결제 약정 조회 오류:', error.message);
      throw error;
    }
  }

  // 공포 & 탐욕 지수 (대체 API)
  async getFearGreedIndex() {
    try {
      // Alternative.me API 사용
      const response = await axios.get('https://api.alternative.me/fng/');
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const data = response.data.data[0];
        return {
          value: parseInt(data.value),
          valueClassification: data.value_classification,
          timestamp: parseInt(data.timestamp)
        };
      }
      
      throw new Error('공포 & 탐욕 지수 데이터를 찾을 수 없습니다.');
    } catch (error) {
      console.error('공포 & 탐욕 지수 조회 오류:', error.message);
      // 폴백 데이터
      return {
        value: 50,
        valueClassification: 'Neutral',
        timestamp: Date.now()
      };
    }
  }

  // 거래량 상위 코인
  async getTopVolumeCoins(limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/24hr`);
      const data = response.data;

      // USDT 페어만 필터링하고 거래량 기준 정렬
      const usdtPairs = data
        .filter(ticker => ticker.symbol.endsWith('USDT'))
        .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
        .slice(0, limit);

      return usdtPairs.map(ticker => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        volumeQuote: parseFloat(ticker.quoteVolume)
      }));
    } catch (error) {
      console.error('거래량 상위 코인 조회 오류:', error.message);
      throw error;
    }
  }

  // 환율 정보 (USD/KRW)
  async getExchangeRates() {
    try {
      // ExchangeRate-API 사용
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      
      return {
        USD_KRW: response.data.rates.KRW || 1300, // 폴백값
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('환율 정보 조회 오류:', error.message);
      // 폴백 데이터
      return {
        USD_KRW: 1300,
        timestamp: Date.now()
      };
    }
  }
}

module.exports = new BinanceService();
