import { useEffect, useState } from 'react';
import { api, formatDateTime, money } from '../lib/api';
import { CalendarIcon, LotusIcon } from './Icons';

export default function MyBookings({ setTab, refresh, setRefresh }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => { try { const result = await api('my_bookings'); setBookings(result.bookings || []); setError(''); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [refresh]);
  const cancel = async (id) => {
    if (!window.confirm('Отменить эту запись?')) return;
    try { await api('cancel_booking', { id }); setRefresh((value) => value + 1); } catch (err) { setError(err.message); }
  };
  const active = bookings.filter((item) => item.status === 'confirmed' && new Date(item.starts_at) > new Date());
  const history = bookings.filter((item) => item.status !== 'confirmed' || new Date(item.starts_at) <= new Date());
  const card = (item, canCancel) => <article className="glass-card booking-card" key={item.id}><div><b>{item.beauty_services?.name}</b><strong>{money(item.beauty_services?.price)}</strong></div><p><CalendarIcon size={14}/>{formatDateTime(item.starts_at)}</p>{canCancel && <button className="cancel-link-btn" onClick={() => cancel(item.id)}>Отменить</button>} {!canCancel && <span className={`status ${item.status}`}>{item.status === 'completed' ? 'Выполнено' : item.status === 'cancelled' ? 'Отменено' : 'Прошедшая'}</span>}</article>;
  return <div className="scroll-container fade-in page"><h2>Мои записи</h2>{loading && <p>Загрузка…</p>}{error && <p className="form-error">{error}</p>}
    <h3 className="section-title">Активные записи</h3>{!loading && !active.length ? <div className="glass-card empty-state"><LotusIcon size={28}/><p>У вас пока нет активных записей.</p><button className="btn-secondary" onClick={() => setTab('book')}>Записаться</button></div> : active.map((item) => card(item, true))}
    <h3 className="section-title muted">История посещений</h3>{history.length ? history.map((item) => card(item, false)) : <p className="empty-text">История пока пуста</p>}
  </div>;
}
