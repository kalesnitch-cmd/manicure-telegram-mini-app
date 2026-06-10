import { ClockIcon, LocationIcon, ShieldCleanIcon, GemIcon, AwardIcon } from './Icons';

export default function Home({ data, setTab }) {
  const { profile, settings, schedule = [] } = data;
  const working = schedule.filter((d) => d.is_working);
  const hours = working.length ? `${working[0].start_time.slice(0, 5)}–${working[0].end_time.slice(0, 5)}` : 'по записи';
  return <div className="scroll-container fade-in page">
    <div className="glass-panel profile-card">
      <img className="profile-avatar" src={profile.avatar_url || 'images/avatar.png'} alt="Аватар" onError={(e) => { e.currentTarget.src = 'images/avatar.png'; }} />
      <h2>Привет, {profile.name}!</h2><p>{profile.phone}</p>
      {profile.role === 'admin' && <button className="btn-secondary compact" onClick={() => setTab('admin')}>Открыть админку</button>}
    </div>
    <div className="glass-card info-card">
      <h3>{settings.studio_name}</h3><p>{settings.short_description}</p>
      <div><ClockIcon size={16} /><span>Рабочее время: {hours}</span></div>
      <div><LocationIcon size={16} /><span>{settings.address}</span></div>
    </div>
    <div className="glass-panel about-card">
      <h3>О мастере {settings.master_name}</h3><p>{settings.about_text}</p>
      <div className="quality"><ShieldCleanIcon size={20} /><span><b>Стерильность</b><small>Безопасная обработка инструментов и одноразовые материалы.</small></span></div>
      <div className="quality"><GemIcon size={20} /><span><b>Качественные материалы</b><small>Стойкое покрытие и бережный уход.</small></span></div>
      <div className="quality"><AwardIcon size={20} /><span><b>Профессиональный подход</b><small>Услуга и время подбираются индивидуально.</small></span></div>
    </div>
  </div>;
}
