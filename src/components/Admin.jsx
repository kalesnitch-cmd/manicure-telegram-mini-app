import { useEffect, useState } from 'react';
import { api, formatDateTime, money } from '../lib/api';

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file);
});

export default function Admin({ reload }) {
  const [view, setView] = useState('bookings');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const load = async () => { try { setData(await api('admin_dashboard')); setError(''); } catch (err) { setError(err.message); } };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);
  const run = async (action, payload) => { setBusy(true); try { await api(action, payload); await load(); await reload(); } catch (err) { setError(err.message); } finally { setBusy(false); } };
  if (!data) return <div className="scroll-container page"><h2>Админка</h2><p>{error || 'Загрузка…'}</p></div>;

  const addService = async (event) => { event.preventDefault(); const f = new FormData(event.currentTarget); await run('admin_save_service', { name: f.get('name'), description: f.get('description'), price: f.get('price'), durationMinutes: f.get('duration') }); event.currentTarget.reset(); };
  const manualBooking = async (event) => { event.preventDefault(); const f = new FormData(event.currentTarget); await run('admin_create_booking', { serviceId: f.get('service'), date: f.get('date'), time: f.get('time'), clientName: f.get('name'), clientPhone: f.get('phone'), notes: f.get('notes') }); event.currentTarget.reset(); };
  const saveSettings = async (event) => { event.preventDefault(); const f = new FormData(event.currentTarget); await run('admin_save_settings', Object.fromEntries(f)); };
  const addPhoto = async (event) => { event.preventDefault(); const f = new FormData(event.currentTarget); const file = f.get('photo'); await run('admin_save_portfolio', { title: f.get('title'), description: f.get('description'), mimeType: file.type, base64: await readFile(file) }); event.currentTarget.reset(); };

  return <div className="scroll-container fade-in page admin-page"><h2>Управление студией</h2><div className="admin-tabs">{[['bookings','Записи'],['services','Услуги'],['content','О студии'],['portfolio','Фото']].map(([id, label]) => <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)}>{label}</button>)}</div>{error && <p className="form-error">{error}</p>}
    {view === 'bookings' && <><form className="glass-panel admin-form" onSubmit={manualBooking}><h3>Добавить запись вручную</h3><input name="name" placeholder="Имя клиента" required/><input name="phone" placeholder="Телефон" required/><select name="service" required>{data.services.filter((s) => s.is_active).map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select><div className="form-row"><input name="date" type="date" required/><input name="time" type="time" required/></div><input name="notes" placeholder="Комментарий"/><button className="btn-primary" disabled={busy}>Добавить</button></form>
      <h3 className="section-title">Все записи</h3>{data.bookings.map((item) => <article className="glass-card admin-booking" key={item.id}><div><b>{item.client_name}</b><span>{item.client_phone}</span></div><p>{item.beauty_services?.name} · {money(item.beauty_services?.price)}</p><p>{formatDateTime(item.starts_at)}</p><select value={item.status} onChange={(e) => run('admin_update_booking', { id: item.id, status: e.target.value })}><option value="confirmed">Подтверждена</option><option value="completed">Выполнена</option><option value="cancelled">Отменена</option></select></article>)}</>}
    {view === 'services' && <><form className="glass-panel admin-form" onSubmit={addService}><h3>Новая услуга</h3><input name="name" placeholder="Название" required/><textarea name="description" placeholder="Описание"/><div className="form-row"><input name="price" type="number" min="0" placeholder="Цена" required/><input name="duration" type="number" min="15" step="15" placeholder="Минут" required/></div><button className="btn-primary" disabled={busy}>Добавить услугу</button></form>{data.services.map((s) => <article className="glass-card service-admin" key={s.id}><div><b>{s.name}</b><span>{money(s.price)} · {s.duration_minutes} мин</span></div><button className="danger-button" onClick={() => run('admin_delete_service', { id: s.id })}>{s.is_active ? 'Удалить' : 'Скрыта'}</button></article>)}</>}
    {view === 'content' && <form className="glass-panel admin-form" onSubmit={saveSettings}><h3>Информация о мастере</h3><label>Название студии<input name="studio_name" defaultValue={data.settings.studio_name}/></label><label>Имя мастера<input name="master_name" defaultValue={data.settings.master_name}/></label><label>Короткое описание<textarea name="short_description" defaultValue={data.settings.short_description}/></label><label>О мастере<textarea name="about_text" rows="6" defaultValue={data.settings.about_text}/></label><label>Адрес<input name="address" defaultValue={data.settings.address}/></label><label>Телефон<input name="phone" defaultValue={data.settings.phone}/></label><button className="btn-primary" disabled={busy}>Сохранить</button></form>}
    {view === 'portfolio' && <><form className="glass-panel admin-form" onSubmit={addPhoto}><h3>Добавить работу</h3><input name="title" placeholder="Название" required/><textarea name="description" placeholder="Описание"/><input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required/><button className="btn-primary" disabled={busy}>Загрузить фото</button></form><div className="portfolio-grid">{data.portfolio.map((item) => <div className="portfolio-card admin-photo" key={item.id}><img src={item.image_url}/><b>{item.title}</b><button className="danger-button" onClick={() => run('admin_delete_portfolio', { id: item.id })}>Удалить</button></div>)}</div></>}
  </div>;
}
