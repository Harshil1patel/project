import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: isMobile ? '20px' : '40px',
        textAlign: 'center',
        background: 'var(--bg-primary, #f7fafc)',
        color: 'var(--text-primary, #1a202c)',
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'var(--bg-card, #ffffff)',
        borderRadius: '24px',
        padding: isMobile ? '40px 24px' : '60px 48px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        border: '1px solid var(--border-color, #e2e8f0)',
        transition: 'background 0.3s, border 0.3s',
      }}>
        <div style={{ fontSize: isMobile ? '72px' : '96px', marginBottom: '16px' }}>🚫</div>
        <h1 style={{
          fontSize: isMobile ? '28px' : '40px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: 'var(--text-primary, #1a202c)',
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '600',
          margin: '0 0 12px 0',
          color: 'var(--text-primary, #1a202c)',
        }}>
          Page Not Found
        </h2>
        <p style={{
          fontSize: isMobile ? '15px' : '18px',
          color: 'var(--text-secondary, #4a5568)',
          margin: '0 0 28px 0',
          lineHeight: '1.6',
        }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: isMobile ? '12px 32px' : '14px 40px',
            background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(72,187,120,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(72,187,120,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(72,187,120,0.3)';
          }}
        >
          🏠 Go Home
        </button>
      </div>
    </motion.div>
  );
};

export default NotFound;