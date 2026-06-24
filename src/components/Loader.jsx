import React, { useEffect, useState } from 'react';

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
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loader-logo-bg"></div>
        
        {/* Styled logo mockup layout */}
        <div className="logo-title-top" style={{ fontSize: '1.6rem', justifyContent: 'center', letterSpacing: '1px' }}>
          BO<span className="logo-o-capsule" style={{ width: '22px', height: '11px', borderWidth: '1.2px' }}></span>K YOUR
        </div>
        <div className="logo-title-bottom" style={{ fontSize: '1.9rem', marginBottom: '8px' }}>
          BEAUTY MOMENT
        </div>
      </div>
      
      <div className="loader-progress-track">
        <div className="loader-progress-bar"></div>
      </div>
      <div className="loader-text" style={{ fontSize: '0.72rem', letterSpacing: '1.5px', marginTop: '16px' }}>
        Загружаем красоту...
      </div>
    </div>
  );
};

export default Loader;
