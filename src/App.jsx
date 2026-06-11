import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import Register from './components/Register';
import Home from './components/Home';
import Book from './components/Book';
import MyBookings from './components/MyBookings';
import Portfolio from './components/Portfolio';
import Admin from './components/Admin';
import { LotusIcon, CalendarIcon, NailIcon, SparklesIcon } from './components/Icons';
import { api, hasTelegramSession } from './lib/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('home');
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  const load = async () => {
    try {
      const result = await api(hasTelegramSession() ? 'bootstrap' : 'public_bootstrap');
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready(); tg?.expand(); tg?.enableClosingConfirmation?.();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const registered = (profile) => {
    setData((current) => ({ ...current, profile }));
    setTab('home');
  };

  if (loading) return <Loader onLoaded={() => {}} />;
  if (error && !data) return <div className="center-message glass-panel">{error}<button className="btn-primary" onClick={load}>Повторить</button></div>;
  if (!data?.profile) return <Register onRegister={registered} telegramUser={data?.telegramUser} telegramRequired={!hasTelegramSession()} />;

  const props = { data, setData, setTab, refresh, setRefresh };
  const content = tab === 'book' ? <Book {...props} />
    : tab === 'bookings' ? <MyBookings {...props} />
    : tab === 'portfolio' ? <Portfolio {...props} />
    : tab === 'admin' ? <Admin {...props} reload={load} />
    : <Home {...props} />;

  const nav = [
    ['home', 'Главная', LotusIcon], ['book', 'Записаться', CalendarIcon],
    ['bookings', 'Мои записи', NailIcon], ['portfolio', 'Портфолио', SparklesIcon],
  ];
  if (data.profile.role === 'admin') nav.push(['admin', 'Админ', CalendarIcon]);

  return <div className="app-shell">
    {content}
    <nav className="bottom-nav">
      {nav.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`nav-item ${tab === id ? 'active' : ''}`}>
        <span className="nav-icon"><Icon color={tab === id ? 'var(--deep-mint)' : 'var(--text-muted)'} size={21} /></span><span>{label}</span>
      </button>)}
    </nav>
  </div>;
}
