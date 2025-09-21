import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';

const HallOfFameContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const HallOfFameContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const HallOfFameHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-md);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-base);
    }
  }
`;

const DonorsGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
`;

const DonorCard = styled(motion.div)`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      if (props.rank === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
      if (props.rank === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)';
      if (props.rank === 3) return 'linear-gradient(135deg, #cd7f32, #daa520)';
      return 'var(--gradient-primary)';
    }};
  }
`;

const DonorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const RankBadge = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--bg-primary);
  background: ${props => {
    if (props.rank === 1) return 'linear-gradient(135deg, #ffd700, #ffed4e)';
    if (props.rank === 2) return 'linear-gradient(135deg, #c0c0c0, #e5e5e5)';
    if (props.rank === 3) return 'linear-gradient(135deg, #cd7f32, #daa520)';
    return 'var(--gradient-primary)';
  }};
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: var(--font-size-lg);
  }
`;

const DonorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
`;

const DonorAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg-primary);
  font-weight: 600;
  font-size: var(--font-size-xl);
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: var(--font-size-lg);
  }
`;

const DonorDetails = styled.div`
  .donor-name {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-lg);
    }
  }
  
  .donor-stats {
    display: flex;
    gap: var(--spacing-lg);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: var(--spacing-xs);
    }
  }
`;

const DonationAmount = styled.div`
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: left;
  }
  
  .amount {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    
    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
    }
  }
  
  .label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-secondary);
  
  i {
    font-size: 4rem;
    margin-bottom: var(--spacing-lg);
    color: var(--accent-primary);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }
`;

function HallOfFame() {
  const { data: hallOfFameData, isLoading, error } = useQuery(
    'hall-of-fame',
    () => api.get('/donations/hall-of-fame').then(res => res.data)
  );

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <HallOfFameContainer>
        <HallOfFameContent>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </HallOfFameContent>
      </HallOfFameContainer>
    );
  }

  if (error) {
    return (
      <HallOfFameContainer>
        <HallOfFameContent>
          <EmptyState>
            <i className="fas fa-exclamation-triangle"></i>
            <h3>오류가 발생했습니다</h3>
            <p>명예의 전당 데이터를 불러오는 중 문제가 발생했습니다.</p>
          </EmptyState>
        </HallOfFameContent>
      </HallOfFameContainer>
    );
  }

  return (
    <HallOfFameContainer>
      <Helmet>
        <title data-i18n="hallOfFame.title">명예의 전당 - CoinNexus</title>
        <meta name="description" content="CoinNexus를 지원해주신 기부자들의 명예의 전당" />
      </Helmet>

      <HallOfFameContent>
        <HallOfFameHeader>
          <h1 data-i18n="hallOfFame.header.title">명예의 전당</h1>
          <p data-i18n="hallOfFame.header.description">
            CoinNexus 플랫폼의 발전을 위해 기부해주신 분들께 감사드립니다
          </p>
        </HallOfFameHeader>

        <DonorsGrid>
          {hallOfFameData?.topDonors?.length > 0 ? (
            hallOfFameData.topDonors.map((donor, index) => (
              <DonorCard
                key={donor._id}
                rank={index + 1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DonorHeader>
                  <RankBadge rank={index + 1}>
                    {index + 1}
                  </RankBadge>
                  
                  <DonorInfo>
                    <DonorAvatar>
                      {donor.donor?.username?.charAt(0).toUpperCase() || 'U'}
                    </DonorAvatar>
                    <DonorDetails>
                      <div className="donor-name">
                        {donor.donor?.username || '익명'}
                      </div>
                      <div className="donor-stats">
                        <span>
                          <i className="fas fa-gift"></i> {donor.donationCount}회 기부
                        </span>
                        <span>
                          <i className="fas fa-calendar"></i> 마지막 기부: {formatDate(donor.lastDonation)}
                        </span>
                      </div>
                    </DonorDetails>
                  </DonorInfo>
                  
                  <DonationAmount>
                    <div className="amount">
                      {formatAmount(donor.totalAmount)}
                    </div>
                    <div className="label" data-i18n="hallOfFame.totalDonated">
                      총 기부액
                    </div>
                  </DonationAmount>
                </DonorHeader>
              </DonorCard>
            ))
          ) : (
            <EmptyState>
              <i className="fas fa-trophy"></i>
              <h3 data-i18n="hallOfFame.empty.title">아직 기부자가 없습니다</h3>
              <p data-i18n="hallOfFame.empty.description">
                첫 번째 기부자가 되어 명예의 전당에 이름을 올려보세요!
              </p>
            </EmptyState>
          )}
        </DonorsGrid>
      </HallOfFameContent>
    </HallOfFameContainer>
  );
}

export default HallOfFame;
