import { useState } from 'react';
import BottomNav from '../../components/mobile/BottomNav';
import HomePage from './HomePage';
import BrowsePage from './BrowsePage';
import ProfilePage from './ProfilePage';
import OrdersPage from './OrdersPage';

export default function MobileApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigate = (page) => {
    if (['home', 'browse', 'orders', 'profile'].includes(page)) {
      setActiveTab(page);
    }
    // post, item detail etc. — to be added
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':    return <HomePage onNavigate={handleNavigate} />;
      case 'browse':  return <BrowsePage onNavigate={handleNavigate} />;
      case 'orders':  return <OrdersPage user={user} />;
      case 'profile': return <ProfilePage user={user} onNavigate={handleNavigate} onLogout={onLogout} />;
      default:        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {renderPage()}
      <BottomNav active={activeTab} onNavigate={handleNavigate} />
    </div>
  );
}
