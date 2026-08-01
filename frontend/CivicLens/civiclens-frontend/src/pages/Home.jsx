import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// ===== ANIMATIONS =====
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [faqOpen, setFaqOpen] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div style={styles.rootContainer}>
      {/* ===== NAVBAR (Responsive) ===== */}
      <nav style={{ ...styles.nav, background: theme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(26,32,44,0.92)' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.navLogo}>
            <span style={styles.logoIcon}>🏙️</span>
            <span style={styles.logoText}>CivicLens</span>
          </div>
        </Link>

        {/* Hamburger Icon for mobile */}
        <button onClick={toggleMobileMenu} style={styles.hamburgerBtn}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>

        {/* Desktop nav links */}
        <div style={{
          ...styles.navLinks,
          display: isMobile ? (isMobileMenuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          position: isMobile ? 'absolute' : 'static',
          top: isMobile ? '70px' : 'auto',
          left: isMobile ? '0' : 'auto',
          right: isMobile ? '0' : 'auto',
          background: isMobile ? (theme === 'light' ? 'rgba(255,255,255,0.98)' : 'rgba(26,32,44,0.98)') : 'transparent',
          padding: isMobile ? '20px' : '0',
          borderRadius: isMobile ? '0 0 20px 20px' : '0',
          boxShadow: isMobile ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
          gap: isMobile ? '12px' : '20px',
          alignItems: isMobile ? 'center' : 'center',
          borderBottom: isMobile ? '2px solid var(--border-color)' : 'none',
        }}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#how-it-works" style={styles.navLink}>How It Works</a>
          <a href="#help" style={styles.navLink}>Help</a>
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/login">
            <button style={{ ...styles.navBtn, ...styles.navBtnOutline }}>Sign In</button>
          </Link>
          <Link to="/register">
            <button style={{ ...styles.navBtn, ...styles.navBtnPrimary }}>Get Started</button>
          </Link>
        </div>
      </nav>

      {/* ===== HERO (Responsive) ===== */}
      <section id="home" style={styles.hero}>
        <div style={{
          ...styles.heroOverlay,
          background: theme === 'light'
            ? 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.65) 100%)'
            : 'linear-gradient(135deg, rgba(26,32,44,0.80) 0%, rgba(26,32,44,0.70) 100%)',
        }} />
        <div style={{
          ...styles.heroContent,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? '40px' : '60px',
          padding: isMobile ? '100px 20px 40px' : '100px 40px 60px',
        }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={{
              ...styles.heroLeft,
              maxWidth: isMobile ? '100%' : '550px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            <motion.h1
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{
                ...styles.heroTitle,
                fontSize: isMobile ? '28px' : '52px',
              }}
            >
              Make Your City
              <br />
              <span style={styles.heroHighlight}>Better, Together</span>
            </motion.h1>
            <p style={{
              ...styles.heroDesc,
              maxWidth: isMobile ? '100%' : '480px',
              marginLeft: isMobile ? 'auto' : '0',
              marginRight: isMobile ? 'auto' : '0',
              fontSize: isMobile ? '15px' : '18px',
            }}>
              Report civic issues, track progress, and celebrate solutions – all in one smart platform.
            </p>
            <div style={{
              ...styles.heroButtons,
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '12px' : '14px',
            }}>
              <Link to="/register" style={{ width: isMobile ? '100%' : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(72,187,120,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...styles.heroBtn,
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '12px 20px' : '14px 36px',
                    fontSize: isMobile ? '15px' : '17px',
                  }}
                >
                  Start Reporting →
                </motion.button>
              </Link>
              <Link to="/login" style={{ width: isMobile ? '100%' : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...styles.heroBtn,
                    ...styles.heroBtnOutline,
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '12px 20px' : '14px 36px',
                    fontSize: isMobile ? '15px' : '17px',
                  }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
            <div style={{
              ...styles.trustBadges,
              justifyContent: isMobile ? 'center' : 'flex-start',
              gap: isMobile ? '15px' : '25px',
            }}>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>⏱️</span>
                <span style={styles.badgeText}>2 min report</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>🏆</span>
                <span style={styles.badgeText}>100+ resolved</span>
              </div>
              <div style={styles.badge}>
                <span style={styles.badgeIcon}>😊</span>
                <span style={styles.badgeText}>Happy Citizens</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            style={{
              ...styles.heroRight,
              justifyContent: isMobile ? 'center' : 'flex-end',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <div style={{
              ...styles.gridCards,
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr',
              maxWidth: isMobile ? '100%' : '460px',
              gap: isMobile ? '12px' : '18px',
            }}>
              {[
                { icon: '📸', label: 'Snap & Report', desc: 'Upload photo in seconds' },
                { icon: '🤖', label: 'AI Auto-Tag', desc: 'Smart category detection' },
                { icon: '📍', label: 'Live Map', desc: 'Track complaints visually' },
                { icon: '📊', label: 'City Analytics', desc: 'See trends & insights' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.gridCard,
                    padding: isMobile ? '14px 10px' : '18px 14px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(72,187,120,0.15)';
                    e.currentTarget.style.borderColor = '#48bb78';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'var(--border-color, #e2e8f0)';
                  }}
                >
                  <div style={{ ...styles.gridCardIcon, fontSize: isMobile ? '26px' : '32px' }}>{item.icon}</div>
                  <h4 style={{ ...styles.gridCardTitle, fontSize: isMobile ? '13px' : '15px' }}>{item.label}</h4>
                  <p style={{ ...styles.gridCardDesc, fontSize: isMobile ? '10px' : '12px' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT – FULL WIDTH (Responsive) ===== */}
      <section id="about" style={{ ...styles.section, background: 'var(--bg-primary)' }}>
        <div style={styles.innerContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : '36px' }}>About CivicLens</h2>
            <p style={{ ...styles.sectionSubtitle, fontSize: isMobile ? '14px' : '18px' }}>Empowering citizens, connecting with authorities, building smarter cities.</p>
            <div style={styles.divider} />
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{
              ...styles.featuresGrid,
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: isMobile ? '16px' : '30px',
            }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                style={{
                  ...styles.featureCard,
                  padding: isMobile ? '20px 14px' : '30px 20px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(72,187,120,0.15)';
                  e.currentTarget.style.borderColor = '#48bb78';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                  e.currentTarget.style.borderColor = 'var(--border-color, #e2e8f0)';
                }}
              >
                <div style={{ ...styles.featureIcon, fontSize: isMobile ? '30px' : '40px' }}>{feature.icon}</div>
                <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '16px' : '20px' }}>{feature.title}</h3>
                <p style={{ ...styles.featureDesc, fontSize: isMobile ? '13px' : '16px' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS – FULL WIDTH GREY (Responsive) ===== */}
      <section id="how-it-works" style={{ ...styles.section, ...styles.greyBg }}>
        <div style={styles.innerContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : '36px' }}>How It Works</h2>
            <p style={{ ...styles.sectionSubtitle, fontSize: isMobile ? '14px' : '18px' }}>Three simple steps to report and resolve civic issues in your city.</p>
            <div style={styles.divider} />
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{
              ...styles.stepsContainer,
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: isMobile ? '16px' : '30px',
            }}
          >
            <motion.div variants={fadeInUp} style={{ ...styles.step, padding: isMobile ? '24px 16px' : '30px 20px' }}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '17px' : '18px' }}>📝 Report Issue</h3>
              <p style={{ ...styles.stepDesc, fontSize: isMobile ? '13px' : '16px' }}>Upload a photo, select category, add description, and share your location.</p>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ ...styles.step, padding: isMobile ? '24px 16px' : '30px 20px' }}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '17px' : '18px' }}>👮 Authority Response</h3>
              <p style={{ ...styles.stepDesc, fontSize: isMobile ? '13px' : '16px' }}>Complaints are verified, assigned to officers, and action is taken.</p>
            </motion.div>
            <motion.div variants={fadeInUp} style={{ ...styles.step, padding: isMobile ? '24px 16px' : '30px 20px' }}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '17px' : '18px' }}>✅ Track Progress</h3>
              <p style={{ ...styles.stepDesc, fontSize: isMobile ? '13px' : '16px' }}>Monitor your complaint's journey until it is resolved successfully.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ – FULL WIDTH GREY (Responsive) ===== */}
      <section id="help" style={{ ...styles.section, ...styles.greyBg }}>
        <div style={styles.innerContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : '36px' }}>Frequently Asked Questions</h2>
            <p style={{ ...styles.sectionSubtitle, fontSize: isMobile ? '14px' : '18px' }}>Find quick answers to common questions about CivicLens.</p>
            <div style={styles.divider} />
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={styles.faqContainer}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp} style={styles.faqItem}>
                <div style={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                  <span style={{ ...styles.faqQuestionText, fontSize: isMobile ? '14px' : '16px' }}>{faq.question}</span>
                  <span style={styles.faqIcon}>{faqOpen === index ? '−' : '+'}</span>
                </div>
                <div style={{ ...styles.faqAnswer, maxHeight: faqOpen === index ? '200px' : '0' }}>
                  <p style={{ ...styles.faqAnswerText, fontSize: isMobile ? '14px' : '16px' }}>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER (Responsive) ===== */}
      <footer style={styles.footer}>
        <div style={{
          ...styles.footerContent,
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: isMobile ? '24px' : '40px',
        }}>
          <div style={styles.footerCol}>
            <h3 style={{ ...styles.footerHeading, fontSize: isMobile ? '16px' : '18px' }}>🏙️ CivicLens</h3>
            <p style={{ ...styles.footerText, fontSize: isMobile ? '13px' : '14px' }}>Empowering citizens to report and track civic issues in real-time.</p>
          </div>
          <div style={styles.footerCol}>
            <h4 style={{ ...styles.footerHeading, fontSize: isMobile ? '14px' : '16px' }}>Quick Links</h4>
            <a href="#home" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>Home</a>
            <a href="#about" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>About</a>
          </div>
          <div style={styles.footerCol}>
            <h4 style={{ ...styles.footerHeading, fontSize: isMobile ? '14px' : '16px' }}>Condition</h4>
            <Link to="/privacy" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>Terms of Service</Link>
          </div>
          <div style={styles.footerCol}>
            <h4 style={{ ...styles.footerHeading, fontSize: isMobile ? '14px' : '16px' }}>Connect</h4>
            <a href="mailto:support@civiclens.com" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>📧 support@civiclens.com</a>
            <a href="tel:+919876543210" style={{ ...styles.footerLink, fontSize: isMobile ? '13px' : '14px' }}>📞 +91 98765 43210</a>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={{ ...styles.footerBottomText, fontSize: isMobile ? '12px' : '14px' }}>© 2026 CivicLens. All rights reserved. Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
};

