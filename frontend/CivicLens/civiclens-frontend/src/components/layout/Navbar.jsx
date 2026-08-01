import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('civiclens_current_user'));
  const { theme, toggleTheme } = useTheme();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close the mobile menu on route change (link tap)
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('civiclens_current_user');
    // ===== CLEAR REPORT FORM SESSION DATA =====
    sessionStorage.removeItem('reportFormData');
    sessionStorage.removeItem('reportImage');
    sessionStorage.removeItem('reportImagePreview');
    sessionStorage.removeItem('reportUserId');
    // =========================================
    closeMenu();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      ...styles.nav,
      padding: isMobile ? '12px 16px' : '12px 40px',
    }}>
      <div style={styles.topRow}>
        <Link to="/" style={styles.link} onClick={closeMenu}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏙️</span>
            <span style={styles.logoText}>CivicLens</span>
          </div>
        </Link>

        {/* Hamburger — mobile only */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.hamburgerBtn}
            aria-label="Toggle menu"
          >
            <span style={{ fontSize: '26px', lineHeight: 1 }}>{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        )}

        {/* Desktop links — hidden on mobile */}
        {!isMobile && (
          <div style={styles.links}>
            <NavLinks user={user} styles={styles} onClick={closeMenu} />
            <span style={styles.userBadge}>👋 {user.name}</span>
            <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </div>

      {/* Mobile dropdown drawer */}
      {isMobile && (
        <div
          style={{
            ...styles.mobileMenu,
            maxHeight: isMenuOpen ? '500px' : '0px',
            opacity: isMenuOpen ? 1 : 0,
            padding: isMenuOpen ? '16px 4px 4px' : '0 4px',
          }}
        >
          <div style={styles.mobileLinksCol}>
            <NavLinks user={user} styles={styles} mobile onClick={closeMenu} />
          </div>

          <div style={styles.mobileFooterRow}>
            <span style={styles.userBadge}>👋 {user.name}</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button onClick={handleLogout} style={styles.logoutBtnMobile}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// ===== Shared link list (desktop row / mobile column) =====
const NavLinks = ({ user, styles, mobile, onClick }) => (
  <>
    {user.role === 'citizen' && (
      <>
        <Link to="/citizen-dashboard" style={mobile ? styles.mobileLink : styles.link} onClick={onClick}>Dashboard</Link>
        <Link to="/report-issue" style={mobile ? styles.mobileLink : styles.link} onClick={onClick}>Report Issue</Link>
        <Link to="/track-complaint" style={mobile ? styles.mobileLink : styles.link} onClick={onClick}>Track</Link>
      </>
    )}
    {user.role === 'officer' && (
      <Link to="/officer-dashboard" style={mobile ? styles.mobileLink : styles.link} onClick={onClick}>Assigned</Link>
    )}
    <Link to="/profile" style={mobile ? styles.mobileLink : styles.link} onClick={onClick}>Profile</Link>
  </>
);

// ===== STYLES =====
const styles = {
  nav: {
    background: 'var(--bg-secondary, #ffffff)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    transition: 'background 0.3s',
    width: '100%',
    boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: { fontSize: '26px' },
  logoText: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  link: {
    textDecoration: 'none',
    color: 'var(--text-primary, #2d3748)',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  userBadge: {
    background: 'var(--badge-bg, #f0fff4)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    color: 'var(--text-primary, #2d3748)',
    border: '1px solid var(--border-color, #c6f6d5)',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
  },
  themeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    width: 'auto',
    padding: '4px 8px',
    transition: 'transform 0.2s',
  },
  logoutBtn: {
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    width: 'auto',
    transition: 'all 0.3s',
  },
  // ===== mobile-specific =====
  hamburgerBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-primary, #2d3748)',
    padding: '4px 8px',
    width: 'auto',
  },
  mobileMenu: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.25s ease, padding 0.3s ease',
    borderTop: '1px solid var(--border-color, #e2e8f0)',
    marginTop: '10px',
  },
  mobileLinksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '14px',
  },
  mobileLink: {
    textDecoration: 'none',
    color: 'var(--text-primary, #2d3748)',
    fontWeight: '500',
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'var(--bg-input, #f7fafc)',
    fontSize: '15px',
  },
  mobileFooterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  logoutBtnMobile: {
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    width: 'auto',
    fontSize: '14px',
  },
};

export default Navbar;