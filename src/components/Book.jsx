import React, { useState } from 'react';

const SERVICES = [
  { id: 'classic', name: 'Комби-маникюр без покрытия', price: '1 200 ₽', duration: '60 мин' },
  { id: 'gel', name: 'Маникюр + гель-лак (однотонный)', price: '1 800 ₽', duration: '90 мин' },
  { id: 'design', name: 'Маникюр + дизайн (френч/фольга)', price: '2 200 ₽', duration: '120 мин' },
  { id: 'extension', name: 'Наращивание ногтей (до 3ки)', price: '3 000 ₽', duration: '150-180 мин' },
];

const TIME_SLOTS = [
  { time: '10:00', available: true },
  { time: '12:00', available: false },
  { time: '14:00', available: true },
  { time: '16:00', available: true },
  { time: '18:00', available: false },
  { time: '20:00', available: true },
];

const Book = ({ onBookingComplete, setTab }) => {
  const [selectedService, setSelectedService] = useState(SERVICES[1]); // Default to gel polish
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  // Calendar setup for June 2026
  // June 2026 starts on a Monday (1st) and has 30 days.
  // Today's date is assumed to be June 10, 2026 based on mock system environment.
  const currentYear = 2026;
  const currentMonthIdx = 5; // June (0-indexed)
  const monthName = 'Июнь 2026';
  const daysInJune = 30;
  const startDayOfWeek = 0; // Monday starts on index 0 in Russian format (Mon-Sun)

  const daysArray = Array.from({ length: daysInJune }, (_, i) => i + 1);

  const handleDaySelect = (day) => {
    // Enable booking for day >= 11 (June 10 is today, let's allow future booking from June 11)
    if (day < 11) return;
    setSelectedDate(day);
    setSelectedTime(null); // Reset selected time
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

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('nails_bookings') || '[]');
    existing.unshift(newBooking);
    localStorage.setItem('nails_bookings', JSON.stringify(existing));

    setSuccessDetails(newBooking);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onBookingComplete(); // Trigger update
    setTab('bookings'); // Redirect to My Bookings tab
  };

  return (
    <>
      <div className="scroll-container fade-in" style={{ padding: '20px 20px 130px 20px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', textAlign: 'left' }}>Запись на маникюр</h2>

        {/* Step 1: Select Service */}
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
            1. Выберите услугу
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SERVICES.map((s) => (
              <div 
                key={s.id}
                onClick={() => setSelectedService(s)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: selectedService.id === s.id ? '2px solid var(--rose-dark)' : '1px solid rgba(176,125,98,0.2)',
                  background: selectedService.id === s.id ? 'rgba(252,213,206,0.3)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ textAlign: 'left', flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-main)' }}>{s.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱ {s.duration}</div>
                </div>
                <div style={{ fontWeight: '700', color: 'var(--rose-dark)', fontSize: '0.95rem' }}>{s.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Custom Calendar */}
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
            2. Выберите дату ({monthName})
          </h3>
          
          {/* Weekday Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: '600', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div style={{color: 'var(--rose-dark)'}}>Сб</div><div style={{color: 'var(--rose-dark)'}}>Вс</div>
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {daysArray.map((day) => {
              const isToday = day === 10;
              const isPast = day < 10;
              const isAvailable = day >= 11; // Future bookings starting from tomorrow June 11
              const isSelected = selectedDate === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  disabled={!isAvailable}
                  style={{
                    height: '40px',
                    borderRadius: '50%',
                    border: isSelected ? '2px solid var(--rose-dark)' : 'none',
                    background: isSelected 
                      ? 'var(--button-gradient)' 
                      : isToday 
                      ? 'rgba(212,175,55,0.25)'
                      : isAvailable 
                      ? 'rgba(255, 255, 255, 0.6)' 
                      : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isToday 
                      ? 'var(--text-main)'
                      : isAvailable 
                      ? 'var(--text-main)' 
                      : 'rgba(74, 59, 50, 0.25)',
                    fontWeight: isSelected || isToday ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'var(--transition)'
                  }}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span style={{
                      position: 'absolute',
                      bottom: '4px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--gold-accent)'
                    }}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Time Slot */}
        {selectedDate && (
          <div className="glass-panel fade-in" style={{ padding: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
              3. Выберите время
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {TIME_SLOTS.map((slot, index) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    style={{
                      padding: '12px 6px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '1.5px solid var(--rose-dark)' : '1px solid rgba(176,125,98,0.2)',
                      background: isSelected 
                        ? 'rgba(252,213,206,0.5)' 
                        : slot.available 
                        ? 'rgba(255,255,255,0.6)' 
                        : 'rgba(0,0,0,0.05)',
                      color: slot.available ? 'var(--text-main)' : 'rgba(74, 59, 50, 0.35)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.85rem',
                      textDecoration: slot.available ? 'none' : 'line-through',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      transition: 'var(--transition)'
                    }}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Booking Summary & Submit */}
        {selectedDate && selectedTime && (
          <div className="fade-in" style={{ marginBottom: '20px' }}>
            <button onClick={handleBooking} className="btn-primary">
              Записаться на {selectedDate} июня в {selectedTime} 🌸
            </button>
          </div>
        )}
      </div>

      {/* Success Popup Modal - RENDERED OUTSIDE OF SCROLL CONTAINER */}
      {showSuccess && successDetails && (
        <div className="success-overlay" style={{ position: 'absolute' }}>
          <div className="success-box" style={{ transform: 'none' }}>
            <span className="success-icon">✨</span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Запись подтверждена!</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
              Вы успешно записались на <strong>{successDetails.service}</strong>.<br />
              Ждем вас <strong>{successDetails.date}</strong> в <strong>{successDetails.time}</strong>.
            </p>
            
            <div className="glass-card" style={{ textAlign: 'left', background: 'var(--rose-light)', padding: '12px 16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 Адрес студии:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>ул. Элегантная, д. 15, офис 302</div>
            </div>

            <button onClick={handleSuccessClose} className="btn-primary">
              Отлично 🌸
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Book;
