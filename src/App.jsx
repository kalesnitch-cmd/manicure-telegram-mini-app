import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Register from './components/Register';
import Home from './components/Home';
import Book from './components/Book';
import MyBookings from './components/MyBookings';
import Portfolio from './components/Portfolio';
import { HomeIcon, CalendarIcon, BookingsIcon, HeartIcon } from './components/Icons';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('home'); // 'home', 'book', 'bookings', 'portfolio'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check Telegram WebApp API
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Attempt to extract Telegram User
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        // Look up if user has already registered
        const storedUser = localStorage.getItem(`nails_user_${tgUser.id}`);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Pre-fill user with telegram details
          window.tgUserPrefill = {
            id: tgUser.id,
            name: `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim(),
            avatar: tgUser.photo_url || 'images/avatar.png'
          };
        }
      } else {
        const storedLocal = localStorage.getItem('nails_user_default');
        if (storedLocal) {
          setUser(JSON.parse(storedLocal));
        }
      }
    } else {
      const storedLocal = localStorage.getItem('nails_user_default');
      if (storedLocal) {
        setUser(JSON.parse(storedLocal));
      }
    }
  }, []);

  const handleRegister = (data) => {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    
    const newUser = {
      id: tgUser?.id || 'default_user',
      name: data.name,
      phone: data.phone,
      avatar: tgUser?.photo_url || 'images/avatar.png'
    };

    if (tgUser?.id) {
      localStorage.setItem(`nails_user_${tgUser.id}`, JSON.stringify(newUser));
    } else {
      localStorage.setItem('nails_user_default', JSON.stringify(newUser));
    }
    
    setUser(newUser);
    setTab('home');
  };

  const handleBookingComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Switch tabs
  const renderTabContent = () => {
    switch (tab) {
      case 'home':
        return <Home user={user} setTab={setTab} />;
      case 'book':
        return <Book onBookingComplete={handleBookingComplete} setTab={setTab} />;
      case 'bookings':
        return <MyBookings setTab={setTab} refreshTrigger={refreshTrigger} />;
      case 'portfolio':
        return <Portfolio />;
      default:
        return <Home user={user} setTab={setTab} />;
    }
  };

  if (loading) {
    return <Loader onLoaded={() => setLoading(false)} />;
  }

  // If user is not registered, show Register Screen
  if (!user) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Register onRegister={handleRegister} />
      </div>
    );
  }

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Scrollable container for tab contents */}
      {renderTabContent()}

      {/* Sleek Floating Glassmorphic Bottom Navigation Capsule */}
      <nav className="bottom-nav">
        <button 
          onClick={() => setTab('home')} 
          className={`nav-item ${tab === 'home' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <HomeIcon size={22} />
          </span>
          <span className="nav-label">Главная</span>
        </button>
        <button 
          onClick={() => setTab('book')} 
          className={`nav-item ${tab === 'book' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <CalendarIcon size={22} />
          </span>
          <span className="nav-label">Записаться</span>
        </button>
        <button 
          onClick={() => setTab('bookings')} 
          className={`nav-item ${tab === 'bookings' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <BookingsIcon size={22} />
          </span>
          <span className="nav-label">Мои записи</span>
        </button>
        <button 
          onClick={() => setTab('portfolio')} 
          className={`nav-item ${tab === 'portfolio' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <HeartIcon size={22} />
          </span>
          <span className="nav-label">Портфолио</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
