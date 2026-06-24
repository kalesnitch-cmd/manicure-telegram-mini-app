import React, { useState } from 'react';
import { BellIcon, SearchIcon, ThumbUpIcon, StarIcon } from './Icons';

const Home = ({ user, setTab }) => {
  const [activeCategory, setActiveCategory] = useState('Nail');
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="scroll-container fade-in" style={{ padding: '20px 20px 95px 20px' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        {/* User Info Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={user.avatar || 'images/avatar.png'} 
            alt={user.name}
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid white' }}
            onError={(e) => { e.target.src = 'images/avatar.png'; }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Hey {user.name} 👋</div>
          </div>
        </div>

        {/* Action Buttons Right */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', align_items: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
            <SearchIcon size={18} />
          </button>
          
          <button style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.5)', display: 'flex', justifyContent: 'center', align_items: 'center', cursor: 'pointer', position: 'relative', color: 'var(--text-main)' }}>
            <BellIcon size={18} />
            <span style={{ position: 'absolute', top: '0', right: '0', background: 'var(--text-main)', color: 'white', fontSize: '0.65rem', fontWeight: '700', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              3
            </span>
          </button>
        </div>
      </div>

      {/* Main Slogan Header */}
      <div>
        <div className="logo-title-top">
          BO<span className="logo-o-capsule"></span>K YOUR
        </div>
        <div className="logo-title-bottom">
          BEAUTY MOMENT
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="category-container">
        {['All', 'Nail', 'Lash', 'Beauty', 'Makeup'].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-pill ${isActive ? 'active' : ''}`}
            >
              {cat === 'Nail' ? 'Nail Specialist' : cat === 'Lash' ? 'Lash Artist' : cat === 'Beauty' ? 'Beauty Artist' : cat === 'All' ? 'All' : cat}
            </button>
          );
        })}
      </div>

      {/* Master Valeria Card (Amelia style mockup) */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '12px', 
          borderRadius: '32px', 
          position: 'relative', 
          width: '100%',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}
      >
        {/* Large Portrait Image */}
        <div style={{ width: '100%', height: '340px', borderRadius: '26px', overflow: 'hidden', position: 'relative' }}>
          <img 
            src="images/valeria.png" 
            alt="Valeria Novak" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Absolute overlay elements sitting on the bottom of the photo */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            zIndex: 10
          }}>
            
            {/* Left elements inside photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)', color: 'white', padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: '500', letterSpacing: '0.5px' }}>
                Nail Specialist
              </div>
              <div style={{ color: 'white', fontSize: '1.45rem', fontWeight: '700', textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily: 'var(--font-family)' }}>
                Valeria Novak
              </div>
              {/* "Booking Now" button over the card */}
              <button 
                onClick={() => setTab('book')}
                style={{ 
                  background: 'white', 
                  color: 'var(--text-main)', 
                  border: 'none', 
                  borderRadius: '50px', 
                  padding: '10px 20px', 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }}
              >
                Booking Now
              </button>
            </div>

            {/* Right elements inside photo (Likes & Rating) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={handleLike}
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  border: 'none', 
                  background: hasLiked ? 'var(--text-main)' : 'rgba(255,255,255,0.7)', 
                  color: hasLiked ? 'white' : 'var(--text-main)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
                }}
              >
                <ThumbUpIcon size={16} />
              </button>

              <div style={{ background: 'rgba(255,255,255,0.75)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <span>4.9</span>
                <StarIcon size={12} color="var(--text-main)" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Master Detailed Bio Panel */}
      <div className="glass-panel" style={{ borderTop: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: '700' }}>
          О мастере
        </h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', padding: '5px 12px', borderRadius: '50px' }}>
            Возраст: 24 года
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-main)', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', padding: '5px 12px', borderRadius: '50px' }}>
            Опыт: 5 лет
          </span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Привет, девочки! Меня зовут Валерия, я профессиональный мастер ногтевого сервиса. Специализируюсь на чистейшем комбинированном маникюре, идеальном выравнивании ногтевой пластины и прочном покрытии. Создаю эстетичные минималистичные дизайны, френч и аккуратную геометрию. 
        </p>

        {/* Benefits lists under the new glass look */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>100% Стерильность</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Трехэтапная обработка инструментов по СанПиН в медицинском сухожаре ГП-10. Крафт-пакет вскрывается при вас.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>💎</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>Премиум материалы</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Работаю исключительно на проверенных качественных базах и пигментах (Luxio, Uno, E.Mi), никакого скола покрытия.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
