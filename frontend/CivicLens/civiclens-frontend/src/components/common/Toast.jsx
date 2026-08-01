import { useState, useEffect } from 'react';

let toastId = 0;
let listeners = [];

// ===== PUBLIC API =====
export const showToast = (message, type = 'success') => {
  console.log('🔔 Toast triggered:', message, type); // <-- DEBUG LOG
  
  const id = ++toastId;
  listeners.forEach(fn => fn({ id, message, type }));
  
  setTimeout(() => {
    listeners.forEach(fn => fn({ id, type: 'remove' }));
  }, 3000);
};

// ===== TOAST CONTAINER =====
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    console.log('✅ ToastContainer mounted!'); // <-- DEBUG LOG
    
    const handler = (toast) => {
      console.log('📦 Toast event:', toast); // <-- DEBUG LOG
      if (toast.type === 'remove') {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      } else {
        setToasts(prev => [...prev, toast]);
      }
    };
    
    listeners.push(handler);
    return () => {
      listeners = listeners.filter(fn => fn !== handler);
    };
  }, []);

  if (toasts.length === 0) {
    return null; // Don't render anything if no toasts
  }

  return (
    <div style={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            background: toast.type === 'success' 
              ? 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)' 
              : 'linear-gradient(135deg, #fc8181 0%, #c53030 100%)',
          }}
        >
          <span style={styles.icon}>
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <span style={styles.message}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

// ===== STYLES =====
const styles = {
  container: {
    position: 'fixed',
    top: '90px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    width: '100%',
    pointerEvents: 'none',
  },
  toast: {
    padding: '14px 20px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
    animation: 'slideInRight 0.4s ease-out',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    pointerEvents: 'auto',
    fontSize: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  message: {
    flex: 1,
  },
};

export default ToastContainer;