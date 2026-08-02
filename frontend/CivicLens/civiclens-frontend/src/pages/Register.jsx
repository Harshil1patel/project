import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import API from "../api/backend";

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 

  

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    setError('');
    setSuccess('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.post("/users/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      console.log(response.data);

      setSuccess("Registration successful! Redirecting to login...");
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {

      setIsLoading(false);

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

      {/* Register Card */}
      <div
        className="login-card register-card"
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
          maxHeight: isMobile ? '90vh' : '95vh',
          overflowY: 'auto',
          margin: '20px',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ fontSize: isMobile ? '28px' : '32px' }}>🏙️</span>
            <span
              style={{
                fontSize: isMobile ? '24px' : '28px',
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

        <h2
          style={{
            color: 'var(--text-primary, #1a202c)',
            fontSize: isMobile ? '24px' : '28px',
            marginBottom: '8px',
            textAlign: 'center',
            transition: 'color 0.3s ease',
          }}
        >
          Create Account
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
          Join as a citizen and report issues
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
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
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={false}
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
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={false}
              maxLength={10}
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
              placeholder="Min 6 characters"
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
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

          <button
            type="submit"
            disabled={isLoading}
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
              opacity:isLoading  ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Creating account...' : 'Register'}
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#48bb78', textDecoration: 'none', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;