import React from 'react';

const Home = ({ user, setTab }) => {
  return (
    <div className="scroll-container fade-in" style={{ padding: '24px 20px' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Absolute Gold decorative lines */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', border: '2px solid rgba(212,175,55,0.15)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '50%' }}></div>

        {/* User Telegram Avatar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{
            position: 'absolute',
            inset: '-4px',
            background: 'var(--gold-gradient)',
            borderRadius: '50%',
            zIndex: 1,
            boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
          }}></div>
          <img 
            src={user.avatar || '/images/avatar.png'} 
            alt="Telegram Avatar" 
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 2,
              border: '3px solid white',
              display: 'block'
            }}
            onError={(e) => { e.target.src = '/images/avatar.png'; }}
          />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>
          Привет, {user.name}! 🌸
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
          {user.phone}
        </p>
      </div>

      {/* Salon Information Card */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', borderLeft: '4px solid var(--rose-dark)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', textAlign: 'left' }}>Студия Nails & Beauty</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'left', lineHeight: '1.4', marginBottom: '12px' }}>
          Премиальный маникюр и педикюр от топ-мастера Валерии. Творим красоту на ваших руках с любовью и заботой.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🕒</span>
            <span>Ежедневно с 10:00 до 22:00</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📍</span>
            <span>ул. Элегантная, д. 15, офис 302</span>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', textAlign: 'left', paddingLeft: '4px' }}>Услуги и действия</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div 
          onClick={() => setTab('book')}
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer', textAlign: 'center', background: 'rgba(252, 213, 206, 0.4)' }}
        >
          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</span>
          <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Записаться</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Выбрать дату</span>
        </div>

        <div 
          onClick={() => setTab('bookings')}
          className="glass-card" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'pointer', textAlign: 'center', background: 'rgba(255, 255, 255, 0.5)' }}
        >
          <span style={{ fontSize: '2rem', marginBottom: '8px' }}>💅</span>
          <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>Мои записи</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ваши визиты</span>
        </div>
      </div>

      <div 
        onClick={() => setTab('portfolio')}
        className="glass-card"
        style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.5)' }}
      >
        <span style={{ fontSize: '1.8rem' }}>✨</span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Портфолио мастера</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Примеры лучших работ Валерии</div>
        </div>
        <span style={{ fontSize: '1.2rem', color: 'var(--rose-dark)' }}>➔</span>
      </div>
    </div>
  );
};

export default Home;
