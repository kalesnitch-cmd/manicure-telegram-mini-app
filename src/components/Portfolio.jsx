import React, { useState } from 'react';

const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Элегантный нюд', desc: 'Нежное камуфлирующее покрытие с изящными акцентами золотой потали.', img: 'images/portfolio/1.png' },
  { id: 2, title: 'Классический красный', desc: 'Насыщенный глянцевый красный — бессмертная классика для любого повода.', img: 'images/portfolio/2.png' },
  { id: 3, title: 'Современный френч', desc: 'Микро-френч с тонкими серебряными линиями на полупрозрачной базе.', img: 'images/portfolio/3.png' },
  { id: 4, title: 'Матовый минимализм', desc: 'Глубокий матовый черный с деликатными геометрическими линиями.', img: 'images/portfolio/4.png' },
  { id: 5, title: 'Розовое золото', desc: 'Эффектный зеркальный хром с роскошным металлическим отливом.', img: 'images/portfolio/5.png' },
  { id: 6, title: 'Мерцающая лаванда', desc: 'Пастельный сиреневый оттенок с легким голографическим шиммером.', img: 'images/portfolio/6.png' },
  { id: 7, title: 'Шалфейная геометрия', desc: 'Матовый припыленный зеленый с лаконичной золотой полоской.', img: 'images/portfolio/7.png' },
  { id: 8, title: 'Жемчужная втирка', desc: 'Иридиевый перламутровый блеск, напоминающий знаменитые глазированные ногти.', img: 'images/portfolio/8.png' },
];

const Portfolio = () => {
  const [activePhoto, setActivePhoto] = useState(null);

  const openLightbox = (item) => {
    setActivePhoto(item);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  return (
    <div className="scroll-container fade-in" style={{ padding: '20px 20px 130px 20px' }}>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '4px', textAlign: 'left' }}>Наши работы</h2>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'left' }}>
        примерить образ на свои ногти ✨
      </p>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingBottom: '20px' }}>
        {PORTFOLIO_ITEMS.map((item) => (
          <div 
            key={item.id}
            onClick={() => openLightbox(item)}
            className="glass-card"
            style={{
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.45)',
              borderRadius: 'var(--border-radius-sm)',
              overflow: 'hidden',
              transition: 'var(--transition)'
            }}
          >
            {/* Image Container with fixed aspect ratio */}
            <div style={{
              width: '100%',
              paddingBottom: '100%', // 1:1 Aspect Ratio
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <img 
                src={item.img} 
                alt={item.title} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                className="portfolio-thumb"
              />
            </div>
            <div style={{ textAlign: 'left', padding: '0 4px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.2', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(18, 18, 18, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '24px'
          }}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1110
            }}
          >
            ✕
          </button>

          {/* Large Image */}
          <div style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            marginBottom: '20px'
          }}>
            <img 
              src={activePhoto.img} 
              alt={activePhoto.title} 
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Detail card */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent close on card click
            className="glass-panel"
            style={{
              maxWidth: '400px',
              width: '100%',
              background: 'rgba(255,255,255,0.95)',
              textAlign: 'left',
              padding: '20px',
              color: 'var(--text-main)'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{activePhoto.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {activePhoto.desc}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .portfolio-thumb:hover {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
