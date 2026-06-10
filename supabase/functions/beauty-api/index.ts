import { createClient } from 'npm:@supabase/supabase-js@2';

const BOT_ID = '8916736208';
const TELEGRAM_PUBLIC_KEY = 'e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

function hexToBytes(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0));
}

async function telegramUser(initData: string) {
  if (!initData) throw new Error('Откройте приложение внутри Telegram');
  const params = new URLSearchParams(initData);
  const signature = params.get('signature');
  const authDate = Number(params.get('auth_date'));
  if (!signature || !authDate) throw new Error('Telegram не передал данные авторизации');
  if (Math.abs(Date.now() / 1000 - authDate) > 86400) throw new Error('Сессия Telegram устарела. Откройте приложение заново');

  const fields = [...params.entries()]
    .filter(([key]) => key !== 'hash' && key !== 'signature')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const data = new TextEncoder().encode(`${BOT_ID}:WebAppData\n${fields}`);
  const key = await crypto.subtle.importKey('raw', hexToBytes(TELEGRAM_PUBLIC_KEY), { name: 'Ed25519' }, false, ['verify']);
  const valid = await crypto.subtle.verify('Ed25519', key, base64UrlToBytes(signature), data);
  if (!valid) throw new Error('Не удалось подтвердить Telegram-профиль');
  return JSON.parse(params.get('user') || '{}');
}

async function getProfile(telegramId: number) {
  const { data } = await supabase.from('beauty_profiles').select('*').eq('telegram_id', telegramId).maybeSingle();
  return data;
}

async function requireAdmin(telegramId: number) {
  const profile = await getProfile(telegramId);
  if (profile?.role !== 'admin') throw new Error('Недостаточно прав');
  return profile;
}

async function publicData() {
  const today = new Date();
  const until = new Date(today.getTime() + 366 * 86400000);
  const [{ data: services }, { data: settings }, { data: schedule }, { data: blockedDates }, { data: portfolio }, { data: occupied }] = await Promise.all([
    supabase.from('beauty_services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('beauty_settings').select('*').single(),
    supabase.from('beauty_work_schedule').select('*').order('weekday'),
    supabase.from('beauty_blocked_dates').select('*').gte('blocked_date', today.toISOString().slice(0, 10)),
    supabase.from('beauty_portfolio').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('beauty_bookings').select('id,starts_at,ends_at').eq('status', 'confirmed').gte('starts_at', today.toISOString()).lt('starts_at', until.toISOString()),
  ]);
  return { services, settings, schedule, blockedDates, portfolio, occupied };
}

function startsAt(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) throw new Error('Некорректная дата или время');
  return new Date(`${date}T${time}:00+03:00`);
}

