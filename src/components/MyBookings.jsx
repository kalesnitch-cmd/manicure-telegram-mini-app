import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, LotusIcon } from './Icons';

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
    <div className="scroll-container fade-in" style={{ padding: '20px 20px 95px 20px' }}>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', textAlign: 'left' }}>Мои записи</h2>

      {/* ACTIVE BOOKINGS SECTION */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--rose-dark)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', textAlign: 'left', fontWeight: '700' }}>
          Активные записи
        </h3>

        {activeBookings.length === 0 ? (
          <div className="glass-card" style={{ padding: '24px 16px', textAlign: 'center', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'var(--rose-light)', padding: '12px', borderRadius: '50%', marginBottom: '12px', border: '1px solid rgba(176,125,98,0.2)' }}>
              <LotusIcon size={24} />
            </div>
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
                borderLeft: '4.5px solid var(--gold-accent)', 
                background: '#ffffff', // Solid white background for high contrast
                padding: '18px 16px',
                textAlign: 'left',
                boxShadow: '0 6px 16px rgba(143, 93, 67, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', flex: 1, paddingRight: '8px' }}>
                  {b.service}
                </div>
                <div style={{ fontWeight: '700', color: 'var(--rose-dark)', fontSize: '0.95rem' }}>
                  {b.price}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarIcon size={14} color="var(--text-muted)" />
                  <span>{b.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ClockIcon size={14} color="var(--text-muted)" />
                  <span>{b.time}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleCancelBooking(b.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 'var(--border-radius-sm)',
                    background: 'rgba(230, 57, 70, 0.08)',
                    color: 'var(--danger)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  Отменить запись
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
                background: '#ffffff', // Solid white for high contrast
                border: '1.5px solid rgba(176, 125, 98, 0.22)',
                padding: '14px 16px',
                textAlign: 'left',
                opacity: 0.95,
                boxShadow: '0 4px 10px rgba(143, 93, 67, 0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {b.service}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: '700', background: 'rgba(42, 157, 143, 0.08)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(42, 157, 143, 0.15)' }}>
                  Выполнено
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarIcon size={12} color="var(--text-muted)" />
                  <span>{b.date} в {b.time}</span>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{b.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
