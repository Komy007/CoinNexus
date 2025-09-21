const express = require('express');
const router = express.Router();
const { UserWatchlist, User } = require('../models/sqlite');
const auth = require('../middleware/auth');

// 관심목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const watchlists = await UserWatchlist.findAll({
      where: { userId: req.userId },
      order: [['addedAt', 'DESC']]
    });

    res.json({
      success: true,
      watchlists: watchlists.map(w => w.toJSON())
    });
  } catch (error) {
    console.error('관심목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '관심목록을 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 관심목록 추가
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, coinName, targetPrice, notes } = req.body;

    if (!symbol || !coinName) {
      return res.status(400).json({
        success: false,
        message: '심볼과 코인명은 필수입니다.'
      });
    }

    // 사용자 정보 조회 (프리미엄 여부 확인)
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 기존 관심목록 개수 확인
    const existingCount = await UserWatchlist.count({
      where: { userId: req.userId }
    });

    // 사용자 등급별 최대 개수 제한
    const maxCoins = user.isPremium ? 20 : 5;
    if (existingCount >= maxCoins) {
      return res.status(400).json({
        success: false,
        message: user.isPremium 
          ? '프리미엄 회원은 최대 20개까지 저장할 수 있습니다.' 
          : '일반 회원은 최대 5개까지 저장할 수 있습니다. 프리미엄으로 업그레이드하세요!'
      });
    }

    // 중복 체크
    const existing = await UserWatchlist.findOne({
      where: { 
        userId: req.userId,
        symbol: symbol.toUpperCase()
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: '이미 관심목록에 추가된 코인입니다.'
      });
    }

    const watchlist = await UserWatchlist.create({
      userId: req.userId,
      symbol: symbol.toUpperCase(),
      coinName,
      targetPrice: targetPrice ? parseFloat(targetPrice) : null,
      notes: notes || null
    });

    res.status(201).json({
      success: true,
      watchlist: watchlist.toJSON(),
      message: '관심목록에 추가되었습니다.'
    });

  } catch (error) {
    console.error('관심목록 추가 오류:', error);
    res.status(500).json({
      success: false,
      message: '관심목록 추가 중 오류가 발생했습니다.'
    });
  }
});

// 관심목록 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const watchlist = await UserWatchlist.findOne({
      where: { 
        id: id,
        userId: req.userId 
      }
    });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: '관심목록을 찾을 수 없습니다.'
      });
    }

    await watchlist.destroy();

    res.json({
      success: true,
      message: '관심목록에서 삭제되었습니다.'
    });

  } catch (error) {
    console.error('관심목록 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '관심목록 삭제 중 오류가 발생했습니다.'
    });
  }
});