async function createBooking(user: any, payload: any, source = 'mini_app') {
  const serviceId = String(payload.serviceId || '');
  const { data: service } = await supabase.from('beauty_services').select('*').eq('id', serviceId).eq('is_active', true).single();
  if (!service) throw new Error('Услуга недоступна');
  const start = startsAt(payload.date, payload.time);
  if (start.getTime() < Date.now() + 5 * 60000) throw new Error('Нельзя записаться на прошедшее время');
  const end = new Date(start.getTime() + service.duration_minutes * 60000);
  const weekday = Number(new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Moscow' }).format(start) === 'Sun' ? 0 : start.getUTCDay());
  const { data: day } = await supabase.from('beauty_work_schedule').select('*').eq('weekday', weekday).single();
  const { data: blocked } = await supabase.from('beauty_blocked_dates').select('blocked_date').eq('blocked_date', payload.date).maybeSingle();
  if (!day?.is_working || blocked) throw new Error('Эта дата недоступна для записи');
  const localStart = payload.time;
  const localEnd = `${String((Number(payload.time.slice(0, 2)) * 60 + Number(payload.time.slice(3)) + service.duration_minutes) / 60 | 0).padStart(2, '0')}:${String((Number(payload.time.slice(0, 2)) * 60 + Number(payload.time.slice(3)) + service.duration_minutes) % 60).padStart(2, '0')}`;
  if (localStart < day.start_time.slice(0, 5) || localEnd > day.end_time.slice(0, 5)) throw new Error('Услуга не помещается в рабочее время');

  const profile = user ? await getProfile(user.id) : null;
  const row = {
    telegram_id: user?.id || null,
    service_id: service.id,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    client_name: profile?.name || String(payload.clientName || '').trim(),
    client_phone: profile?.phone || String(payload.clientPhone || '').trim(),
    notes: String(payload.notes || '').trim(),
    source,
  };
  if (!row.client_name || !row.client_phone) throw new Error('Укажите имя и телефон клиента');
  const { data, error } = await supabase.from('beauty_bookings').insert(row).select('*, beauty_services(*)').single();
  if (error?.code === '23P01') throw new Error('Это время уже занято. Выберите другой слот');
  if (error) throw error;
  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { action, payload = {}, initData = '' } = await req.json();
    if (action === 'public_bootstrap') return json(await publicData());
    const user = await telegramUser(initData);
    if (!user?.id) throw new Error('Telegram-пользователь не найден');

    if (action === 'bootstrap') {
      const profile = await getProfile(user.id);
      return json({ ...(await publicData()), profile, telegramUser: user });
    }
    if (action === 'register') {
      const name = String(payload.name || '').trim();
      const phone = String(payload.phone || '').trim();
      if (name.length < 2 || phone.replace(/\D/g, '').length < 10) throw new Error('Проверьте имя и номер телефона');
      const existing = await getProfile(user.id);
      let role = existing?.role || 'client';
      if (!existing) {
        const { count } = await supabase.from('beauty_profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
        if (!count) role = 'admin';
      }
      const { data, error } = await supabase.from('beauty_profiles').upsert({
        telegram_id: user.id, name, phone, avatar_url: user.photo_url || null,
        username: user.username || null, role, updated_at: new Date().toISOString(),
      }).select().single();
      if (error?.code === '23505' && role === 'admin') {
        const retry = await supabase.from('beauty_profiles').upsert({ telegram_id: user.id, name, phone, avatar_url: user.photo_url || null, username: user.username || null, role: 'client' }).select().single();
        if (retry.error) throw retry.error;
        return json({ profile: retry.data });
      }
      if (error) throw error;
      return json({ profile: data });
    }
    if (action === 'create_booking') return json({ booking: await createBooking(user, payload) });
    if (action === 'my_bookings') {
      const { data, error } = await supabase.from('beauty_bookings').select('*, beauty_services(*)').eq('telegram_id', user.id).order('starts_at', { ascending: false });
      if (error) throw error;
      return json({ bookings: data });
    }
    if (action === 'cancel_booking') {
      const { data, error } = await supabase.from('beauty_bookings').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', payload.id).eq('telegram_id', user.id).eq('status', 'confirmed').select().single();
      if (error || !data) throw new Error('Запись уже отменена или не найдена');
      return json({ booking: data });
    }

    await requireAdmin(user.id);
    if (action === 'admin_dashboard') {
      const [{ data: bookings }, { data: services }, { data: settings }, { data: portfolio }] = await Promise.all([
        supabase.from('beauty_bookings').select('*, beauty_services(*)').order('starts_at', { ascending: false }).limit(300),
        supabase.from('beauty_services').select('*').order('sort_order'),
        supabase.from('beauty_settings').select('*').single(),
        supabase.from('beauty_portfolio').select('*').order('sort_order'),
      ]);
      return json({ bookings, services, settings, portfolio });
    }
    if (action === 'admin_save_service') {
      const row = { name: String(payload.name || '').trim(), description: String(payload.description || ''), price: Number(payload.price), duration_minutes: Number(payload.durationMinutes), is_active: payload.isActive !== false, sort_order: Number(payload.sortOrder || 0), updated_at: new Date().toISOString() };
      const query = payload.id ? supabase.from('beauty_services').update(row).eq('id', payload.id) : supabase.from('beauty_services').insert(row);
      const { data, error } = await query.select().single(); if (error) throw error; return json({ service: data });
    }
    if (action === 'admin_delete_service') {
      const { error } = await supabase.from('beauty_services').update({ is_active: false }).eq('id', payload.id); if (error) throw error; return json({ ok: true });
    }
    if (action === 'admin_save_settings') {
      const allowed = ['studio_name','master_name','short_description','about_text','address','phone','booking_horizon_days'];
      const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const key of allowed) if (payload[key] !== undefined) row[key] = payload[key];
      const { data, error } = await supabase.from('beauty_settings').update(row).eq('id', true).select().single(); if (error) throw error; return json({ settings: data });
    }
    if (action === 'admin_create_booking') return json({ booking: await createBooking(null, payload, 'admin') });
    if (action === 'admin_update_booking') {
      const { data, error } = await supabase.from('beauty_bookings').update({ status: payload.status, updated_at: new Date().toISOString() }).eq('id', payload.id).select().single(); if (error) throw error; return json({ booking: data });
    }
    if (action === 'admin_save_portfolio') {
      let imageUrl = String(payload.imageUrl || '');
      if (payload.base64 && payload.mimeType) {
        const bytes = Uint8Array.from(atob(payload.base64), (c) => c.charCodeAt(0));
        const ext = payload.mimeType === 'image/png' ? 'png' : payload.mimeType === 'image/webp' ? 'webp' : 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('beauty-portfolio').upload(path, bytes, { contentType: payload.mimeType });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from('beauty-portfolio').getPublicUrl(path).data.publicUrl;
      }
      if (!imageUrl) throw new Error('Добавьте фотографию');
      const { data, error } = await supabase.from('beauty_portfolio').insert({ title: payload.title, description: payload.description || '', image_url: imageUrl, sort_order: Number(payload.sortOrder || 0) }).select().single(); if (error) throw error; return json({ item: data });
    }
    if (action === 'admin_delete_portfolio') {
      const { error } = await supabase.from('beauty_portfolio').delete().eq('id', payload.id); if (error) throw error; return json({ ok: true });
    }
    return json({ error: 'Неизвестная операция' }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Внутренняя ошибка' }, 400);
  }
});
