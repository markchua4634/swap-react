import { useEffect } from 'react';

export default function DesktopRedirect() {
  useEffect(() => {
    window.location.replace('https://swap-amulets.base44.app');
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.logo}>⛩️</div>
      <h1 style={styles.title}>SwapHub</h1>
      <p style={styles.sub}>Redirecting to desktop app...</p>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo: { fontSize: 64 },
  title: { color: '#f0c040', fontSize: 32, fontWeight: 700, margin: 0 },
  sub: { color: '#888', fontSize: 14 },
};
