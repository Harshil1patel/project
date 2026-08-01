import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import API from "../api/backend";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

  const response = await API.post("/users/login", {
    email: formData.email,
    password: formData.password,
  });

  const { user, token } = response.data;

  if (user.role !== "citizen") {
    setError("This login is for citizens only. Please use the Staff Login page.");
    setLoading(false);
    return;
  }

  localStorage.setItem("token", token);
  localStorage.setItem("civiclens_current_user", JSON.stringify(user));

  setLoading(false);

  navigate("/citizen-dashboard");

} catch (error) {

  setLoading(false);

  if (error.response) {
    setError(error.response.data.message);
  } else {
    setError("Unable to connect to server.");
  }

}
  };

  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transition: 'background 0.3s ease',
        padding: isMobile ? '20px' : '0',
      }}
    >
      {/* Green overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            theme === 'light'
              ? 'linear-gradient(135deg, rgba(72, 187, 120, 0.75) 0%, rgba(47, 133, 90, 0.65) 100%)'
              : 'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(47, 133, 90, 0.70) 100%)',
          zIndex: 0,
        }}
      />

      {/* Login Card */}
      <div
        className="login-card"
        style={{
          position: 'relative',
          zIndex: 1,
          background: theme === 'light'
            ? 'rgba(255, 255, 255, 0.92)'
            : 'rgba(26, 32, 44, 0.92)',
          padding: isMobile ? '30px 20px' : '40px 35px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.30)',
          width: '100%',
          maxWidth: isMobile ? '100%' : '420px',
          margin: '20px',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
          maxHeight: isMobile ? '90vh' : 'auto',
          overflowY: isMobile ? 'auto' : 'visible',
        }}
      >
        {/* ===== HEADER ROW – Logo left, Staff Login right ===== */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: isMobile ? '28px' : '32px' }}>🏙️</span>
              <span
                style={{
                  fontSize: isMobile ? '22px' : '26px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CivicLens
              </span>
            </div>
          </Link>

          <Link
            to="/staff-login"
            style={{
              color: '#48bb78',
              fontWeight: '600',
              fontSize: isMobile ? '13px' : '15px',
              textDecoration: 'none',
              background: 'rgba(72, 187, 120, 0.10)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(72, 187, 120, 0.20)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(72, 187, 120, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(72, 187, 120, 0.10)';
            }}
          >
            👮 Staff Login
          </Link>
        </div>
        {/* ============================================ */}

        <h2
          style={{
            color: 'var(--text-primary, #1a202c)',
            fontSize: isMobile ? '24px' : '28px',
            marginBottom: '8px',
            textAlign: 'center',
            transition: 'color 0.3s ease',
          }}
        >
          Welcome Back!
        </h2>
        <p
          style={{
            color: 'var(--text-secondary, #4a5568)',
            marginBottom: '24px',
            fontSize: isMobile ? '13px' : '14px',
            textAlign: 'center',
            transition: 'color 0.3s ease',
          }}
        >
          Login to report and track civic issues
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontWeight: '600',
                color: 'var(--text-primary, #2d3748)',
                marginBottom: '6px',
                fontSize: isMobile ? '13px' : '14px',
                transition: 'color 0.3s ease',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: isMobile ? '10px 14px' : '12px 16px',
                border: '2px solid var(--border-color, #e2e8f0)',
                borderRadius: '12px',
                fontSize: isMobile ? '13px' : '14px',
                background: 'var(--bg-input, #f7fafc)',
                color: 'var(--text-primary, #2d3748)',
                transition: 'border 0.3s, background 0.3s, color 0.3s',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                fontWeight: '600',
                color: 'var(--text-primary, #2d3748)',
                marginBottom: '6px',
                fontSize: isMobile ? '13px' : '14px',
                transition: 'color 0.3s ease',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: isMobile ? '10px 14px' : '12px 16px',
                border: '2px solid var(--border-color, #e2e8f0)',
                borderRadius: '12px',
                fontSize: isMobile ? '13px' : '14px',
                background: 'var(--bg-input, #f7fafc)',
                color: 'var(--text-primary, #2d3748)',
                transition: 'border 0.3s, background 0.3s, color 0.3s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: isMobile ? '12px' : '14px',
              background: 'linear-gradient(135deg, #48bb78 0%, #2f855a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(72, 187, 120, 0.30)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p
          className="register-link"
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: isMobile ? '13px' : '14px',
            color: 'var(--text-secondary, #4a5568)',
            transition: 'color 0.3s ease',
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#48bb78', textDecoration: 'none', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;