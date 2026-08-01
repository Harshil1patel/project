import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CameraPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ===== START CAMERA – simplified, reliable constraints =====
  const startCamera = async () => {
    try {
      setError('');
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      const constraints = {
        video: {
          facingMode: facingMode,           // 'environment' or 'user'
          width: { ideal: isDesktop ? 1920 : 1280 },
          height: { ideal: isDesktop ? 1080 : 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      let msg = 'Failed to access camera.';
      if (err.name === 'NotAllowedError') {
        msg = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        msg = 'Camera is busy or not readable. Try restarting your phone.';
      } else if (err.name === 'OverconstrainedError') {
        msg = 'Camera does not support the requested settings. Please try again.';
      }
      setError(msg);
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !isCameraReady) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      setCapturedImage(file);
      setIsCapturing(false);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const flipCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    stopCamera();
    // Give time for the stream to fully stop
    setTimeout(startCamera, 500);
  };

  const usePhoto = () => {
    if (!capturedImage) return;
    navigate('/report-issue', { state: { capturedImage } });
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const goBack = () => {
    stopCamera();
    navigate(-1);
  };

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && isCameraReady && !capturedImage) capturePhoto();
      if (e.key === 'Escape') goBack();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCameraReady, capturedImage]);

  const viewfinderStyles = {
    ...styles.viewfinder,
    maxWidth: isDesktop ? '85%' : '500px',
    aspectRatio: isDesktop ? '16/9' : '4/3',
    borderRadius: isDesktop ? '16px' : '24px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ ...styles.container, padding: isDesktop ? '30px 40px' : '20px' }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ ...styles.header, padding: isDesktop ? '16px 4px' : '8px 4px' }}
      >
        <button onClick={goBack} style={styles.closeBtn}>✕</button>
        <span style={styles.headerTitle}>📷 Camera</span>
        {isCameraReady && !capturedImage && (
          <button onClick={flipCamera} style={styles.flipBtn}>🔄 Flip</button>
        )}
      </motion.div>

      {/* Viewfinder */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
        style={viewfinderStyles}
      >
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              style={styles.video}
              playsInline
              autoPlay
              muted
            />
            {!isCameraReady && !error && (
              <div style={styles.loadingOverlay}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  style={styles.spinner}
                />
                <p style={styles.loadingText}>Starting camera...</p>
              </div>
            )}
            {error && (
              <div style={styles.errorOverlay}>
                <span style={styles.errorIcon}>⚠️</span>
                <p style={styles.errorText}>{error}</p>
                <button onClick={startCamera} style={styles.retryBtn}>Retry</button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={styles.previewContainer}
          >
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              style={styles.previewImage}
            />
            <div style={styles.previewActions}>
              <button onClick={retakePhoto} style={styles.retakeBtn}>🔄 Retake</button>
              <button onClick={usePhoto} style={styles.useBtn}>✅ Use Photo</button>
            </div>
          </motion.div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </motion.div>

      {/* Capture Button */}
      {isCameraReady && !capturedImage && !error && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
          style={styles.captureSection}
        >
          <button
            onClick={capturePhoto}
            disabled={!isCameraReady || isCapturing}
            style={{ ...styles.captureBtn, opacity: isCapturing ? 0.6 : 1 }}
          >
            <div style={styles.captureInner} />
          </button>
          <p style={styles.captureHint}>Press Enter or tap to capture</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// ===== STYLES (no grid lines) =====
const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#000000',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 4px',
    zIndex: 10,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600',
  },
  flipBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    fontWeight: '500',
  },
  viewfinder: {
    flex: 1,
    width: '100%',
    maxWidth: '500px',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    background: '#1a1a1a',
    aspectRatio: '4/3',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    background: '#111',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255,255,255,0.2)',
    borderTop: '4px solid #48bb78',
    borderRadius: '50%',
  },
  loadingText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)',
    gap: '12px',
    padding: '20px',
    textAlign: 'center',
  },
  errorIcon: { fontSize: '48px' },
  errorText: {
    color: 'white',
    fontSize: '16px',
    maxWidth: '300px',
    lineHeight: '1.5',
  },
  retryBtn: {
    padding: '10px 30px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewActions: {
    position: 'absolute',
    bottom: '30px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '0 20px',
  },
  retakeBtn: {
    padding: '12px 30px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
  },
  useBtn: {
    padding: '12px 30px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(72,187,120,0.3)',
  },
  captureSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '20px',
  },
  captureBtn: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: '4px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border 0.3s',
    padding: '6px',
  },
  captureInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'white',
  },
  captureHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    margin: 0,
  },
};

export default CameraPage;