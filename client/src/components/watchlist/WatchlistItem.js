import React, { useState } from 'react';
import styled from 'styled-components';

const WatchlistCard = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 212, 170, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const CoinInfo = styled.div`
  .symbol {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .name {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
`;

const PriceSection = styled.div`
  text-align: right;
  
  .current-price {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
  }
  
  .price-change {
    font-size: var(--font-size-md);
    font-weight: 600;
    
    &.positive {
      color: var(--success-color);
    }
    
    &.negative {
      color: var(--error-color);
    }
  }
`;

const CardContent = styled.div`
  margin-bottom: var(--spacing-md);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const StatItem = styled.div`
  .label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--spacing-xs);
  }
  
  .value {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const TargetPriceSection = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .target-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }
  
  .target-price {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--accent-primary);
  }
  
  .target-reached {
    color: var(--success-color);
    font-size: var(--font-size-xs);
    margin-top: var(--spacing-xs);
  }
`;

const NotesSection = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .notes-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }
  
  .notes-content {
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    line-height: 1.4;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditButton = styled.button`
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
`;

const RemoveButton = styled.button`
  background: var(--error-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const EditForm = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    font-weight: 600;
  }
  
  input, textarea {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    
    &:focus {
      outline: none;
      border-color: var(--accent-primary);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 60px;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  
  button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 600;
    transition: all 0.2s ease;
    
    &.save {
      background: var(--success-color);
      color: white;
      
      &:hover {
        background: #218838;
      }
    }
    
    &.cancel {
      background: var(--text-secondary);
      color: white;
      
      &:hover {
        background: #6c757d;
      }
    }
  }
`;

function WatchlistItem({ 
  watchlist, 
  onEdit, 
  onRemove, 
  isEditing = false, 
  onSave, 
  onCancel 
}) {
  const [editData, setEditData] = useState({
    targetPrice: watchlist.targetPrice || '',
    notes: watchlist.notes || ''
  });

  const handleSave = () => {
    onSave(watchlist.id, editData);
  };

  const handleCancel = () => {
    setEditData({
      targetPrice: watchlist.targetPrice || '',
      notes: watchlist.notes || ''
    });
    onCancel();
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${parseFloat(price).toLocaleString()}`;
  };

  const formatChange = (change) => {
    if (change === null || change === undefined) return 'N/A';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <WatchlistCard>
      <CardHeader>
        <CoinInfo>
          <div className="symbol">{watchlist.symbol}</div>
          <div className="name">{watchlist.coinName}</div>
        </CoinInfo>
        
        <PriceSection>
          <div className="current-price">
            {formatPrice(watchlist.currentPrice)}
          </div>
          <div className={`price-change ${watchlist.priceChangePercent >= 0 ? 'positive' : 'negative'}`}>
            {formatChange(watchlist.priceChangePercent)}
          </div>
        </PriceSection>
      </CardHeader>

      <CardContent>
        <StatsGrid>
          <StatItem>
            <div className="label">24h High</div>
            <div className="value">{formatPrice(watchlist.highPrice)}</div>
          </StatItem>
          <StatItem>
            <div className="label">24h Low</div>
            <div className="value">{formatPrice(watchlist.lowPrice)}</div>
          </StatItem>
          <StatItem>
            <div className="label">24h Volume</div>
            <div className="value">
              {watchlist.volume ? `${(watchlist.volume / 1000000).toFixed(1)}M` : 'N/A'}
            </div>
          </StatItem>
          <StatItem>
            <div className="label">Open Price</div>
            <div className="value">{formatPrice(watchlist.openPrice)}</div>
          </StatItem>
        </StatsGrid>

        {watchlist.targetPrice && (
          <TargetPriceSection>
            <div className="target-label">목표 가격</div>
            <div className="target-price">
              {formatPrice(watchlist.targetPrice)}
            </div>
            {watchlist.isTargetReached && (
              <div className="target-reached">🎯 목표 달성!</div>
            )}
          </TargetPriceSection>
        )}

        {watchlist.notes && (
          <NotesSection>
            <div className="notes-label">메모</div>
            <div className="notes-content">{watchlist.notes}</div>
          </NotesSection>
        )}
      </CardContent>

      <CardActions>
        <EditButton onClick={() => onEdit(watchlist.id)}>
          ✏️ 편집
        </EditButton>
        <RemoveButton onClick={() => onRemove(watchlist.id)}>
          🗑️ 제거
        </RemoveButton>
      </CardActions>

      {isEditing && (
        <EditForm>
          <FormGroup>
            <label>목표 가격 (USD)</label>
            <input
              type="number"
              step="0.01"
              placeholder="목표 가격을 입력하세요"
              value={editData.targetPrice}
              onChange={(e) => setEditData(prev => ({ ...prev, targetPrice: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup>
            <label>메모</label>
            <textarea
              placeholder="메모를 입력하세요"
              value={editData.notes}
              onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </FormGroup>
          
          <FormActions>
            <button className="save" onClick={handleSave}>
              저장
            </button>
            <button className="cancel" onClick={handleCancel}>
              취소
            </button>
          </FormActions>
        </EditForm>
      )}
    </WatchlistCard>
  );
}

export default WatchlistItem;

