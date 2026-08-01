import { useState, useEffect } from 'react';
import API from "../api/backend";
import Navbar from '../components/layout/Navbar';
import { showToast } from '../components/common/Toast';

const OfficerDashboard = () => {
  const [user, setUser] = useState(null);
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('assigned');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => {
  try {
    const currentUser = JSON.parse(
      localStorage.getItem("civiclens_current_user")
    );

    if (!currentUser || currentUser.role !== "officer") return;

    setUser(currentUser);

    const token = localStorage.getItem("token");

    const response = await API.get("/complaints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const complaints = response.data;

    setAssignedComplaints(
      complaints.filter(c => c.officer === currentUser._id)
    );

    setPendingComplaints(
      complaints.filter(c => c.status === "Pending")
    );

  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = async (complaintId) => {
    if (!user) return;
    setLoading(true);
    await API.put(
  `/complaints/${complaintId}/claim`,
  {},
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
    loadData();
    setLoading(false);
    showToast('✅ Complaint claimed successfully!', 'success');
  };

  const handleStatusUpdate = async (complaintId, newStatus, remark) => {
    if (!user) return;
    setLoading(true);
    await API.put(
  `/complaints/${complaintId}`,
  {
    status: newStatus,
    remark,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
    loadData();
    setLoading(false);
    showToast('✅ Status updated successfully!', 'success');
    setSelectedComplaint(null);
  };

  const handleViewDetails = async (complaintId) => {
    const token = localStorage.getItem("token");

const response = await API.get(
  `/complaints/${complaintId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

setSelectedComplaint(response.data);
    
  };

  const renderComplaintCard = (complaint, showClaimBtn = false) => (
    <div key={complaint._id} style={{
      ...styles.card,
      padding: isMobile ? '16px' : '20px',
    }}>
      <div style={styles.cardHeader}>
        <h3 style={{
          ...styles.cardTitle,
          fontSize: isMobile ? '15px' : '16px',
        }}>
          {complaint.title}
        </h3>
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
      }}>
        📂 {complaint.category}
      </p>
      <p style={{
        ...styles.cardDesc,
        fontSize: isMobile ? '13px' : '14px',
      }}>
        {complaint.description?.slice(0, 80)}...
      </p>
      <p style={{
        ...styles.cardDate,
        fontSize: isMobile ? '12px' : '13px',
      }}>
        📅 {new Date(complaint.createdAt).toLocaleDateString()}
      </p>
      <div style={{
        ...styles.cardActions,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '8px' : '10px',
      }}>
        <button style={{
          ...styles.viewBtn,
          padding: isMobile ? '10px 16px' : '8px 16px',
          fontSize: isMobile ? '14px' : '15px',
          width: isMobile ? '100%' : 'auto',
        }} onClick={() => handleViewDetails(complaint._id)}>
          👁️ View Details
        </button>
        {showClaimBtn && (
          <button 
            style={{
              ...styles.claimBtn,
              padding: isMobile ? '10px 16px' : '8px 16px',
              fontSize: isMobile ? '14px' : '15px',
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => handleClaim(complaint._id)}
            disabled={loading}
          >
            🎯 Claim
          </button>
        )}
      </div>
    </div>
  );

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login as an officer to access this dashboard.</div>;
  }

  return (
    <div>
      <Navbar />
      <br />
      <div style={{
        ...styles.container,
        padding: isMobile ? '80px 16px 30px' : '30px 20px',
        margin: isMobile ? '0' : '30px auto',
      }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px' }}>👮 Officer Dashboard</h2>
        <p style={{
          ...styles.subtitle,
          fontSize: isMobile ? '14px' : '16px',
        }}>
          Welcome back, {user.name}! Manage complaints assigned to you or claim new ones.
        </p>

        {/* Tab Navigation */}
        <div style={{
          ...styles.tabs,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '10px',
          paddingBottom: isMobile ? '8px' : '10px',
        }}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'assigned' ? styles.tabActive : {}),
              padding: isMobile ? '12px 16px' : '10px 24px',
              fontSize: isMobile ? '15px' : '16px',
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => setActiveTab('assigned')}
          >
            📋 Assigned ({assignedComplaints.length})
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'pending' ? styles.tabActive : {}),
              padding: isMobile ? '12px 16px' : '10px 24px',
              fontSize: isMobile ? '15px' : '16px',
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => setActiveTab('pending')}
          >
            🆕 Available ({pendingComplaints.length})
          </button>
        </div>

        {activeTab === 'assigned' ? (
          <div>
            {assignedComplaints.length === 0 ? (
              <div style={{
                ...styles.empty,
                padding: isMobile ? '30px 16px' : '40px',
                fontSize: isMobile ? '14px' : '16px',
              }}>
                <p>No complaints assigned to you yet. Check the "Available" tab to claim new ones!</p>
              </div>
            ) : (
              <div style={{
                ...styles.grid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: isMobile ? '16px' : '20px',
              }}>
                {assignedComplaints.map(c => renderComplaintCard(c, false))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {pendingComplaints.length === 0 ? (
              <div style={{
                ...styles.empty,
                padding: isMobile ? '30px 16px' : '40px',
                fontSize: isMobile ? '14px' : '16px',
              }}>
                <p>No pending complaints available. All caught up! 🎉</p>
              </div>
            ) : (
              <div style={{
                ...styles.grid,
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: isMobile ? '16px' : '20px',
              }}>
                {pendingComplaints.map(c => renderComplaintCard(c, true))}
              </div>
            )}
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
              }} onClick={() => setSelectedComplaint(null)}>✕</button>
              
              <h3 style={{
                ...styles.modalTitle,
                fontSize: isMobile ? '20px' : '24px',
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
              <p style={{
                ...styles.modalDesc,
                fontSize: isMobile ? '14px' : '15px',
                padding: isMobile ? '10px 14px' : '12px',
              }}>📍 Location: {selectedComplaint.location || 'Not provided'}</p>
              
              {selectedComplaint.image && (
                <div style={styles.imageContainer}>
                  <img src={selectedComplaint.image} alt="Complaint" style={{
                    ...styles.modalImage,
                    maxHeight: isMobile ? '150px' : '200px',
                  }} />
                </div>
              )}

              <div style={styles.divider}></div>

              <div style={styles.updateSection}>
                <label style={{
                  ...styles.label,
                  fontSize: isMobile ? '14px' : '15px',
                }}>Update Status:</label>
                <select 
                  style={{
                    ...styles.select,
                    padding: isMobile ? '10px 14px' : '10px 14px',
                    fontSize: isMobile ? '14px' : '15px',
                  }}
                  value={selectedComplaint.status}
                  onChange={(e) => {
                    setSelectedComplaint({ ...selectedComplaint, status: e.target.value });
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                
                <label style={{
                  ...styles.label,
                  fontSize: isMobile ? '14px' : '15px',
                  marginTop: '15px',
                }}>Add Remark (Optional):</label>
                <input 
                  type="text" 
                  id="remarkInput"
                  placeholder="e.g. Inspected the site, work started..."
                  style={{
                    ...styles.remarkInput,
                    padding: isMobile ? '10px 14px' : '10px 14px',
                    fontSize: isMobile ? '14px' : '15px',
                  }}
                />
                
                <button 
                  style={{
                    ...styles.updateBtn,
                    padding: isMobile ? '12px' : '12px',
                    fontSize: isMobile ? '16px' : '17px',
                  }}
                  onClick={() => {
                    const remark = document.getElementById('remarkInput').value;
                    handleStatusUpdate(selectedcomplaint._id, selectedComplaint.status, remark);
                  }}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : '✅ Update Status'}
                </button>
              </div>

              {selectedComplaint.remarks && selectedComplaint.remarks.length > 0 && (
                <div style={styles.remarksSection}>
                  <h4 style={{
                    ...styles.remarksTitle,
                    fontSize: isMobile ? '16px' : '18px',
                  }}>📝 Activity Log</h4>
                  {selectedComplaint.remarks.map((remark, idx) => (
                    <div key={idx} style={{
                      ...styles.remarkItem,
                      padding: isMobile ? '10px 14px' : '10px 14px',
                    }}>
                      <p style={{
                        ...styles.remarkText,
                        fontSize: isMobile ? '14px' : '15px',
                      }}>💬 {remark.text}</p>
                      <p style={{
                        ...styles.remarkMeta,
                        fontSize: isMobile ? '12px' : '13px',
                      }}>— {remark.officer} on {new Date(remark.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== STYLES - Responsive =====
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px',
  },
  subtitle: {
    color: 'var(--text-secondary, #718096)',
    marginBottom: '30px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    borderBottom: '2px solid var(--border-color, #c6f6d5)',
    paddingBottom: '10px',
  },
  tab: {
    padding: '10px 24px',
    background: 'var(--bg-input, #f1f5f9)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    color: 'var(--text-secondary, #718096)',
    width: 'auto',
    transition: 'all 0.3s',
  },
  tabActive: {
    background: '#48bb78',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--bg-card, #ffffff)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: 'var(--shadow, 0 2px 10px rgba(0,0,0,0.05))',
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
    color: 'var(--text-primary, #1a202c)',
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
  cardDesc: {
    fontSize: '14px',
    color: 'var(--text-secondary, #4a5568)',
    margin: '8px 0',
  },
  cardDate: {
    fontSize: '13px',
    color: 'var(--text-secondary, #a0aec0)',
    margin: '4px 0 12px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  viewBtn: {
    padding: '8px 16px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    width: 'auto',
    transition: 'all 0.3s',
  },
  claimBtn: {
    padding: '8px 16px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    width: 'auto',
    transition: 'all 0.3s',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    background: 'var(--bg-card, #ffffff)',
    borderRadius: '16px',
    color: 'var(--text-secondary, #718096)',
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
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '550px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
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
    color: 'var(--text-primary, #1a202c)',
  },
  modalCategory: {
    color: 'var(--text-secondary, #718096)',
    fontSize: '14px',
    margin: '0 0 10px 0',
  },
  modalDesc: {
    color: 'var(--text-secondary, #4a5568)',
    padding: '12px',
    background: 'var(--bg-input, #f0fff4)',
    borderRadius: '8px',
    margin: '0 0 15px 0',
  },
  imageContainer: {
    marginBottom: '15px',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #c6f6d5)',
  },
  divider: {
    borderTop: '2px solid var(--border-color, #c6f6d5)',
    margin: '15px 0',
  },
  updateSection: {
    margin: '15px 0',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: 'var(--text-primary, #2d3748)',
    marginBottom: '6px',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid var(--border-color, #c6f6d5)',
    borderRadius: '10px',
    fontSize: '14px',
    background: 'var(--bg-input, #f0fff4)',
    color: 'var(--text-primary, #2d3748)',
  },
  remarkInput: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid var(--border-color, #c6f6d5)',
    borderRadius: '10px',
    fontSize: '14px',
    background: 'var(--bg-input, #f0fff4)',
    color: 'var(--text-primary, #2d3748)',
    marginBottom: '12px',
  },
  updateBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  remarksSection: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '2px solid var(--border-color, #c6f6d5)',
  },
  remarksTitle: {
    margin: '0 0 10px 0',
    color: 'var(--text-primary, #2d3748)',
  },
  remarkItem: {
    background: 'var(--bg-input, #f0fff4)',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  remarkText: {
    margin: '0',
    color: 'var(--text-secondary, #4a5568)',
  },
  remarkMeta: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary, #a0aec0)',
  },
};

export default OfficerDashboard;