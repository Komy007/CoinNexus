import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { api } from '../../contexts/AuthContext';

const TableContainer = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    font-size: var(--font-size-sm);
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--border-color);
    transition: background-color var(--transition-fast);
    
    &:hover {
      background: var(--bg-hover);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: var(--spacing-md);
    font-size: var(--font-size-sm);
  }
`;

const SymbolCell = styled.td`
  font-weight: 600;
  color: var(--text-primary);
`;

const RateCell = styled.td`
  color: ${props => {
    if (props.$rate > 0) return 'var(--accent-success)';
    if (props.$rate < 0) return 'var(--accent-danger)';
    return 'var(--text-secondary)';
  }};
  font-weight: 500;
`;

const TimeCell = styled.td`
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  
  i {
    font-size: 2rem;
    margin-bottom: var(--spacing-md);
    color: var(--accent-primary);
  }
`;

function FundingRatesTable() {
  const { data: fundingData, isLoading, error } = useQuery(
    'funding-rates',
    () => api.get('/market/funding-rates').then(res => res.data),
    { refetchInterval: 60000 }
  );

  const formatRate = (rate) => {
    return `${(rate * 100).toFixed(4)}%`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <TableContainer>
        <TableHeader>
          <h3 data-i18n="dashboard.funding.title">펀딩비 현황</h3>
        </TableHeader>
        <LoadingSpinner>
          <div className="spinner" />
        </LoadingSpinner>
      </TableContainer>
    );
  }

  if (error || !fundingData?.data?.length) {
    return (
      <TableContainer>
        <TableHeader>
          <h3 data-i18n="dashboard.funding.title">펀딩비 현황</h3>
        </TableHeader>
        <EmptyState>
          <i className="fas fa-exclamation-triangle"></i>
          <p data-i18n="dashboard.funding.error">펀딩비 데이터를 불러올 수 없습니다</p>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <h3 data-i18n="dashboard.funding.title">펀딩비 현황</h3>
      </TableHeader>
      
      <Table>
        <TableHead>
          <tr>
            <th data-i18n="dashboard.funding.symbol">심볼</th>
            <th data-i18n="dashboard.funding.rate">펀딩비</th>
            <th data-i18n="dashboard.funding.nextTime">다음 펀딩 시간</th>
          </tr>
        </TableHead>
        <TableBody>
          {fundingData.data.slice(0, 10).map((item, index) => (
            <tr key={item.symbol}>
              <SymbolCell>{item.symbol}</SymbolCell>
              <RateCell $rate={item.fundingRate}>
                {formatRate(item.fundingRate)}
              </RateCell>
              <TimeCell>
                {formatTime(item.nextFundingTime)}
              </TimeCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FundingRatesTable;
