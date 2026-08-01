import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useTheme } from '../context/ThemeContext';

const Analytics = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1100px',
        margin: isMobile ? '80px auto 30px' : '100px auto 30px',
        padding: isMobile ? '0 16px' : '0 20px',
      }}>
        <h1 style={{
          color: 'var(--text-primary, #1a202c)',
          fontSize: isMobile ? '28px' : '36px',
          marginBottom: '12px',
        }}>
          📊 Analytics Dashboard
        </h1>
        <p style={{
          color: 'var(--text-secondary, #718096)',
          fontSize: isMobile ? '16px' : '18px',
          marginBottom: '40px',
        }}>
          City analytics, trends, and insights – coming soon!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: isMobile ? '16px' : '24px',
        }}>
          {[
            { icon: '📈', label: 'Total Complaints', value: '1,247', color: '#48bb78' },
            { icon: '⏳', label: 'Avg Resolution Time', value: '3.2 days', color: '#ecc94b' },
            { icon: '🏆', label: 'Resolution Rate', value: '87%', color: '#48bb78' },
            { icon: '👥', label: 'Active Citizens', value: '1,892', color: '#667eea' },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card, #ffffff)',
              padding: isMobile ? '24px 16px' : '30px 20px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #e2e8f0)',
              textAlign: 'center',
              borderBottom: `4px solid ${stat.color}`,
              transition: 'transform 0.3s',
            }}>
              <div style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '8px' }}>{stat.icon}</div>
              <h3 style={{
                color: 'var(--text-primary, #1a202c)',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700',
                marginBottom: '4px',
              }}>{stat.value}</h3>
              <p style={{
                color: 'var(--text-secondary, #718096)',
                fontSize: isMobile ? '14px' : '16px',
                margin: 0,
              }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '40px',
          padding: isMobile ? '30px 20px' : '50px 40px',
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '16px',
          border: '1px solid var(--border-color, #e2e8f0)',
          textAlign: 'center',
        }}>
          <p style={{
            color: 'var(--text-secondary, #4a5568)',
            fontSize: isMobile ? '16px' : '18px',
            marginBottom: '12px',
          }}>
            📌 Full analytics with charts, heatmaps, and trend analysis
          </p>
          <p style={{
            color: 'var(--text-secondary, #718096)',
            fontSize: isMobile ? '14px' : '16px',
          }}>
            This page will display detailed city metrics, complaint categories, officer performance, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;