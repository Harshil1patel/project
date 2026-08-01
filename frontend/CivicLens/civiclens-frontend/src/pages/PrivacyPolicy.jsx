import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicy = () => {
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
        }}>Privacy Policy</h1>
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
          }}>1. Information We Collect</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            We collect information you provide directly, such as your name, email address, phone number, and location data when you report issues. We also collect usage data to improve our services.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>2. How We Use Your Information</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            We use your information to process complaints, track resolutions, communicate with you, and improve our platform. Your data helps authorities respond to civic issues effectively.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>3. Data Security</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            We implement appropriate technical measures to protect your personal data. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>4. Third-Party Sharing</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            We do not sell your data. We may share necessary information with government authorities to resolve your reported issues.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: 'var(--text-primary, #1a202c)',
            marginBottom: '10px',
            fontSize: isMobile ? '20px' : '24px',
          }}>5. Your Rights</h2>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            lineHeight: '1.8',
            fontSize: isMobile ? '15px' : '17px',
          }}>
            You have the right to access, update, or delete your personal data at any time through your profile settings.
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

export default PrivacyPolicy;