// ===== DATA (unchanged) =====
const features = [
  { icon: '📱', title: 'Easy Reporting', desc: 'Report issues in seconds with photos, GPS location, and category selection.' },
  { icon: '📊', title: 'Real-time Tracking', desc: 'Track your complaints from submission to resolution with live status updates.' },
  { icon: '👮', title: 'Officer Assignment', desc: 'Issues are assigned to the right authorities for faster resolution.' },
  { icon: '📈', title: 'Analytics Dashboard', desc: 'Admin dashboards with charts and reports for better city management.' },
  { icon: '🤖', title: 'AI Classification', desc: 'AI automatically categorizes issues for faster processing and routing.' },
  { icon: '💬', title: 'Community Comments', desc: 'Citizens can comment, upvote, and engage on active complaints.' },
];

const faqs = [
  { question: 'What types of issues can I report?', answer: 'You can report potholes, garbage dumping, water leakage, street light failures, fallen trees, traffic signal damage, sewage problems, and more.' },
  { question: 'How do I track my complaint status?', answer: 'After logging in, go to the "Track" section. Click on any complaint card to view its current status and detailed timeline.' },
  { question: 'Who resolves the complaints?', answer: 'Complaints are assigned to relevant authorities and officers based on the category.' },
  { question: 'Is my location data secure?', answer: 'Yes! Your location data is used only for mapping complaints. We do not share your personal information.' },
  { question: 'Can I add images to my complaint?', answer: 'Absolutely! When reporting an issue, you can upload photos to help authorities understand the problem better.' },
];

