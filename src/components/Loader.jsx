import { useEffect, useState } from 'react';

const Loader = ({ onLoaded }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Keep loader for 2.3 seconds, then start fading
    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for fade transition (0.5s) to invoke completion
      const fadeTimer = setTimeout(() => {
        onLoaded();
      }, 500);
      return () => clearTimeout(fadeTimer);
    }, 2300);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  if (!visible) return null;

  return (
    <div className="loader-screen" style={{ opacity: visible ? 1 : 0 }}>
      <div className="loader-logo-container">
        <div className="loader-logo-bg"></div>
        <div className="loader-logo">Nails</div>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px' }}>
        & Beauty
      </div>
      <div className="loader-progress-track">
        <div className="loader-progress-bar"></div>
      </div>
      <div className="loader-text">загружаем красоту...</div>
    </div>
  );
};

export default Loader;
