import React, { useState, useEffect } from 'react';

const PAST_BOOKINGS_MOCK = [
  { id: 'past-1', service: 'Маникюр + дизайн (френч/фольга)', price: '2 200 ₽', date: '20 мая 2026', time: '14:00', status: 'completed' },
  { id: 'past-2', service: 'Маникюр + гель-лак (однотонный)', price: '1 800 ₽', date: '25 апреля 2026', time: '11:00', status: 'completed' },
  { id: 'past-3', service: 'Комби-маникюр без покрытия', price: '1 200 ₽', date: '12 марта 2026', time: '16:00', status: 'completed' },
];

const MyBookings = ({ setTab, refreshTrigger }) => {
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    // Read from LocalStorage
    const stored = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
    const active = stored.filter(b => b.status === 'active');
    setActiveBookings(active);
  }, [refreshTrigger]);

  const handleCancelBooking = (id) => {
    if (window.confirm('Вы уверены, что хотите отменить эту запись?')) {
      const stored = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
      const updated = stored.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('nails_bookings', JSON.stringify(updated));
      
      // Update state
      setActiveBookings(updated.filter(b => b.status === 'active'));
    }
  };

  return (
    <div className="scroll-container fade-in" style={{ padding: '20px 20px 130px 20px' }}>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', textAlign: 'left' }}>Мои записи</h2>

      {/* ACTIVE BOOKINGS SECTION */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--rose-dark)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', textAlign: 'left', fontWeight: '700' }}>
          Активные записи
        </h3>

        {activeBookings.length === 0 ? (
          <div className="glass-card" style={{ padding: '24px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>🌸</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              У вас пока нет активных записей.
            </p>
            <button 
              onClick={() => setTab('book')} 
              className="btn-secondary"
              style={{ width: '100%', padding: '12px' }}
            >
              Записаться на маникюр
            </button>
          </div>
        ) : (
          activeBookings.map((b) => (
            <div 
              key={b.id} 
              className="glass-card" 
              style={{ 
                borderLeft: '4px solid var(--gold-accent)', 
                background: 'rgba(255,255,255,0.6)',
                padding: '16px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', flex: 1, paddingRight: '8px' }}>
                  {b.service}
                </div>
                <div style={{ fontWeight: '700', color: 'var(--rose-dark)', fontSize: '0.9rem' }}>
                  {b.price}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div>📅 {b.date}</div>
                <div>🕒 {b.time}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleCancelBooking(b.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: 'none',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'rgba(230, 57, 70, 0.1)',
                    color: 'var(--danger)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  Отменить
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAST BOOKINGS SECTION */}
      <div>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', textAlign: 'left', fontWeight: '700' }}>
          История посещений
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PAST_BOOKINGS_MOCK.map((b) => (
            <div 
              key={b.id} 
              className="glass-card" 
              style={{ 
                background: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '14px 16px',
                textAlign: 'left',
                opacity: 0.85
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {b.service}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', background: 'rgba(42, 157, 143, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                  Выполнено
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>📅 {b.date} в {b.time}</span>
                <span style={{ fontWeight: '600' }}>{b.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
