import { useMemo, useState } from 'react';
import { api, money } from '../lib/api';
import { ClockIcon, CheckCircleIcon, LocationIcon } from './Icons';

const dateKey = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow' }).format(date);
const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
const timeText = (value) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
const localMs = (date, time) => new Date(`${date}T${time}:00+03:00`).getTime();

export default function Book({ data, setTab, setRefresh }) {
  const services = data.services || [];
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [now] = useState(() => Date.now());
  const service = services.find((item) => item.id === serviceId);

  const days = useMemo(() => {
    const result = [];
    const horizon = data.settings?.booking_horizon_days || 60;
    for (let i = 0; i < horizon; i += 1) {
      const date = new Date(now + i * 86400000);
      const key = dateKey(date);
      const weekday = date.getDay();
      const schedule = data.schedule?.find((item) => item.weekday === weekday);
      const blocked = data.blockedDates?.some((item) => item.blocked_date === key);
      result.push({ key, date, schedule, blocked });
    }
    return result;
  }, [data, now]);

  const slotsFor = (day) => {
    if (!day?.schedule?.is_working || day.blocked || !service) return [];
    const slots = [];
    const start = minutes(day.schedule.start_time);
    const end = minutes(day.schedule.end_time);
    for (let value = start; value + service.duration_minutes <= end; value += day.schedule.slot_interval_minutes) {
      const time = timeText(value);
      const from = localMs(day.key, time);
      const to = from + service.duration_minutes * 60000;
      const occupied = data.occupied?.some((item) => new Date(item.starts_at).getTime() < to && new Date(item.ends_at).getTime() > from);
      slots.push({ time, available: !occupied && from > now + 5 * 60000 });
    }
    return slots;
  };

  const selectedDay = days.find((day) => day.key === selectedDate);
  const slots = slotsFor(selectedDay);
  const book = async () => {
    setBusy(true); setError('');
    try {
      const { booking } = await api('create_booking', { serviceId, date: selectedDate, time: selectedTime });
      setSuccess(booking); setRefresh((value) => value + 1);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return <><div className={`scroll-container fade-in page ${selectedTime ? 'has-cta' : ''}`}><h2>Записаться</h2>
    <section className="glass-panel booking-section"><h3>1. Выберите услугу</h3>{services.map((item) => <button className={`service-row ${serviceId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => { setServiceId(item.id); setSelectedDate(''); setSelectedTime(''); }}>
      <span><b>{item.name}</b><small><ClockIcon size={12} /> {item.duration_minutes} мин</small></span><strong>{money(item.price)}</strong>
    </button>)}</section>
    <section className="glass-panel booking-section"><h3>2. Выберите дату</h3><div className="date-grid">{days.map((day) => {
      const available = slotsFor(day).some((slot) => slot.available);
      return <button key={day.key} disabled={!available} className={selectedDate === day.key ? 'selected' : ''} onClick={() => { setSelectedDate(day.key); setSelectedTime(''); }}>
        <small>{new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(day.date)}</small><b>{day.date.getDate()}</b><span>{new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(day.date)}</span>
      </button>;
    })}</div></section>
    {selectedDate && <section className="glass-panel booking-section"><h3>3. Выберите время</h3><div className="time-grid">{slots.map((slot) => <button key={slot.time} disabled={!slot.available} className={selectedTime === slot.time ? 'selected' : ''} onClick={() => setSelectedTime(slot.time)}>{slot.time}</button>)}</div></section>}
    {error && <p className="form-error">{error}</p>}
  </div>
  {selectedTime && (
    <div className="booking-cta-container">
      <button className="btn-primary" disabled={busy} onClick={book}>
        {busy ? 'Сохраняем…' : `Записаться на ${selectedTime}`}
      </button>
    </div>
  )}
  {success && <div className="success-overlay"><div className="success-box"><CheckCircleIcon size={52} /><h2>Запись подтверждена!</h2><p>{service?.name}<br/><b>{new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long', timeZone: 'Europe/Moscow' }).format(new Date(success.starts_at))} в {selectedTime}</b></p><div className="location-line"><LocationIcon size={16}/>{data.settings.address}</div><button className="btn-primary" onClick={() => setTab('bookings')}>Мои записи</button></div></div>}
  </>;
}
