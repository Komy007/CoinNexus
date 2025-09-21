import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-2xl);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
  
  @media (max-width: 768px) {
    padding: var(--spacing-xl) var(--spacing-sm);
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const FooterSection = styled.div`
  h3 {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-md);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--accent-primary);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--accent-primary);
    color: var(--bg-primary);
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--text-muted);
  font-size: var(--font-size-sm);
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    gap: var(--spacing-md);
  }
`;

const FooterBottomLink = styled(Link)`
  color: var(--text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--accent-primary);
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3 data-i18n="footer.about.title">CoinNexus 소개</h3>
            <p data-i18n="footer.about.description">
              암호화폐 선물 거래에 특화된 정보 및 커뮤니티 플랫폼입니다. 
              실시간 데이터, 교육 콘텐츠, 그리고 상호 교류의 장을 제공하여 
              신뢰할 수 있는 인사이트 허브가 되는 것을 목표로 합니다.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="Telegram">
                <i className="fab fa-telegram"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="Discord">
                <i className="fab fa-discord"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3 data-i18n="footer.services.title">서비스</h3>
            <FooterLinks>
              <FooterLink to="/dashboard" data-i18n="footer.services.dashboard">실시간 대시보드</FooterLink>
              <FooterLink to="/community" data-i18n="footer.services.community">커뮤니티</FooterLink>
              <FooterLink to="/donation" data-i18n="footer.services.donation">기부 시스템</FooterLink>
              <FooterLink to="/hall-of-fame" data-i18n="footer.services.hallOfFame">명예의 전당</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3 data-i18n="footer.support.title">지원</h3>
            <FooterLinks>
              <FooterLink to="/help" data-i18n="footer.support.help">도움말</FooterLink>
              <FooterLink to="/faq" data-i18n="footer.support.faq">자주 묻는 질문</FooterLink>
              <FooterLink to="/contact" data-i18n="footer.support.contact">문의하기</FooterLink>
              <FooterLink to="/bug-report" data-i18n="footer.support.bugReport">버그 신고</FooterLink>
              <FooterLink to="/simple-admin" style={{color: '#00d4aa', fontWeight: 600}}>🔐 관리자</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <h3 data-i18n="footer.legal.title">법적 고지</h3>
            <FooterLinks>
              <FooterLink to="/terms" data-i18n="footer.legal.terms">이용약관</FooterLink>
              <FooterLink to="/privacy" data-i18n="footer.legal.privacy">개인정보처리방침</FooterLink>
              <FooterLink to="/disclaimer" data-i18n="footer.legal.disclaimer">면책조항</FooterLink>
              <FooterLink to="/cookies" data-i18n="footer.legal.cookies">쿠키 정책</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <Copyright data-i18n="footer.copyright">
            © 2024 CoinNexus. 모든 권리 보유.
          </Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/sitemap" data-i18n="footer.sitemap">사이트맵</FooterBottomLink>
            <FooterBottomLink to="/rss" data-i18n="footer.rss">RSS</FooterBottomLink>
            <FooterBottomLink to="/api" data-i18n="footer.api">API</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
