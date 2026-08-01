import { useState, useEffect } from 'react';
import { getComplaints, addComment, getUserName } from '../services/api';
import Navbar from '../components/layout/Navbar';

const TrackComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('civiclens_current_user'));
    if (currentUser) {
      setUser(currentUser);
      setCurrentUser(currentUser);
      const allComplaints = getComplaints();
      const userComplaints = allComplaints.filter(c => c.userId === currentUser.id);
      userComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(userComplaints);
    }
  }, []);

  const getStatusSteps = (complaint) => {
    const statusOrder = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
    const currentIndex = statusOrder.indexOf(complaint.status);

    const steps = [
      { label: '📥 Submitted', desc: 'Your complaint has been recorded.' },
      { label: '🔍 Verified', desc: 'Authority has verified the issue.' },
      { label: '👮 Assigned', desc: 'An officer has been assigned.' },
      { label: '🛠️ In Progress', desc: 'Work is currently in progress.' },
      { label: '✅ Resolved', desc: 'Your issue has been resolved!' },
    ];

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      date: index === 0
        ? new Date(complaint.createdAt).toLocaleDateString()
        : (index <= currentIndex ? new Date().toLocaleDateString() : ''),
    }));
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const updated = addComment(selectedComplaint.id, currentUser.id, commentText);
    setSelectedComplaint(updated);
    setCommentText('');

    const updatedComplaints = complaints.map(c =>
      c.id === updated.id ? updated : c
    );
    setComplaints(updatedComplaints);
  };

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-primary, #1a202c)' }}>Please login to track complaints.</div>;
  }

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <div style={{
        ...styles.container,
        margin: isMobile ? '80px auto 20px' : '30px auto',
        padding: isMobile ? '0 16px' : '0 20px',
      }}>
        {/* Header */}
        <div style={styles.headerSection}>
          <h2 style={{
            ...styles.title,
            fontSize: isMobile ? '24px' : '2rem',
          }}>
            📍 Track Your Complaints
          </h2>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '14px' : '15px',
          }}>
            Click on any complaint to view its current status and detailed timeline.
          </p>
        </div>

        {complaints.length === 0 ? (
          <div style={{
            ...styles.empty,
            padding: isMobile ? '30px 16px' : '40px',
          }}>
            <p style={{ color: 'var(--text-secondary, #4a5568)' }}>You haven't reported any issues yet.</p>
            <button onClick={() => window.location.href = '/report-issue'} style={{
              ...styles.reportBtn,
              padding: isMobile ? '10px 24px' : '12px 30px',
              fontSize: isMobile ? '14px' : '16px',
            }}>
              ➕ Report an Issue
            </button>
          </div>
        ) : (
          <div style={{
            ...styles.grid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: isMobile ? '16px' : '20px',
          }}>
            {complaints.map((complaint) => (
              <div key={complaint.id} style={{
                ...styles.card,
                padding: isMobile ? '16px' : '20px',
              }} onClick={() => setSelectedComplaint(complaint)}>
                <div style={styles.cardHeader}>
                  <h3 style={{
                    ...styles.cardTitle,
                    fontSize: isMobile ? '15px' : '16px',
                  }}>{complaint.title}</h3>
                  <span style={{
                    ...styles.statusBadge,
                    background: complaint.status === 'Resolved' ? '#c6f6d5' : '#fefcbf',
                    color: complaint.status === 'Resolved' ? '#276749' : '#975a16',
                    fontSize: isMobile ? '11px' : '12px',
                    padding: isMobile ? '3px 10px' : '4px 12px',
                  }}>
                    {complaint.status}
                  </span>
                </div>
                <p style={{
                  ...styles.cardCategory,
                  fontSize: isMobile ? '13px' : '14px',
                }}>📂 {complaint.category}</p>
                <p style={{
                  ...styles.cardDate,
                  fontSize: isMobile ? '12px' : '13px',
                }}>📅 {new Date(complaint.createdAt).toLocaleDateString()}</p>
                <p style={styles.clickHint}>Click to view timeline</p>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedComplaint && (
          <div style={styles.modalOverlay} onClick={() => setSelectedComplaint(null)}>
            <div style={{
              ...styles.modal,
              padding: isMobile ? '24px 20px' : '30px',
              maxWidth: isMobile ? '95%' : '550px',
            }} onClick={(e) => e.stopPropagation()}>
              <button style={{
                ...styles.closeBtn,
                fontSize: isMobile ? '22px' : '24px',
                top: isMobile ? '12px' : '15px',
                right: isMobile ? '16px' : '20px',
              }} onClick={() => setSelectedComplaint(null)}>✕</button>

              <h3 style={{
                ...styles.modalTitle,
                fontSize: isMobile ? '20px' : '22px',
              }}>{selectedComplaint.title}</h3>
              <p style={{
                ...styles.modalCategory,
                fontSize: isMobile ? '13px' : '14px',
              }}>📂 Category: {selectedComplaint.category}</p>
              <p style={{
                ...styles.modalDesc,
                fontSize: isMobile ? '14px' : '15px',
                padding: isMobile ? '10px 14px' : '12px',
              }}>📝 {selectedComplaint.description}</p>

              <h4 style={{
                ...styles.timelineTitle,
                fontSize: isMobile ? '16px' : '18px',
              }}>📅 Status Timeline</h4>

              <div style={styles.timeline}>
                {getStatusSteps(selectedComplaint).map((step, index) => (
                  <div key={index} style={styles.timelineItem}>
                    <div style={{
                      ...styles.timelineDot,
                      background: step.active ? '#48bb78' : 'var(--border-color, #e2e8f0)',
                      width: isMobile ? '12px' : '14px',
                      height: isMobile ? '12px' : '14px',
                    }}></div>
                    <div style={styles.timelineContent}>
                      <p style={{
                        ...styles.timelineLabel,
                        color: step.active ? 'var(--text-primary, #2d3748)' : 'var(--text-secondary, #a0aec0)',
                        fontSize: isMobile ? '14px' : '15px',
                      }}>
                        {step.label}
                      </p>
                      <p style={{
                        ...styles.timelineDesc,
                        color: step.active ? 'var(--text-secondary, #4a5568)' : 'var(--text-secondary, #cbd5e0)',
                        fontSize: isMobile ? '12px' : '13px',
                      }}>
                        {step.desc}
                      </p>
                      {step.date && <p style={{
                        ...styles.timelineDate,
                        fontSize: isMobile ? '10px' : '11px',
                      }}>{step.date}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div style={styles.commentSection}>
                <h4 style={{
                  ...styles.remarksTitle,
                  fontSize: isMobile ? '16px' : '18px',
                }}>💬 Comments</h4>
                {selectedComplaint.comments?.length > 0 ? (
                  selectedComplaint.comments.map((comment, idx) => {
                    const userName = getUserName(comment.userId);
                    return (
                      <div key={idx} style={{
                        ...styles.remarkItem,
                        padding: isMobile ? '10px 14px' : '10px 14px',
                      }}>
                        <p style={{
                          ...styles.remarkText,
                          fontSize: isMobile ? '14px' : '15px',
                        }}>💬 {comment.text}</p>
                        <p style={{
                          ...styles.remarkMeta,
                          fontSize: isMobile ? '11px' : '12px',
                        }}>— {userName} on {new Date(comment.timestamp).toLocaleString()}</p>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--text-secondary, #a0aec0)', fontSize: isMobile ? '13px' : '14px' }}>No comments yet.</p>
                )}

                {currentUser && (
                  <div style={{
                    ...styles.commentInputRow,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '8px' : '10px',
                  }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{
                        ...styles.remarkInput,
                        padding: isMobile ? '10px 14px' : '10px 14px',
                        fontSize: isMobile ? '14px' : '15px',
                        borderRadius: isMobile ? '10px' : '12px',
                        width: isMobile ? '100%' : 'auto',
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment();
                        }
                      }}
                    />
                    <button onClick={handleAddComment} style={{
                      ...styles.postBtn,
                      padding: isMobile ? '10px 16px' : '10px 20px',
                      fontSize: isMobile ? '14px' : '15px',
                      width: isMobile ? '100%' : 'auto',
                      borderRadius: isMobile ? '10px' : '12px',
                    }}>
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== STYLES – Responsive =====
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px',
  },
  headerSection: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--text-primary, #1a202c)',
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--text-secondary, #718096)',
    fontSize: '15px',
    margin: 0,
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '16px',
    border: '1px solid var(--border-color, #e2e8f0)',
    transition: 'background 0.3s, border 0.3s',
  },
  reportBtn: {
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '40px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: 'auto',
    boxShadow: '0 4px 15px rgba(72,187,120,0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--bg-card, #ffffff)',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid var(--border-color, #e2e8f0)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary, #2d3748)',
    flex: 1,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    marginLeft: '10px',
  },
  cardCategory: {
    fontSize: '14px',
    color: 'var(--text-secondary, #718096)',
    margin: '4px 0',
  },
  cardDate: {
    fontSize: '13px',
    color: 'var(--text-secondary, #a0aec0)',
    margin: '4px 0',
  },
  clickHint: {
    fontSize: '12px',
    color: '#48bb78',
    margin: '8px 0 0',
    textAlign: 'right',
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '20px',
    padding: '30px',
    maxWidth: '550px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    border: '1px solid var(--border-color, #e2e8f0)',
    transition: 'background 0.3s, border 0.3s',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: 'var(--text-secondary, #a0aec0)',
    cursor: 'pointer',
    width: 'auto',
    padding: '5px 10px',
  },
  modalTitle: {
    margin: '0 0 5px 0',
    color: 'var(--text-primary, #2d3748)',
    fontSize: '22px',
  },
  modalCategory: {
    color: 'var(--text-secondary, #718096)',
    fontSize: '14px',
    margin: '0 0 10px 0',
  },
  modalDesc: {
    color: 'var(--text-primary, #4a5568)',
    padding: '12px',
    background: 'var(--bg-input, #f7fafc)',
    borderRadius: '10px',
    margin: '0 0 20px 0',
    transition: 'background 0.3s, color 0.3s',
  },
  timelineTitle: {
    margin: '0 0 15px 0',
    color: 'var(--text-primary, #2d3748)',
    borderBottom: '2px solid var(--border-color, #e2e8f0)',
    paddingBottom: '10px',
    transition: 'border-color 0.3s',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  timelineItem: {
    display: 'flex',
    gap: '15px',
    paddingBottom: '25px',
    position: 'relative',
  },
  timelineDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '4px',
    border: '2px solid var(--bg-card, #ffffff)',
    boxShadow: '0 0 0 2px var(--border-color, #e2e8f0)',
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontWeight: '600',
    fontSize: '15px',
    margin: '0 0 2px 0',
  },
  timelineDesc: {
    fontSize: '13px',
    margin: '0 0 2px 0',
  },
  timelineDate: {
    fontSize: '11px',
    color: 'var(--text-secondary, #a0aec0)',
    margin: '4px 0 0 0',
  },
  commentSection: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '2px solid var(--border-color, #e2e8f0)',
    transition: 'border-color 0.3s',
  },
  remarksTitle: {
    margin: '0 0 10px 0',
    color: 'var(--text-primary, #2d3748)',
  },
  remarkItem: {
    background: 'var(--bg-input, #f7fafc)',
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '8px',
    transition: 'background 0.3s',
  },
  remarkText: {
    margin: '0',
    color: 'var(--text-primary, #4a5568)',
  },
  remarkMeta: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary, #a0aec0)',
  },
  commentInputRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  remarkInput: {
    flex: 1,
    padding: '10px 14px',
    border: '2px solid var(--border-color, #e2e8f0)',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'var(--bg-input, #f7fafc)',
    color: 'var(--text-primary, #2d3748)',
    transition: 'border 0.3s, background 0.3s, color 0.3s',
  },
  postBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    width: 'auto',
  },
};

export default TrackComplaint;