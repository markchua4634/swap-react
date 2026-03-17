import { useAuth } from './hooks/useAuth';
import { useIsMobile } from './hooks/useIsMobile';
import LoginPage from './pages/mobile/LoginPage';
import MobileApp from './pages/mobile/MobileApp';
import DesktopRedirect from './pages/desktop/DesktopRedirect';

export default function App() {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  if (loading) return <Splash />;

  // Desktop → redirect to main Base44 app
  if (!isMobile) return <DesktopRedirect />;

  // Mobile → show our custom mobile UI
  if (!user) return <LoginPage />;

  return <MobileApp user={user} />;
}

function Splash() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ fontSize: 64 }}>⛩️</div>
      <h1 style={{ color: '#f0c040', fontSize: 28, fontWeight: 700, margin: 0 }}>SwapHub</h1>
      <p style={{ color: '#888', fontSize: 12, letterSpacing: 3 }}>LOADING...</p>
    </div>
  );
}
