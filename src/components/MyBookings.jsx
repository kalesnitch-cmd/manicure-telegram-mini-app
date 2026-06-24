import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, HomeIcon } from './Icons';

const PAST_BOOKINGS_MOCK = [
  { id: 'past-1', service: 'Маникюр + дизайн (френч/фольга)', price: '2 200 ₽', date: '20 мая 2026', time: '14:00 - 15:00', status: 'completed' },
  { id: 'past-2', service: 'Маникюр + гель-лак (однотонный)', price: '1 800 ₽', date: '25 апреля 2026', time: '11:00 - 12:00', status: 'completed' },
  { id: 'past-3', service: 'Комби-маникюр без покрытия', price: '1 200 ₽', date: '12 марта 2026', time: '16:00 - 17:00', status: 'completed' },
];

const MyBookings = ({ setTab, refreshTrigger }) => {
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
    const active = stored.filter(b => b.status === 'active');
    setActiveBookings(active);
  }, [refreshTrigger]);

  const handleCancelBooking = (id) => {
    if (window.confirm('Вы уверены, что хотите отменить эту запись?')) {
      const stored = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
      const updated = stored.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('nails_bookings', JSON.stringify(updated));
      setActiveBookings(updated.filter(b => b.status === 'active'));
    }
  };

  return (
    <div className="scroll-container fade-in" style={{ padding: '20px 20px 95px 20px' }}>
      
      {/* Slogan headers */}
      <div style={{ marginBottom: '20px' }}>
        <div className="logo-title-bottom" style={{ fontSize: '1.7rem', marginBottom: '8px', marginTop: '8px' }}>
          МОИ ЗАПИСИ
        </div>
      </div>

      {/* ACTIVE BOOKINGS SECTION */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: '700' }}>
          Предстоящие сеансы
        </h3>

        {activeBookings.length === 0 ? (
          <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.7)', padding: '14px', borderRadius: '50%', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CalendarIcon size={24} color="var(--text-main)" />
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: '500' }}>
              У вас пока нет активных записей.
            </p>
            <button 
              onClick={() => setTab('book')} 
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Записаться
            </button>
          </div>
        ) : (
          activeBookings.map((b) => (
            <div 
              key={b.id} 
              className="glass-card" 
              style={{ 
                border: '1px solid rgba(255,255,255,0.6)',
                borderLeft: '4px solid rgba(216, 110, 248, 0.6)', 
                background: 'rgba(255,255,255,0.65)', 
                padding: '20px 16px',
                textAlign: 'left',
                borderRadius: '20px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)', flex: 1, paddingRight: '8px' }}>
                  {b.service}
                </div>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>
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
                  <span>{b.time.split(' - ')[0]}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleCancelBooking(b.id)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(230, 57, 70, 0.08)',
                    color: 'var(--danger)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: 'none'
                  }}
                >
                  Отменить сеанс
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAST BOOKINGS SECTION */}
      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: '700' }}>
          История визитов
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PAST_BOOKINGS_MOCK.map((b) => (
            <div 
              key={b.id} 
              className="glass-card" 
              style={{ 
                background: 'rgba(255,255,255,0.4)',
                border: '1.2px solid rgba(255,255,255,0.5)',
                padding: '16px',
                textAlign: 'left',
                borderRadius: '18px',
                boxShadow: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {b.service}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: '700', background: 'rgba(42, 157, 143, 0.08)', padding: '3px 8px', borderRadius: '12px' }}>
                  Выполнено
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CalendarIcon size={12} color="var(--text-muted)" />
                  <span>{b.date} в {b.time.split(' - ')[0]}</span>
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
