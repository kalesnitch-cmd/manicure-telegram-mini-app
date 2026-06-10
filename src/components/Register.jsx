import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Format phone number as user types: +7 (999) 999-99-99
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    if (rawVal.length === 0) {
      setPhone('');
      return;
    }

    if (rawVal.startsWith('7') || rawVal.startsWith('8')) {
      formatted = '+7';
    } else {
      formatted = '+7';
    }

    // append rest of the digits
    const digits = rawVal.substring(1, 11);
    if (digits.length > 0) {
      formatted += ` (${digits.substring(0, 3)}`;
    }
    if (digits.length > 3) {
      formatted += `) ${digits.substring(3, 6)}`;
    }
    if (digits.length > 6) {
      formatted += `-${digits.substring(6, 8)}`;
    }
    if (digits.length > 8) {
      formatted += `-${digits.substring(8, 10)}`;
    }
    
    setPhone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }
    if (phone.length < 18) { // Length of +7 (999) 999-99-99 is 18
      setError('Пожалуйста, введите корректный номер телефона');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    // Simulate API request to backend
    setTimeout(() => {
      setIsSubmitting(false);
      onRegister({ name, phone });
    }, 1500);
  };

  return (
    <div className="scroll-container fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '24px' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Привет!</h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '32px' }}>
          давай знакомиться ✨
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Ваше Имя</label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Например, Анна"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="userphone">Номер телефона</label>
            <input
              type="tel"
              id="userphone"
              className="input-field"
              placeholder="+7 (999) 999-99-99"
              value={phone}
              onChange={handlePhoneChange}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px', fontWeight: '500' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#fff',
                animation: 'spin 1s ease-in-out infinite'
              }}></span>
            ) : 'Зарегистрироваться 🌸'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Register;
