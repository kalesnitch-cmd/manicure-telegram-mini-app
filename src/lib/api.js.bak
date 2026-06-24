const SUPABASE_URL = 'https://cvrgztdyduocesnwqjaz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WO-BI4JdAxOXkEeyWgdN4g_AsvTeHcM';
const API_URL = `${SUPABASE_URL}/functions/v1/beauty-api`;

export async function api(action, payload = {}) {
  const initData = window.Telegram?.WebApp?.initData || '';
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({ action, payload, initData }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Не удалось выполнить запрос');
  return body;
}

export function hasTelegramSession() {
  return Boolean(window.Telegram?.WebApp?.initData);
}

export function money(value) {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Moscow',
  }).format(new Date(value));
}
