/**
 * Telegram Bot for Nails & Beauty Salon
 * Powered by zero-dependency long polling (Node.js native fetch)
 */

const TOKEN = '8916736208:AAGf59RxCqySUpFcr0vFim4fVMETmDcBszY';
const WEB_APP_URL = 'https://kalesnitch-cmd.github.io/manicure-telegram-mini-app/';
const API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Helper function to query Telegram API
async function telegramRequest(method, params = {}) {
  try {
    const response = await fetch(`${API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    if (!data.ok) {
      console.error(`Telegram API Error (${method}):`, data.description);
    }
    return data;
  } catch (error) {
    console.error(`Fetch error on method ${method}:`, error.message);
    return { ok: false };
  }
}

// Set up bot settings (Menu Button)
async function initializeBot() {
  console.log('🤖 Инициализация бота...');
  
  // Verify Token
  const me = await telegramRequest('getMe');
  if (!me.ok) {
    console.error('❌ Не удалось войти в бота. Проверьте токен.');
    process.exit(1);
  }
  console.log(`✅ Успешный вход! Имя бота: @${me.result.username}`);

  // Set chat Menu Button to open the Web App
  const menuResult = await telegramRequest('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: 'Записаться 💅',
      web_app: { url: WEB_APP_URL }
    }
  });
  
  if (menuResult.ok) {
    console.log('✅ Кнопка меню "Записаться" успешно установлена в чате.');
  } else {
    console.log('⚠️ Не удалось настроить кнопку меню бота.');
  }
  
  console.log('🚀 Бот запущен и ожидает сообщений (Long Polling)...');
  pollUpdates(0);
}

// Long polling loop
async function pollUpdates(offset = 0) {
  const response = await telegramRequest('getUpdates', {
    offset: offset,
    timeout: 30, // Wait up to 30 seconds for new messages
    allowed_updates: ['message']
  });

  if (response.ok && response.result.length > 0) {
    let nextOffset = offset;
    
    for (const update of response.result) {
      nextOffset = Math.max(nextOffset, update.update_id + 1);
      
      if (update.message) {
        await handleMessage(update.message);
      }
    }
    
    // Continue polling with the updated offset
    setTimeout(() => pollUpdates(nextOffset), 100);
  } else {
    // If request timed out or error occurred, wait and poll again
    setTimeout(() => pollUpdates(offset), 1000);
  }
}

// Handle incoming user messages
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const firstName = message.from?.first_name || 'гость';

  if (text.startsWith('/start')) {
    const welcomeText = `Привет, ${firstName}! Рада видеть вас! ✨\n\n` +
      `Меня зовут Валерия, и я ваш персональный мастер маникюра. Я создаю идеальные ногти, чистый комбинированный уход и стильные дизайны, которые носятся долго.\n\n` +
      `Нажмите на кнопку ниже, чтобы открыть наше интерактивное мини-приложение, посмотреть портфолио моих работ и выбрать удобную дату для записи! 👇`;

    await telegramRequest('sendMessage', {
      chat_id: chatId,
      text: welcomeText,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Записаться на маникюр 💅',
              web_app: { url: WEB_APP_URL }
            }
          ]
        ]
      }
    });
    console.log(`💬 Отправлено приветствие пользователю ${firstName} (ID: ${chatId})`);
  }
}

// Start the bot execution
initializeBot();
