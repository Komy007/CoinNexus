import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { api } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

// 컴포넌트
import CoinSearch from '../components/watchlist/CoinSearch';
import WatchlistItem from '../components/watchlist/WatchlistItem';

const WatchlistContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: var(--spacing-lg);
`;

const WatchlistContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h1 {
    color: var(--text-primary);
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-lg);
  }
`;

const StatsBar = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
`;

const StatCard = styled.div`
  text-align: center;
  
  .stat-number {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .stat-label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  border: 2px dashed var(--border-color);
  
  .icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
  }
  
  h3 {
    color: var(--text-primary);
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    font-size: var(--font-size-md);
    margin-bottom: var(--spacing-lg);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--bg-tertiary);
    border-top: 3px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: var(--error-color);
  color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

function Watchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);

  // 관심목록 조회 (실시간 가격 포함)
  const { data: watchlistData, isLoading, error } = useQuery(
    'watchlist-prices',
    () => api.get('/watchlist/prices').then(res => res.data),
    {
      refetchInterval: 30000, // 30초마다 갱신
      staleTime: 10000,
      retry: 3
    }
  );

  // 코인 추가 뮤테이션
  const addCoinMutation = useMutation(
    (coinData) => api.post('/watchlist', coinData).then(res => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('watchlist-prices');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '코인 추가에 실패했습니다.');
      }
    }
  );

  // 코인 제거 뮤테이션
  const removeCoinMutation = useMutation(
    (watchlistId) => api.delete(`/watchlist/${watchlistId}`).then(res => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('watchlist-prices');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '코인 제거에 실패했습니다.');
      }
    }
  );

  // 코인 수정 뮤테이션
  const updateCoinMutation = useMutation(
    ({ watchlistId, data }) => api.put(`/watchlist/${watchlistId}`, data).then(res => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('watchlist-prices');
        setEditingId(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || '수정에 실패했습니다.');
      }
    }
  );

  const handleAddCoin = (coinData) => {
    addCoinMutation.mutate(coinData);
  };

  const handleRemoveCoin = (watchlistId) => {
    if (window.confirm('정말로 이 코인을 관심목록에서 제거하시겠습니까?')) {
      removeCoinMutation.mutate(watchlistId);
    }
  };

  const handleEditCoin = (watchlistId) => {
    setEditingId(watchlistId);
  };

  const handleSaveEdit = (watchlistId, editData) => {
    updateCoinMutation.mutate({ watchlistId, data: editData });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const watchlists = watchlistData?.watchlists || [];
  const existingSymbols = watchlists.map(w => w.symbol);

  // 통계 계산
  const totalCoins = watchlists.length;
  const positiveCoins = watchlists.filter(w => w.priceChangePercent > 0).length;
  const targetReachedCoins = watchlists.filter(w => w.isTargetReached).length;
  const maxCoins = user?.isPremium ? 20 : 5;

  if (error) {
    return (
      <WatchlistContainer>
        <WatchlistContent>
          <ErrorMessage>
            관심목록을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.
          </ErrorMessage>
        </WatchlistContent>
      </WatchlistContainer>
    );
  }

  return (
    <WatchlistContainer>
      <Helmet>
        <title data-i18n="watchlist.title">관심목록 - CoinNexus</title>
        <meta name="description" content="내가 관심있는 코인들의 실시간 가격과 추이를 확인하세요" />
      </Helmet>

      <WatchlistContent>
        <Header>
          <h1 data-i18n="watchlist.header">📈 내 관심목록</h1>
          <p className="subtitle" data-i18n="watchlist.subtitle">
            관심있는 코인들의 실시간 가격과 추이를 확인하세요
          </p>
        </Header>

        <StatsBar>
          <StatCard>
            <div className="stat-number">{totalCoins}/{maxCoins}</div>
            <div className="stat-label" data-i18n="watchlist.total">총 코인</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{positiveCoins}</div>
            <div className="stat-label" data-i18n="watchlist.positive">상승</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{targetReachedCoins}</div>
            <div className="stat-label" data-i18n="watchlist.targets">목표달성</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">
              {user?.isPremium ? '프리미엄' : '일반'}
            </div>
            <div className="stat-label" data-i18n="watchlist.membership">회원등급</div>
          </StatCard>
        </StatsBar>

        <CoinSearch 
          onAddCoin={handleAddCoin}
          existingSymbols={existingSymbols}
          userInfo={user}
        />

        {isLoading ? (
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        ) : watchlists.length > 0 ? (
          <WatchlistGrid>
            {watchlists.map(watchlist => (
              <WatchlistItem
                key={watchlist.id}
                watchlist={watchlist}
                onEdit={handleEditCoin}
                onRemove={handleRemoveCoin}
                isEditing={editingId === watchlist.id}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ))}
          </WatchlistGrid>
        ) : (
          <EmptyState>
            <div className="icon">📊</div>
            <h3 data-i18n="watchlist.empty.title">관심목록이 비어있습니다</h3>
            <p data-i18n="watchlist.empty.description">
              위의 검색창에서 관심있는 코인을 검색하고 추가해보세요!
            </p>
          </EmptyState>
        )}
      </WatchlistContent>
    </WatchlistContainer>
  );
}

export default Watchlist;

