import React, { useState } from 'react';
import { ClockIcon, LocationIcon, CheckCircleIcon } from './Icons';

const SERVICES = [
  { id: 'classic', name: 'Комби-маникюр без покрытия', price: '1 200 ₽', duration: '60 мин' },
  { id: 'gel', name: 'Маникюр + гель-лак (однотонный)', price: '1 800 ₽', duration: '90 мин' },
  { id: 'design', name: 'Маникюр + дизайн (френч/фольга)', price: '2 200 ₽', duration: '120 мин' },
  { id: 'extension', name: 'Наращивание ногтей (до 3ки)', price: '3 000 ₽', duration: '150-180 мин' },
];

const TIME_SLOTS = [
  { time: '10:30 - 11:30', available: true },
  { time: '11:45 - 12:45', available: false },
  { time: '13:00 - 14:00', available: true },
  { time: '14:30 - 15:30', available: true },
  { time: '16:00 - 17:00', available: false },
  { time: '17:30 - 18:30', available: true },
];

const Book = ({ onBookingComplete, setTab }) => {
  const [selectedService, setSelectedService] = useState(SERVICES[1]); // Default to gel polish
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  const monthName = 'Июнь 2026';
  const daysInJune = 30;
  const daysArray = Array.from({ length: daysInJune }, (_, i) => i + 1);

  const handleDaySelect = (day) => {
    if (day < 11) return; // Only allow future dates
    setSelectedDate(day);
    setSelectedTime(null); // Reset time when changing date
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const formattedDate = `${selectedDate} июня 2026`;
    const newBooking = {
      id: Date.now().toString(),
      service: selectedService.name,
      price: selectedService.price,
      date: formattedDate,
      time: selectedTime,
      status: 'active',
      timestamp: Date.now()
    };

    const existing = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
    existing.unshift(newBooking);
    localStorage.setItem('nails_bookings', JSON.stringify(existing));

    setSuccessDetails(newBooking);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onBookingComplete();
    setTab('bookings'); // Redirect to My Bookings
  };

  return (
    <>
      {/* Scrollable Area */}
      <div className="scroll-container fade-in" style={{ padding: '20px 20px 180px 20px' }}>
        
        {/* Header slogan styling matching ref */}
        <div style={{ marginBottom: '20px' }}>
          <div className="logo-title-top" style={{ fontSize: '1.4rem' }}>
            BO<span className="logo-o-capsule" style={{ width: '24px', height: '12px' }}></span>K YOUR
          </div>
          <div className="logo-title-bottom" style={{ fontSize: '1.7rem', marginBottom: '8px' }}>
            BEAUTY MOMENT
          </div>
        </div>

        {/* Step 1: Select Service */}
        <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            1. Выберите процедуру
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SERVICES.map((s) => {
              const isSelected = selectedService.id === s.id;
              return (
                <div 
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: isSelected ? '1.5px solid var(--text-main)' : '1px solid rgba(255,255,255,0.4)',
                    background: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ textAlign: 'left', flex: 1, paddingRight: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <ClockIcon size={12} color="var(--text-muted)" />
                      <span>{s.duration}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.92rem' }}>{s.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Custom Calendar Grid (Mockup Style) */}
        <div className="glass-panel" style={{ padding: '18px', marginBottom: '20px', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            2. Выберите дату ({monthName})
          </h3>
          
          {/* Weekday labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px 4px' }}>
            {daysArray.map((day) => {
              const isToday = day === 10;
              const isPast = day < 10;
              const isAvailable = day >= 11;
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  disabled={!isAvailable}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    margin: '0 auto',
                    background: isSelected 
                      ? 'var(--button-dark)' 
                      : isToday
                      ? 'rgba(0,0,0,0.05)'
                      : isAvailable 
                      ? 'rgba(255,255,255,0.45)' 
                      : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isToday
                      ? 'var(--text-main)'
                      : isAvailable 
                      ? 'var(--text-main)' 
                      : 'rgba(0, 0, 0, 0.2)',
                    fontWeight: isSelected || isToday ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: isToday && !isSelected ? '1.5px solid var(--text-main)' : 'none',
                    transition: 'var(--transition)',
                    boxShadow: isSelected ? '0 6px 12px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Time Slot (Pills) */}
        {selectedDate && (
          <div className="glass-panel fade-in" style={{ padding: '18px', marginBottom: '24px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              3. Время сеанса
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {TIME_SLOTS.map((slot, index) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '50px', // Pill style
                      border: 'none',
                      background: isSelected 
                        ? 'var(--button-dark)' 
                        : slot.available 
                        ? 'rgba(255,255,255,0.5)' 
                        : 'rgba(0,0,0,0.03)',
                      color: isSelected 
                        ? 'white' 
                        : slot.available 
                        ? 'var(--text-main)' 
                        : 'rgba(0,0,0,0.22)',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      textDecoration: slot.available ? 'none' : 'line-through',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      transition: 'var(--transition)',
                      boxShadow: isSelected ? '0 6px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Booking Summary Sheet (mockup style) */}
      {selectedDate && selectedTime && (
        <div 
          className="fade-in"
          style={{
            position: 'absolute',
            bottom: '104px', // Above bottom-nav
            left: '20px',
            right: '20px',
            height: '78px',
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1.2px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '26px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.05)',
            zIndex: 90
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Выбранная дата</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
              Июнь {selectedDate}, {selectedTime.split(' - ')[0]}
            </div>
          </div>
          
          <button 
            onClick={handleBooking}
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 28px', fontSize: '0.88rem' }}
          >
            Booking Now
          </button>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccess && successDetails && (
        <div className="success-overlay">
          <div className="success-box">
            <div className="success-icon-container">
              <CheckCircleIcon size={34} color="var(--text-main)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', fontFamily: 'Outfit' }}>Запись подтверждена!</h2>
            
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
              Вы успешно записались на <strong>{successDetails.service}</strong>.<br />
              Ждем вас <strong>{successDetails.date}</strong> в <strong>{successDetails.time.split(' - ')[0]}</strong>.
            </p>
            
            <div 
              className="glass-card" 
              style={{ 
                textAlign: 'left', 
                background: 'rgba(255, 255, 255, 0.5)', 
                border: '1px solid rgba(255, 255, 255, 0.6)', 
                padding: '14px 16px', 
                marginBottom: '20px', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '10px',
                borderRadius: '16px'
              }}
            >
              <div style={{ marginTop: '2px' }}><LocationIcon size={16} /></div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Адрес студии:</div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>ул. Элегантная, д. 15, оф. 302</div>
              </div>
            </div>

            <button onClick={handleSuccessClose} className="btn-primary">
              Отлично
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Book;
