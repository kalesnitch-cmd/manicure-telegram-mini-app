import { useState } from 'react';

const fallback = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, title: 'Работа мастера', description: '', image_url: `images/portfolio/${i + 1}.png` }));

export default function Portfolio({ data }) {
  const [active, setActive] = useState(null);
  const items = data.portfolio?.length ? data.portfolio : fallback;
  return <div className="scroll-container fade-in page"><h2>Наши работы</h2><p className="subtitle">Идеи для вашего следующего образа</p>
    <div className="portfolio-grid">{items.map((item) => <button className="portfolio-card" key={item.id} onClick={() => setActive(item)}>
      <img src={item.image_url} alt={item.title} /><b>{item.title}</b>{item.description && <span>{item.description}</span>}
    </button>)}</div>
    {active && <div className="lightbox" onClick={() => setActive(null)}><div onClick={(e) => e.stopPropagation()}><button className="lightbox-close" onClick={() => setActive(null)}>×</button><img src={active.image_url} alt={active.title} /><h3>{active.title}</h3><p>{active.description}</p></div></div>}
  </div>;
}