// ===== STYLES (unchanged – all responsive logic is conditional) =====
const styles = {
  rootContainer: {
    width: '100%',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    color: 'var(--text-primary, #1a202c)',
    overflowX: 'hidden',
    background: 'var(--bg-primary, #ffffff)',
    transition: 'background 0.3s, color 0.3s',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 40px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.04))',
    transition: 'background 0.3s, border-color 0.3s',
  },
  hamburgerBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    width: 'auto',
    padding: '4px',
    display: 'none', // hidden on desktop, shown via media query override in conditional
    color: 'var(--text-primary)',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '22px',
    fontWeight: '700',
  },
  logoIcon: { fontSize: '26px' },
  logoText: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    color: 'var(--text-secondary, #4a5568)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'color 0.3s',
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
  navBtn: {
    padding: '8px 22px',
    borderRadius: '30px',
    fontWeight: '600',
    cursor: 'pointer',
    width: 'auto',
    fontSize: '14px',
    transition: 'all 0.3s',
    border: 'none',
  },
  navBtnOutline: {
    background: 'transparent',
    border: '2px solid #48bb78',
    color: '#48bb78',
  },
  navBtnPrimary: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    backgroundImage: 'url("https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    padding: '0',
    margin: '0',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    transition: 'background 0.3s ease',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '60px',
    padding: '100px 40px 60px',
  },
  heroLeft: {
    flex: '0 1 50%',
    maxWidth: '550px',
    textAlign: 'left',
  },
  heroRight: {
    flex: '0 1 50%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '16px',
  },
  heroHighlight: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDesc: {
    fontSize: '18px',
    color: 'var(--text-secondary, #4a5568)',
    lineHeight: '1.7',
    marginBottom: '28px',
    maxWidth: '480px',
  },
  heroButtons: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '28px',
  },
  heroBtn: {
    padding: '14px 36px',
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    fontSize: '17px',
    fontWeight: '600',
    cursor: 'pointer',
    width: 'auto',
    boxShadow: '0 4px 20px rgba(72,187,120,0.3)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  heroBtnOutline: {
    background: 'transparent',
    border: '2px solid #48bb78',
    color: '#48bb78',
    boxShadow: 'none',
  },
  trustBadges: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary, #4a5568)',
  },
  badgeIcon: { fontSize: '18px' },
  badgeText: { fontWeight: '600' },
  gridCards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
    width: '100%',
    maxWidth: '460px',
  },
  gridCard: {
    background: 'var(--bg-card, #ffffff)',
    padding: '18px 14px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    border: '1px solid var(--border-color, #e2e8f0)',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    transform: 'translateY(0)',
  },
  gridCardIcon: { fontSize: '32px', marginBottom: '6px' },
  gridCardTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary, #1a202c)',
  },
  gridCardDesc: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary, #4a5568)',
  },
  section: {
    width: '100%',
    padding: '80px 0',
    transition: 'background 0.3s',
  },
  greyBg: {
    background: 'var(--bg-secondary, #f7fafc)',
    transition: 'background 0.3s',
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '8px',
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary, #4a5568)',
  },
  divider: {
    width: '60px',
    height: '4px',
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    borderRadius: '2px',
    margin: '15px auto 0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '30px',
  },
  featureCard: {
    background: 'var(--bg-card, white)',
    padding: '30px 20px',
    borderRadius: '20px',
    boxShadow: 'var(--shadow)',
    textAlign: 'center',
    border: '1px solid var(--border-color, #e2e8f0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    transform: 'translateY(0)',
  },
  featureIcon: { fontSize: '40px', marginBottom: '15px' },
  featureTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '8px',
  },
  featureDesc: {
    color: 'var(--text-secondary, #4a5568)',
    lineHeight: '1.6',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '30px',
  },
  step: {
    textAlign: 'center',
    padding: '30px 20px',
    background: 'var(--bg-card, white)',
    borderRadius: '20px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border-color, #e2e8f0)',
    transition: 'all 0.3s',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    borderRadius: '50%',
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '8px',
  },
  stepDesc: {
    color: 'var(--text-secondary, #4a5568)',
    lineHeight: '1.6',
  },
  faqContainer: { maxWidth: '800px', margin: '0 auto' },
  faqItem: {
    background: 'var(--bg-card, white)',
    borderRadius: '16px',
    marginBottom: '12px',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden',
    border: '1px solid var(--border-color, #e2e8f0)',
    transition: 'all 0.3s',
  },
  faqQuestion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    cursor: 'pointer',
  },
  faqQuestionText: {
    fontWeight: '600',
    fontSize: '16px',
    color: 'var(--text-primary, #1a202c)',
  },
  faqIcon: {
    fontSize: '24px',
    color: '#48bb78',
    fontWeight: '300',
  },
  faqAnswer: {
    overflow: 'hidden',
    transition: 'max-height 0.4s ease-in-out',
    padding: '0 24px',
  },
  faqAnswerText: {
    paddingBottom: '18px',
    color: 'var(--text-secondary, #4a5568)',
    lineHeight: '1.6',
  },
  footer: {
    background: '#1a202c',
    color: '#cbd5e0',
    padding: '50px 40px 20px',
    marginTop: '60px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '40px',
  },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '8px' },
  footerHeading: { color: 'white', fontSize: '18px', marginBottom: '4px' },
  footerText: { color: '#a0aec0', fontSize: '14px', lineHeight: '1.6' },
  footerLink: {
    color: '#a0aec0',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '30px auto 0',
    paddingTop: '20px',
    borderTop: '1px solid #2d3748',
    textAlign: 'center',
  },
  footerBottomText: { fontSize: '14px', color: '#718096' },
};

export default Home;