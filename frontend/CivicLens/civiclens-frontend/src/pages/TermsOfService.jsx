import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const TermsOfService = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #1a202c)',
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* ===== PUBLIC NAVBAR – Responsive ===== */}
      <nav style={{
        ...navbarStyles.nav,
        padding: isMobile ? '12px 20px' : '16px 40px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{
            ...navbarStyles.navLogo,
            fontSize: isMobile ? '20px' : '24px',
          }}>
            <span style={{ ...navbarStyles.logoIcon, fontSize: isMobile ? '24px' : '28px' }}>🏙️</span>
            <span style={navbarStyles.logoText}>CivicLens</span>
          </div>
        </Link>
        <div style={{
          ...navbarStyles.navLinks,
          gap: isMobile ? '12px' : '25px',
        }}>
          <button onClick={toggleTheme} style={{
            ...navbarStyles.themeBtn,
            fontSize: isMobile ? '20px' : '24px',
          }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/login">
            <button style={{
              ...navbarStyles.navBtn,
              padding: isMobile ? '6px 14px' : '8px 20px',
              fontSize: isMobile ? '13px' : '15px',
            }}>
              Login
            </button>
          </Link>
          <Link to="/register">
            <button style={{
              ...navbarStyles.navBtn,
              ...navbarStyles.navBtnPrimary,
              padding: isMobile ? '6px 14px' : '8px 20px',
              fontSize: isMobile ? '13px' : '15px',
            }}>
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* ===== PAGE CONTENT ===== */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '80px 16px 30px' : '100px 20px 40px',
      }}>
        <h1 style={{
          color: 'var(--text-primary, #1a202c)',
          marginBottom: '16px',
          fontSize: isMobile ? '28px' : '36px',
        }}>Terms of Service</h1>
        <p style={{
          color: 'var(--text-secondary, #4a5568)',
          marginBottom: '30px',
          fontSize: isMobile ? '14px' : '16px',
        }}>Last updated: July 2026</p>
        
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>1. Acceptance of Terms</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            By using CivicLens, you agree to these terms. If you do not agree, please do not use our platform.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>2. User Responsibilities</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            You are responsible for providing accurate information when reporting issues. Do not upload inappropriate content or false information.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>3. Intellectual Property</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            All content on CivicLens is protected by copyright. You may not reproduce or distribute our content without permission.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>4. Limitation of Liability</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            CivicLens is provided "as is" without warranties. We are not liable for damages arising from using our platform.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>5. Termination</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          textAlign: 'center',
        }}>
          <Link to="/" style={{
            color: '#48bb78',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// ===== NAVBAR STYLES =====
const navbarStyles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'var(--bg-secondary, #ffffff)',
    boxShadow: '0 1px 20px rgba(0,0,0,0.04)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--border-color, #e2e8f0)',
    transition: 'background 0.3s, border-color 0.3s',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '24px',
    fontWeight: '700',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  themeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    width: 'auto',
    padding: '4px 8px',
    transition: 'transform 0.2s',
  },
  navBtn: {
    padding: '8px 20px',
    background: 'transparent',
    border: '2px solid #48bb78',
    borderRadius: '8px',
    color: '#48bb78',
    fontWeight: '600',
    cursor: 'pointer',
    width: 'auto',
    transition: 'all 0.3s',
  },
  navBtnPrimary: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    border: 'none',
  },
};

export default TermsOfService;