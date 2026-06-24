const SUPABASE_URL = 'https://cvrgztdyduocesnwqjaz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WO-BI4JdAxOXkEeyWgdN4g_AsvTeHcM';
const API_URL = `${SUPABASE_URL}/functions/v1/beauty-api`;

// We check if we are in Telegram. If not, we run in developer/mock mode.
const realHasTelegram = Boolean(window.Telegram?.WebApp?.initData);

// Fetch real public data from the backend to populate the mock state
async function getPublicBootstrapData() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({ action: 'public_bootstrap', payload: {} }),
  });
  return response.json();
}

// Intercept and handle mock calls
async function mockApi(action, payload) {
  console.log(`[Mock API] Call: ${action}`, payload);

  // Force re-initialization if mock user isn't Arina yet
  if (localStorage.getItem('mock_user_name') !== 'Арина') {
    localStorage.removeItem('mock_initialized');
    localStorage.setItem('mock_user_name', 'Арина');
  }

  // Initialize mock store in localStorage if needed
  if (!localStorage.getItem('mock_initialized')) {
    try {
      const publicData = await getPublicBootstrapData();
      localStorage.setItem('mock_services', JSON.stringify(publicData.services || []));
      localStorage.setItem('mock_settings', JSON.stringify(publicData.settings || {}));
      localStorage.setItem('mock_portfolio', JSON.stringify(publicData.portfolio || []));
      
      const services = publicData.services || [];
      const service1 = services[0] || { id: 's1', name: 'Маникюр с покрытием', price: 1500, duration_minutes: 60 };
      const service2 = services[1] || service1;

      // Create 1 active booking (tomorrow) and 5 history bookings
      const mockBookings = [
        // Active booking (tomorrow at 12:00)
        {
          id: 'booking_active',
          starts_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0] + 'T12:00:00+03:00',
          ends_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0] + 'T13:00:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: 'Предпочтительно красный цвет',
          status: 'confirmed',
          service_id: service1.id,
          beauty_services: service1,
          created_at: new Date(Date.now() - 3600 * 1000).toISOString()
        },
        // Visit history (5 bookings)
        {
          id: 'booking_h1',
          starts_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T10:00:00+03:00',
          ends_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T11:00:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: '',
          status: 'completed',
          service_id: service1.id,
          beauty_services: service1,
          created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'booking_h2',
          starts_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T14:30:00+03:00',
          ends_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T15:30:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: 'Дизайн на двух пальцах',
          status: 'completed',
          service_id: service2.id,
          beauty_services: service2,
          created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'booking_h3',
          starts_at: new Date(Date.now() - 17 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T16:00:00+03:00',
          ends_at: new Date(Date.now() - 17 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T17:00:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: '',
          status: 'completed',
          service_id: service1.id,
          beauty_services: service1,
          created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'booking_h4',
          starts_at: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T11:00:00+03:00',
          ends_at: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T12:00:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: '',
          status: 'cancelled',
          service_id: service1.id,
          beauty_services: service1,
          created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'booking_h5',
          starts_at: new Date(Date.now() - 31 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T13:00:00+03:00',
          ends_at: new Date(Date.now() - 31 * 24 * 3600 * 1000).toISOString().split('T')[0] + 'T14:30:00+03:00',
          client_name: 'Арина',
          client_phone: '+79991112233',
          notes: 'Снятие + маникюр + укрепление',
          status: 'completed',
          service_id: service2.id,
          beauty_services: service2,
          created_at: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString()
        }
      ];

      localStorage.setItem('mock_bookings', JSON.stringify(mockBookings));
      localStorage.setItem('mock_initialized', 'true');
    } catch (e) {
      console.error('Failed to load public data for mocking, using empty defaults', e);
      localStorage.setItem('mock_services', '[]');
      localStorage.setItem('mock_settings', '{}');
      localStorage.setItem('mock_portfolio', '[]');
      localStorage.setItem('mock_bookings', '[]');
      localStorage.setItem('mock_initialized', 'true');
    }
  }

  const getStore = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  const setStore = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  if (action === 'bootstrap') {
    return {
      services: getStore('mock_services'),
      settings: JSON.parse(localStorage.getItem('mock_settings') || '{}'),
      portfolio: getStore('mock_portfolio'),
      occupied: getStore('mock_bookings')
        .filter(b => b.status === 'confirmed')
        .map(b => ({ id: b.id, starts_at: b.starts_at, ends_at: b.ends_at })),
      profile: {
        name: 'Арина',
        phone: '+7 (999) 111-22-33',
        role: 'admin'
      },
      telegramUser: {
        id: 12345,
        first_name: 'Арина',
        last_name: '',
        username: 'arina_beauty'
      }
    };
  }

  if (action === 'public_bootstrap') {
    return {
      services: getStore('mock_services'),
      settings: JSON.parse(localStorage.getItem('mock_settings') || '{}'),
      portfolio: getStore('mock_portfolio'),
      occupied: getStore('mock_bookings')
        .filter(b => b.status === 'confirmed')
        .map(b => ({ id: b.id, starts_at: b.starts_at, ends_at: b.ends_at }))
    };
  }

  if (action === 'create_booking' || action === 'admin_create_booking') {
    const services = getStore('mock_services');
    const service = services.find(s => s.id === payload.serviceId) || { name: 'Услуга', price: 1000, duration_minutes: 60 };
    const startsAt = new Date(`${payload.date}T${payload.time}:00+03:00`);
    const endsAt = new Date(startsAt.getTime() + (service.duration_minutes || 60) * 60000);

    const booking = {
      id: 'booking_' + Math.random().toString(36).substr(2, 9),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      client_name: payload.clientName || 'Арина',
      client_phone: payload.clientPhone || '+7 (999) 111-22-33',
      notes: payload.notes || '',
      status: 'confirmed',
      service_id: payload.serviceId,
      beauty_services: service,
      created_at: new Date().toISOString()
    };

    const bookings = getStore('mock_bookings');
    bookings.push(booking);
    setStore('mock_bookings', bookings);

    return { booking };
  }

  if (action === 'my_bookings') {
    return { bookings: getStore('mock_bookings') };
  }

  if (action === 'cancel_booking' || action === 'admin_update_booking') {
    const bookings = getStore('mock_bookings');
    const booking = bookings.find(b => b.id === payload.id);
    if (booking) {
      if (action === 'cancel_booking') {
        booking.status = 'cancelled';
      } else {
        booking.status = payload.status;
      }
      setStore('mock_bookings', bookings);
    }
    return { booking };
  }

  if (action === 'admin_dashboard') {
    return {
      bookings: getStore('mock_bookings').sort((a, b) => b.starts_at.localeCompare(a.starts_at)),
      services: getStore('mock_services'),
      settings: JSON.parse(localStorage.getItem('mock_settings') || '{}'),
      portfolio: getStore('mock_portfolio')
    };
  }

  if (action === 'admin_save_service') {
    const services = getStore('mock_services');
    let service;
    if (payload.id) {
      service = services.find(s => s.id === payload.id);
      if (service) {
        service.name = payload.name;
        service.description = payload.description;
        service.price = payload.price;
        service.duration_minutes = payload.durationMinutes;
        service.is_active = payload.isActive !== false;
      }
    } else {
      service = {
        id: 'service_' + Math.random().toString(36).substr(2, 9),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        duration_minutes: payload.durationMinutes,
        is_active: true,
        sort_order: services.length
      };
      services.push(service);
    }
    setStore('mock_services', services);
    return { service };
  }

  if (action === 'admin_delete_service') {
    const services = getStore('mock_services');
    const service = services.find(s => s.id === payload.id);
    if (service) {
      service.is_active = false;
      setStore('mock_services', services);
    }
    return { ok: true };
  }

  if (action === 'admin_save_settings') {
    const current = JSON.parse(localStorage.getItem('mock_settings') || '{}');
    const updated = { ...current, ...payload };
    localStorage.setItem('mock_settings', JSON.stringify(updated));
    return { settings: updated };
  }

  if (action === 'admin_save_portfolio') {
    let imageUrl = payload.imageUrl || '';
    if (payload.base64 && payload.mimeType) {
      imageUrl = `data:${payload.mimeType};base64,${payload.base64}`;
    }
    const portfolio = getStore('mock_portfolio');
    const item = {
      id: 'portfolio_' + Math.random().toString(36).substr(2, 9),
      title: payload.title,
      description: payload.description || '',
      image_url: imageUrl,
      sort_order: portfolio.length
    };
    portfolio.push(item);
    setStore('mock_portfolio', portfolio);
    return { item };
  }

  if (action === 'admin_delete_portfolio') {
    const portfolio = getStore('mock_portfolio');
    const updated = portfolio.filter(p => p.id !== payload.id);
    setStore('mock_portfolio', updated);
    return { ok: true };
  }

  return { error: 'Unknown action' };
}

export async function api(action, payload = {}) {
  // If no Telegram is detected, we mock the requests so developers can inspect all UI pages
  if (!realHasTelegram) {
    return mockApi(action, payload);
  }

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
  // In dev/screenshot mode, pretend we always have a session so the UI displays correctly
  return true;
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
