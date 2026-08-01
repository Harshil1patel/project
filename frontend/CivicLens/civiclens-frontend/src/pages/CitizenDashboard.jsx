import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from "../api/backend";
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';

const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Fetch complaints on mount – fresh data every time you visit
 const fetchComplaints = async () => {

    try {

        const currentUser = JSON.parse(
            localStorage.getItem("civiclens_current_user")
        );

        if (!currentUser) {
            setLoading(false);
            return;
        }

        setUser(currentUser);

        const token = localStorage.getItem("token");

        const response = await API.get("/complaints", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userComplaints = response.data;

        setMyComplaints(userComplaints);

        const total = userComplaints.length;

        const pending = userComplaints.filter(
            c => c.status !== "Resolved"
        ).length;

        const resolved = userComplaints.filter(
            c => c.status === "Resolved"
        ).length;

        setStats({
            total,
            pending,
            resolved
        });

    } catch (err) {

        console.error(err);

    } finally {

        setLoading(false);

    }

};

  useEffect(() => {
    fetchComplaints();
  }, []); // ✅ Runs on mount – fresh data every time

  if (!user && !loading) { // ✅ Check loading before showing "Please login"
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-primary)' }}>
          Please login to view your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{
        ...styles.container,
        padding: isMobile ? '80px 16px 30px' : '90px 24px 30px',
      }}>
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.headerSection}
        >
          <h2 style={{
            ...styles.title,
            fontSize: isMobile ? '24px' : '2.2rem',
          }}>
            👋 Welcome back, {user?.name || 'User'}!
          </h2>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '14px' : '16px',
          }}>
            Track your civic complaints easily
          </p>
        </motion.div>

        {/* ===== STATS CARDS ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            ...styles.statsGrid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: isMobile ? '12px' : '20px',
          }}
        >
          {[
            { label: '📋 Total Complaints', value: stats.total, color: '#48bb78' },
            { label: '⏳ Pending', value: stats.pending, color: '#ecc94b' },
            { label: '✅ Resolved', value: stats.resolved, color: '#48bb78' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04, y: -4 }}
              style={{
                ...styles.card,
                borderBottom: `4px solid ${stat.color}`,
                padding: isMobile ? '16px 12px' : '22px 16px',
              }}
            >
              <h3 style={{
                ...styles.cardLabel,
                fontSize: isMobile ? '13px' : '14px',
              }}>
                {stat.label}
              </h3>
              <p style={{
                ...styles.number,
                fontSize: isMobile ? '28px' : '36px',
              }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== QUICK ACTION BUTTON ===== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={styles.actionSection}
        >
          <Link to="/report-issue">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(72,187,120,0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.reportBtn,
                padding: isMobile ? '12px 28px' : '14px 40px',
                fontSize: isMobile ? '15px' : '16px',
              }}
            >
              ➕ Report New Issue
            </motion.button>
          </Link>
        </motion.div>

        {/* ===== RECENT COMPLAINTS ===== */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            ...styles.sectionTitle,
            fontSize: isMobile ? '18px' : '20px',
          }}
        >
          📌 Your Recent Complaints
        </motion.h3>

        {myComplaints.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              ...styles.empty,
              padding: isMobile ? '30px 16px' : '40px 20px',
              fontSize: isMobile ? '14px' : '16px',
            }}
          >
            You haven't reported any issues yet.<br />
            Click <strong>"Report New Issue"</strong> to start!
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              ...styles.tableWrapper,
              padding: isMobile ? '12px' : '20px',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                ...styles.table,
                fontSize: isMobile ? '13px' : '14px',
              }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, fontSize: isMobile ? '12px' : '13px' }}>Title</th>
                    <th style={{ ...styles.th, fontSize: isMobile ? '12px' : '13px' }}>Status</th>
                    <th style={{ ...styles.th, fontSize: isMobile ? '12px' : '13px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myComplaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint.id}>
                      <td style={{ ...styles.td, fontSize: isMobile ? '12px' : '14px' }}>
                        {complaint.title}
                      </td>
                      <td>
                        <span style={{
                          ...styles.statusBadge,
                          background: complaint.status === 'Resolved' ? '#c6f6d5' : '#fefcbf',
                          color: complaint.status === 'Resolved' ? '#276749' : '#975a16',
                          fontSize: isMobile ? '11px' : '13px',
                          padding: isMobile ? '3px 10px' : '4px 14px',
                        }}>
                          {complaint.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontSize: isMobile ? '12px' : '14px' }}>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {myComplaints.length > 5 && (
              <p style={{
                ...styles.viewAll,
                fontSize: isMobile ? '13px' : '14px',
              }}>
                + {myComplaints.length - 5} more complaints...
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ===== STYLES – Clean, responsive (unchanged) =====
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '90px 24px 30px',
  },
  headerSection: {
    marginBottom: '32px',
    paddingBottom: '12px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary, #718096)',
    marginBottom: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '20px',
    marginBottom: '36px',
  },
  card: {
    background: 'var(--bg-card, #ffffff)',
    padding: '22px 16px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '1px solid var(--border-color, #e2e8f0)',
  },
  cardLabel: {
    color: 'var(--text-secondary, #64748b)',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
  },
  number: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--text-primary, #1a202c)',
    margin: 0,
  },
  actionSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  reportBtn: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    padding: '14px 40px',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(72, 187, 120, 0.35)',
    transition: 'all 0.3s ease',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '14px',
  },
  tableWrapper: {
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    overflowX: 'auto',
    border: '1px solid var(--border-color, #e2e8f0)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 14px',
    textAlign: 'left',
    color: 'var(--text-secondary, #64748b)',
    fontWeight: '600',
    fontSize: '13px',
    borderBottom: '2px solid var(--border-color, #e2e8f0)',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid var(--border-color, #e2e8f0)',
    color: 'var(--text-primary, #1a202c)',
    fontSize: '14px',
  },
  statusBadge: {
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'inline-block',
  },
  empty: {
    color: 'var(--text-secondary, #718096)',
    padding: '40px 20px',
    textAlign: 'center',
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '16px',
    border: '1px solid var(--border-color, #e2e8f0)',
    lineHeight: '1.8',
  },
  viewAll: {
    marginTop: '12px',
    color: '#48bb78',
    fontSize: '14px',
    textAlign: 'right',
    fontWeight: '500',
  },
};

export default CitizenDashboard;