// 관심목록 가격 조회 (현물 + 선물 통합)
router.get('/prices', auth, async (req, res) => {
  try {
    const watchlists = await UserWatchlist.findAll({
      where: { userId: req.userId },
      order: [['addedAt', 'DESC']]
    });

    if (watchlists.length === 0) {
      return res.json({
        success: true,
        watchlists: [],
        prices: []
      });
    }

    const symbolsArray = watchlists.map(w => w.symbol);
    console.log('관심목록 가격 조회 요청:', symbolsArray);

    // 현물 거래에서 가격 조회
    let spotPrices = [];
    try {
      const spotResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
        headers: {
          'User-Agent': 'CoinNexus/1.0',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (spotResponse.ok) {
        const spotData = await spotResponse.json();
        if (Array.isArray(spotData)) {
          spotPrices = spotData.filter(item => 
            item && 
            item.symbol && 
            item.lastPrice && 
            symbolsArray.includes(item.symbol)
          );
          console.log('현물에서 찾은 가격:', spotPrices.map(p => p.symbol));
        }
      }
    } catch (spotError) {
      console.error('현물 API 오류:', spotError.message);
    }

    // 현물에서 찾지 못한 심볼들을 선물에서 검색
    const missingSymbols = symbolsArray.filter(symbol =>
      !spotPrices.some(item => item.symbol === symbol)
    );

    let futuresPrices = [];
    if (missingSymbols.length > 0) {
      console.log('선물에서 검색할 심볼들:', missingSymbols);
      
      try {
        const futuresResponse = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr', {
          headers: {
            'User-Agent': 'CoinNexus/1.0',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (futuresResponse.ok) {
          const futuresData = await futuresResponse.json();
          if (Array.isArray(futuresData)) {
            futuresPrices = futuresData.filter(item => 
              item && 
              item.symbol && 
              item.lastPrice && 
              missingSymbols.includes(item.symbol)
            );
            console.log('선물에서 찾은 가격:', futuresPrices.map(p => p.symbol));
          }
        }
      } catch (futuresError) {
        console.error('선물 API 오류:', futuresError.message);
      }
    }

    // 모든 가격 데이터 합치기
    const allPrices = [...spotPrices, ...futuresPrices];

    // 관심목록과 가격 매칭
    const pricesWithWatchlist = watchlists.map(watchlist => {
      const priceData = allPrices.find(price => price.symbol === watchlist.symbol);
      
      if (priceData && priceData.lastPrice) {
        return {
          ...watchlist.toJSON(),
          currentPrice: parseFloat(priceData.lastPrice),
          priceChange: parseFloat(priceData.priceChange || 0),
          priceChangePercent: parseFloat(priceData.priceChangePercent || 0),
          volume: parseFloat(priceData.volume || 0),
          highPrice: parseFloat(priceData.highPrice || 0),
          lowPrice: parseFloat(priceData.lowPrice || 0),
          openPrice: parseFloat(priceData.openPrice || 0),
          isTargetReached: watchlist.targetPrice ?
            parseFloat(priceData.lastPrice) >= watchlist.targetPrice : false,
          source: spotPrices.some(p => p.symbol === priceData.symbol) ? 'spot' : 'futures'
        };
      }

      return {
        ...watchlist.toJSON(),
        currentPrice: null,
        priceChange: null,
        priceChangePercent: null,
        error: '가격 정보를 가져올 수 없습니다.'
      };
    });

    res.json({
      success: true,
      watchlists: pricesWithWatchlist,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('관심목록 가격 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '가격 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 코인 검색 (현물 → 선물 순서)
router.get('/search', async (req, res) => {
  const { query, limit = 50 } = req.query;

  if (!query || query.trim().length < 1) {
    return res.json({
      success: true,
      data: [],
      total: 0,
      query: query,
      message: '검색어를 입력해주세요.'
    });
  }

  const searchTerm = query.toLowerCase().trim();
  console.log(`코인 검색 요청: "${searchTerm}"`);

  try {
    let allResults = [];

    // 1단계: 현물 거래에서 검색
    try {
      const spotResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
        headers: {
          'User-Agent': 'CoinNexus/1.0',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (spotResponse.ok) {
        const spotData = await spotResponse.json();
        if (Array.isArray(spotData)) {
          const spotResults = spotData
            .filter(item => {
              if (!item || !item.symbol || !item.lastPrice) return false;
              
              // 주요 페어만 포함
              const isMainPair = item.symbol.endsWith('USDT') || 
                                item.symbol.endsWith('BTC') || 
                                item.symbol.endsWith('ETH') || 
                                item.symbol.endsWith('BNB') ||
                                item.symbol.endsWith('BUSD') ||
                                item.symbol.endsWith('USDC');
              
              if (!isMainPair) return false;
              
              // 검색어 매칭
              const symbol = item.symbol.replace(/USDT|BTC|ETH|BNB|BUSD|USDC$/, '').toLowerCase();
              
              // BTC 검색 특별 처리
              if (searchTerm === 'btc' && item.symbol === 'BTCUSDT') {
                return true;
              }
              
              return symbol === searchTerm || symbol.includes(searchTerm);
            })
            .map(item => ({
              symbol: item.symbol,
              price: parseFloat(item.lastPrice),
              priceChange: parseFloat(item.priceChange || 0),
              priceChangePercent: parseFloat(item.priceChangePercent || 0),
              volume: parseFloat(item.volume || 0),
              highPrice: parseFloat(item.highPrice || 0),
              lowPrice: parseFloat(item.lowPrice || 0),
              source: 'spot'
            }))
            .sort((a, b) => {
              // 정확한 매칭 우선, 그 다음 거래량 순
              const aSymbol = a.symbol.replace(/USDT|BTC|ETH|BNB|BUSD|USDC$/, '').toLowerCase();
              const bSymbol = b.symbol.replace(/USDT|BTC|ETH|BNB|BUSD|USDC$/, '').toLowerCase();
              
              const aExactMatch = aSymbol === searchTerm;
              const bExactMatch = bSymbol === searchTerm;
              
              if (aExactMatch && !bExactMatch) return -1;
              if (!aExactMatch && bExactMatch) return 1;
              
              return b.volume - a.volume;
            });

          allResults = allResults.concat(spotResults);
          console.log(`현물에서 ${spotResults.length}개 발견`);
        }
      }
    } catch (spotError) {
      console.error('현물 API 오류:', spotError.message);
    }

    // 2단계: 선물 거래에서 검색 (현물에서 충분한 결과가 없을 때)
    if (allResults.length < 10) {
      try {
        const futuresResponse = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr', {
          headers: {
            'User-Agent': 'CoinNexus/1.0',
            'Accept': 'application/json'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (futuresResponse.ok) {
          const futuresData = await futuresResponse.json();
          if (Array.isArray(futuresData)) {
            const futuresResults = futuresData
              .filter(item => {
                if (!item || !item.symbol || !item.lastPrice) return false;
                
                // 이미 현물에서 찾은 것은 제외
                if (allResults.some(r => r.symbol === item.symbol)) return false;
                
                // 주요 페어만 포함
                const isMainPair = item.symbol.endsWith('USDT') || 
                                  item.symbol.endsWith('BTC') || 
                                  item.symbol.endsWith('ETH') || 
                                  item.symbol.endsWith('BNB');
                
                if (!isMainPair) return false;
                
                // 검색어 매칭
                const symbol = item.symbol.replace(/USDT|BTC|ETH|BNB$/, '').toLowerCase();
                
                // BTC 검색 특별 처리
                if (searchTerm === 'btc' && item.symbol === 'BTCUSDT') {
                  return true;
                }
                
                return symbol === searchTerm || symbol.includes(searchTerm);
              })
              .map(item => ({
                symbol: item.symbol,
                price: parseFloat(item.lastPrice),
                priceChange: parseFloat(item.priceChange || 0),
                priceChangePercent: parseFloat(item.priceChangePercent || 0),
                volume: parseFloat(item.volume || 0),
                highPrice: parseFloat(item.highPrice || 0),
                lowPrice: parseFloat(item.lowPrice || 0),
                source: 'futures'
              }))
              .sort((a, b) => b.volume - a.volume);

            allResults = allResults.concat(futuresResults);
            console.log(`선물에서 ${futuresResults.length}개 발견`);
          }
        }
      } catch (futuresError) {
        console.error('선물 API 오류:', futuresError.message);
      }
    }

    // 결과 제한
    const finalResults = allResults.slice(0, parseInt(limit));
    console.log(`최종 검색 결과: ${finalResults.length}개`);

    res.json({
      success: true,
      data: finalResults,
      total: finalResults.length,
      query: query,
      sources: {
        spot: finalResults.filter(r => r.source === 'spot').length,
        futures: finalResults.filter(r => r.source === 'futures').length
      }
    });

  } catch (error) {
    console.error('코인 검색 오류:', error);
    
    res.json({
      success: true,
      data: [],
      total: 0,
      query: query,
      message: '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

module.exports = router;