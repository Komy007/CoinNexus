import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../../contexts/AuthContext';

const SearchContainer = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px rgba(0, 212, 170, 0.2);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const SearchResults = styled.div`
  margin-top: var(--spacing-md);
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
`;

const SearchResultItem = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .symbol {
    font-weight: 600;
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }
  
  .name {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
`;

const PriceInfo = styled.div`
  text-align: right;
  
  .price {
    font-weight: 600;
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }
  
  .change {
    font-size: var(--font-size-sm);
    
    &.positive {
      color: var(--success-color);
    }
    
    &.negative {
      color: var(--error-color);
    }
  }
`;

const AddButton = styled.button`
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-lg);
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--bg-tertiary);
    border-top: 2px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoResults = styled.div`
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--text-secondary);
`;

function CoinSearch({ onAddCoin, existingSymbols = [], userInfo = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 코인 검색 API 호출
  const { data: searchData, isLoading: searchLoading } = useQuery(
    ['coin-search', searchTerm],
    () => {
      if (!searchTerm.trim()) return Promise.resolve({ data: [] });
      return api.get('/watchlist/search', {
        params: { query: searchTerm, limit: 20 }
      }).then(res => res.data);
    },
    {
      enabled: searchTerm.trim().length > 0,
      staleTime: 5000,
      retry: 2
    }
  );

  // 검색 결과 처리
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchLoading) {
      setIsSearching(true);
      return;
    }

    setIsSearching(false);
    
    if (searchData?.data) {
      const processedResults = searchData.data
        .slice(0, 15) // 최대 15개만 표시
        .map(coin => ({
          ...coin,
          isAlreadyAdded: existingSymbols.includes(coin.symbol)
        }));
      
      setSearchResults(processedResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchData, searchLoading, existingSymbols]);

  const handleAddCoin = (coin) => {
    const maxCoins = userInfo?.isPremium ? 20 : 5;
    const currentCount = existingSymbols.length;
    
    if (currentCount >= maxCoins) {
      alert(userInfo?.isPremium 
        ? '프리미엄 회원은 최대 20개까지 저장할 수 있습니다.' 
        : '일반 회원은 최대 5개까지 저장할 수 있습니다. 프리미엄으로 업그레이드하세요!'
      );
      return;
    }

    onAddCoin({
      symbol: coin.symbol,
      coinName: coin.symbol.replace(/USDT|BTC|ETH|BNB|BUSD|USDC$/, ''),
      targetPrice: null,
      notes: null
    });
    setSearchTerm(''); // 검색어 초기화
  };

  const maxCoins = userInfo?.isPremium ? 20 : 5;
  const currentCount = existingSymbols.length;
  const remainingSlots = maxCoins - currentCount;

  return (
    <SearchContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
          🔍 코인 검색 및 추가
        </h3>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          {userInfo?.isPremium ? '👑 프리미엄' : '👤 일반'} 회원 | 
          남은 슬롯: <span style={{ color: remainingSlots > 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: '600' }}>
            {remainingSlots}개
          </span>
        </div>
      </div>
      
      <SearchInput
        type="text"
        placeholder="코인 심볼을 입력하세요 (예: BTC, ETH, ADA...)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {searchTerm && (
        <SearchResults>
          {isSearching ? (
            <LoadingSpinner>
              <div className="spinner" />
            </LoadingSpinner>
          ) : searchResults.length > 0 ? (
            <>
              <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                "{searchTerm}" 검색 결과 ({searchResults.length}개)
              </div>
              {searchResults.map(coin => (
                <SearchResultItem key={coin.symbol}>
                <CoinInfo>
                  <div className="symbol">{coin.symbol}</div>
                  <div className="name">{coin.symbol.replace(/USDT|BTC|ETH|BNB|BUSD|USDC$/, '')}</div>
                  {searchData?.fallback && (
                    <div style={{ fontSize: '10px', color: 'var(--accent-warning)', fontStyle: 'italic' }}>
                      새로 상장된 코인
                    </div>
                  )}
                </CoinInfo>
                  
                  <PriceInfo>
                    <div className="price">
                      ${coin.price ? parseFloat(coin.price).toLocaleString() : 'N/A'}
                    </div>
                    <div className={`change ${coin.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
                      {coin.priceChangePercent >= 0 ? '+' : ''}{coin.priceChangePercent ? coin.priceChangePercent.toFixed(2) : '0.00'}%
                    </div>
                  </PriceInfo>
                  
                  <AddButton
                    onClick={() => handleAddCoin(coin)}
                    disabled={coin.isAlreadyAdded}
                  >
                    {coin.isAlreadyAdded ? '추가됨' : '추가'}
                  </AddButton>
                </SearchResultItem>
              ))}
            </>
          ) : (
            <NoResults>
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </NoResults>
          )}
        </SearchResults>
      )}
    </SearchContainer>
  );
}

export default CoinSearch;

