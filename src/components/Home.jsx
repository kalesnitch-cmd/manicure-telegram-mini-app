import React from 'react';

const Home = ({ user, setTab }) => {
  return (
    <div className="scroll-container fade-in" style={{ padding: '24px 20px 130px 20px' }}>
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
            src={user.avatar || 'images/avatar.png'} 
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
            onError={(e) => { e.target.src = 'images/avatar.png'; }}
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

      {/* Master Profile Info */}
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'left', borderTop: '4.5px solid var(--gold-accent)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          О мастере Валерии ✨
        </h3>
        
        {/* Experience badges */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--rose-dark)', background: 'var(--rose-light)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(176,125,98,0.2)' }}>
            Возраст: 24 года
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--rose-dark)', background: 'var(--rose-light)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(176,125,98,0.2)' }}>
            Опыт: 5 лет
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '16px' }}>
          Привет, девочки! Меня зовут Валерия, и я ваш сертифицированный мастер ногтевого сервиса. Специализируюсь на чистейшем комбинированном маникюре, идеальном выравнивании ногтевой пластины и прочном тонком покрытии. 
        </p>
        
        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '20px' }}>
          Люблю создавать эстетичные минималистичные дизайны, френч и аккуратную геометрию. Постоянно повышаю квалификацию, чтобы ваши ручки выглядели дорого и безупречно!
        </p>

        {/* Studio quality checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>🧼</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>100% Стерильность</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Трехэтапная обработка инструментов по СанПиН (Сухожар ГП-10), крафт-пакет вскрывается при вас.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>💎</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>Премиум материалы</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Работаю исключительно на проверенных качественных базах и пигментах (Luxio, Uno, E.Mi), никакого скола покрытия.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>🎓</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>Сертифицированный специалист</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Выпускница академии EMI School, победительница регионального конкурса Nail Art 2024.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
