import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { api } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const DonationContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
`;

const DonationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

const DonationHeader = styled.div`
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

const DonationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const WalletSection = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    color: white;
    background: ${props => props.iconBg || 'var(--gradient-primary)'};
  }
`;

const WalletCard = styled.div`
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  
  .currency-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    .currency-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-lg);
      color: white;
      background: ${props => props.iconBg || 'var(--gradient-primary)'};
    }
    
    .currency-name {
      font-weight: 600;
      color: var(--text-primary);
    }
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--border-radius);
`;

const AddressContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .address-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
  }
  
  .address-value {
    font-family: 'Courier New', monospace;
    font-size: var(--font-size-sm);
    color: var(--text-primary);
    word-break: break-all;
    line-height: 1.4;
  }
`;

const CopyButton = styled.button`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  
  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const RecentDonations = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
`;

const DonationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-sm);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DonorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .donor-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bg-primary);
    font-weight: 600;
    font-size: var(--font-size-sm);
  }
  
  .donor-name {
    font-weight: 500;
    color: var(--text-primary);
  }
`;

const DonationAmount = styled.div`
  text-align: right;
  
  .amount {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .currency {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
`;

const StatsSection = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-xl);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
`;

const StatCard = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius);
  
  .stat-value {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .stat-label {
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

function Donation() {
  const [copiedAddress, setCopiedAddress] = useState(null);

  // 지갑 주소 조회
  const { data: walletData, isLoading: walletLoading } = useQuery(
    'wallet-addresses',
    () => api.get('/donations/wallet-addresses').then(res => res.data)
  );

  // 기부 통계 조회
  const { data: statsData, isLoading: statsLoading } = useQuery(
    'donation-stats',
    () => api.get('/donations/stats').then(res => res.data)
  );

  // 최근 기부 조회
  const { data: recentDonations, isLoading: donationsLoading } = useQuery(
    'recent-donations',
    () => api.get('/donations', { params: { limit: 5 } }).then(res => res.data)
  );

  const copyToClipboard = async (address, currency) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(currency);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case 'BTC': return 'fab fa-bitcoin';
      case 'ETH': return 'fab fa-ethereum';
      case 'USDT': return 'fas fa-dollar-sign';
      default: return 'fas fa-coins';
    }
  };

  const getCurrencyColor = (currency) => {
    switch (currency) {
      case 'BTC': return 'linear-gradient(135deg, #f7931a, #ffb347)';
      case 'ETH': return 'linear-gradient(135deg, #627eea, #4f46e5)';
      case 'USDT': return 'linear-gradient(135deg, #26a17b, #00d4aa)';
      default: return 'var(--gradient-primary)';
    }
  };

  if (walletLoading || statsLoading || donationsLoading) {
    return (
      <DonationContainer>
        <DonationContent>
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        </DonationContent>
      </DonationContainer>
    );
  }

  const currencies = [
    { key: 'BTC', name: 'Bitcoin', network: 'bitcoin' },
    { key: 'ETH', name: 'Ethereum', network: 'ethereum' },
    { key: 'USDT', name: 'Tether', network: 'tron' }
  ];

  return (
    <DonationContainer>
      <Helmet>
        <title data-i18n="donation.title">기부하기 - CoinNexus</title>
        <meta name="description" content="CoinNexus 플랫폼 발전을 위한 기부" />
      </Helmet>

      <DonationContent>
        <DonationHeader>
          <h1 data-i18n="donation.header.title">기부하기</h1>
          <p data-i18n="donation.header.description">
            CoinNexus 플랫폼의 지속적인 발전과 서비스 개선을 위해 기부해주세요
          </p>
        </DonationHeader>

        <StatsSection>
          <SectionTitle iconBg="var(--gradient-primary)">
            <div className="icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            기부 통계
          </SectionTitle>
          <StatsGrid>
            <StatCard>
              <div className="stat-value">{statsData?.totalDonations || 0}</div>
              <div className="stat-label" data-i18n="donation.stats.total">총 기부 건수</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">
                {statsData?.totalAmount ? `$${statsData.totalAmount.toLocaleString()}` : '$0'}
              </div>
              <div className="stat-label" data-i18n="donation.stats.amount">총 기부 금액</div>
            </StatCard>
            <StatCard>
              <div className="stat-value">
                {statsData?.byCurrency?.length || 0}
              </div>
              <div className="stat-label" data-i18n="donation.stats.currencies">지원 통화</div>
            </StatCard>
          </StatsGrid>
        </StatsSection>

        <DonationGrid>
          <WalletSection>
            <SectionTitle iconBg="var(--gradient-primary)">
              <div className="icon">
                <i className="fas fa-wallet"></i>
              </div>
              지갑 주소
            </SectionTitle>
            
            {currencies.map(currency => (
              <WalletCard key={currency.key}>
                <WalletHeader>
                  <div className="currency-info">
                    <div 
                      className="currency-icon"
                      style={{ background: getCurrencyColor(currency.key) }}
                    >
                      <i className={getCurrencyIcon(currency.key)}></i>
                    </div>
                    <div className="currency-name">{currency.name}</div>
                  </div>
                </WalletHeader>
                
                <QRCodeContainer>
                  <QRCodeSVG
                    value={walletData?.addresses?.[currency.key] || ''}
                    size={150}
                    level="M"
                    includeMargin={true}
                  />
                </QRCodeContainer>
                
                <AddressContainer>
                  <div className="address-label" data-i18n="donation.address.label">
                    {currency.name} 주소
                  </div>
                  <div className="address-value">
                    {walletData?.addresses?.[currency.key] || '주소를 불러오는 중...'}
                  </div>
                </AddressContainer>
                
                <CopyButton
                  onClick={() => copyToClipboard(
                    walletData?.addresses?.[currency.key], 
                    currency.key
                  )}
                >
                  {copiedAddress === currency.key ? (
                    <>
                      <i className="fas fa-check"></i>
                      복사됨!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i>
                      주소 복사
                    </>
                  )}
                </CopyButton>
              </WalletCard>
            ))}
          </WalletSection>

          <RecentDonations>
            <SectionTitle iconBg="var(--gradient-secondary)">
              <div className="icon">
                <i className="fas fa-heart"></i>
              </div>
              최근 기부
            </SectionTitle>
            
            {recentDonations?.donations?.length > 0 ? (
              recentDonations.donations.map((donation, index) => (
                <motion.div
                  key={donation._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DonationItem>
                    <DonorInfo>
                      <div className="donor-avatar">
                        {donation.isAnonymous ? '?' : 
                         donation.donor?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="donor-name">
                        {donation.isAnonymous ? '익명' : 
                         donation.donor?.username || '사용자'}
                      </div>
                    </DonorInfo>
                    <DonationAmount>
                      <div className="amount">{donation.amount}</div>
                      <div className="currency">{donation.currency}</div>
                    </DonationAmount>
                  </DonationItem>
                </motion.div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                padding: 'var(--spacing-xl)' 
              }}>
                <i className="fas fa-heart" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}></i>
                <p data-i18n="donation.empty">아직 기부가 없습니다</p>
              </div>
            )}
          </RecentDonations>
        </DonationGrid>
      </DonationContent>
    </DonationContainer>
  );
}

export default Donation;
