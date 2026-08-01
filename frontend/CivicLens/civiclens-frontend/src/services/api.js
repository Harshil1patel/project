// ============================================
// MOCK API - Uses localStorage (No Backend!)
// ============================================

const COMPLAINTS_KEY = 'civiclens_complaints';
const USERS_KEY = 'civiclens_users';

// ---------- USER FUNCTIONS ----------

// Get all registered users
export const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Add a new user (Register)
export const addUser = (user) => {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: user.password,
    role: user.role || 'citizen',
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

// Find a user by email and password (Login)
export const findUser = (email, password) => {
  const users = getUsers();
  return users.find((u) => u.email === email && u.password === password);
};

// Check if email is already registered
export const isEmailTaken = (email) => {
  const users = getUsers();
  return users.some((u) => u.email === email);
};

// ---------- COMPLAINT FUNCTIONS ----------

// Get all complaints
export const getComplaints = () => {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  return data ? JSON.parse(data) : [];
};
export const addComment = (complaintId, userId, text) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    if (!complaints[index].comments) {
      complaints[index].comments = [];
    }
    complaints[index].comments.push({
      userId,
      text,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return complaints[index];
  }
  return null;
};

// Get user name by ID
export const getUserName = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
};

// Add a new complaint
export const addComplaint = (complaint) => {
  const complaints = getComplaints();
  const newComplaint = {
    id: Date.now().toString(),
    title: complaint.title,
    category: complaint.category,
    description: complaint.description,
    image: complaint.image || null,
    location: complaint.location || 'Unknown',
    latitude: complaint.latitude || null,
    longitude: complaint.longitude || null,
    status: 'Pending',
    userId: complaint.userId || 'guest',
    officerId: null,
    upvotes: 0,
    comments: [],
    remarks: [],
    createdAt: new Date().toISOString(),
  };
  complaints.push(newComplaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  return newComplaint;
};

// Get a single complaint by ID (KEEP ONLY THIS ONE COPY!)
export const getComplaintById = (id) => {
  const complaints = getComplaints();
  return complaints.find((c) => c.id === id);
};

// Update complaint status (Officer/Admin)
export const updateComplaintStatus = (id, newStatus, officerId = null) => {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === id);
  if (index !== -1) {
    complaints[index].status = newStatus;
    if (officerId) complaints[index].officerId = officerId;
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return complaints[index];
  }
  return null;
};

// Delete a complaint (Admin only)
export const deleteComplaint = (id) => {
  let complaints = getComplaints();
  complaints = complaints.filter((c) => c.id !== id);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
};

// Get complaints for a specific user
export const getUserComplaints = (userId) => {
  const complaints = getComplaints();
  return complaints.filter((c) => c.userId === userId);
};

// ---------- OFFICER FUNCTIONS ----------

// Get all pending complaints (available for officers to claim)
export const getPendingComplaints = () => {
  const complaints = getComplaints();
  return complaints.filter(c => c.status === 'Pending' && !c.officerId);
};

// Assign a complaint to an officer (Claim)
export const claimComplaint = (complaintId, officerId) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    complaints[index].officerId = officerId;
    complaints[index].status = 'Assigned';
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return complaints[index];
  }
  return null;
};

// Update complaint status AND add a remark
export const updateComplaintWithRemark = (complaintId, newStatus, remark, officerName) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    complaints[index].status = newStatus;
    
    if (!complaints[index].remarks) {
      complaints[index].remarks = [];
    }
    complaints[index].remarks.push({
      text: remark || `Status updated to ${newStatus}`,
      officer: officerName || 'Officer',
      timestamp: new Date().toISOString(),
    });
    
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return complaints[index];
  }
  return null;
};

// Get complaints assigned to a specific officer
export const getAssignedComplaints = (officerId) => {
  const complaints = getComplaints();
  return complaints.filter(c => c.officerId === officerId);
};

// ===== UPDATE USER PROFILE =====
export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    // Update only the fields provided
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Also update the current session if this is the logged-in user
    const currentUser = JSON.parse(localStorage.getItem('civiclens_current_user'));
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('civiclens_current_user', JSON.stringify(users[index]));
    }
    return users[index];
  }
  return null;
};