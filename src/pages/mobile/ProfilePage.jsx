import { useState, useEffect } from 'react';
import { Transaction, UserAchievement, Review } from '../../api/base44';

export default function ProfilePage({ user, onNavigate, onLogout }) {
  const [stats, setStats] = useState({ trades: 0, rating: '—', coins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const [txns, reviews] = await Promise.all([
        Transaction.filter({ user_email: user.email }),
        Review.filter({ reviewed_email: user.email }),
      ]);
      const coinBalance = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
      const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : '—';
      setStats({ trades: reviews.length, rating: avgRating, coins: Math.max(0, coinBalance) });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const initial = user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <span style={styles.topTitle}>Profile</span>
        <button style={styles.signOutBtn} onClick={onLogout}>Sign Out</button>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>{initial}</div>
        <h2 style={styles.name}>{user?.full_name || 'User'}</h2>
        <p style={styles.email}>{user?.email}</p>
        <div style={styles.badges}>
          <span style={styles.badge}>⭐ Trusted Trader</span>
          <span style={styles.badge2}>🏅 Level 5</span>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.stat}><span style={styles.statNum}>0</span><span style={styles.statLabel}>Listings</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><span style={styles.statNum}>{stats.trades}</span><span style={styles.statLabel}>Trades</span></div>
          <div style={styles.statDivider} />
          <div style={styles.stat}><span style={styles.statNum}>{stats.rating}</span><span style={styles.statLabel}>Rating</span></div>
        </div>
      </div>

      <div style={styles.walletCard}>
        <div style={styles.walletTop}>
          <span style={styles.walletLabel}>🪙 Coin Wallet</span>
          <button style={styles.cashoutBtn}>Cashout</button>
        </div>
        <div style={styles.coinAmount}>{loading ? '...' : stats.coins.toLocaleString()}</div>
        <div style={styles.coinSub}>≈ RM {(stats.coins * 0.01).toFixed(2)} cashout value</div>
      </div>

      {[
        { icon: '📋', label: 'My Listings', page: 'my-listings' },
        { icon: '❤️', label: 'Wishlist', page: 'wishlist' },
        { icon: '🏆', label: 'Achievements', page: 'achievements' },
        { icon: '👥', label: 'Referrals', page: 'referrals' },
        { icon: '📦', label: 'My Orders', page: 'orders' },
      ].map(item => (
        <div key={item.page} style={styles.menuItem} onClick={() => onNavigate(item.page)}>
          <span style={styles.menuIcon}>{item.icon}</span>
          <span style={styles.menuLabel}>{item.label}</span>
          <span style={styles.menuArrow}>›</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { background: '#0a0a0a', minHeight: '100vh', paddingBottom: 100 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: 700 },
  signOutBtn: { background: 'transparent', border: '1px solid #333', color: '#888', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  profileCard: { margin: '0 16px 16px', background: '#1a1a1a', borderRadius: 20, padding: '24px 20px', textAlign: 'center', border: '1px solid #2a2a2a' },
  avatar: { width: 80, height: 80, borderRadius: 20, background: '#f0c040', color: '#000', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  name: { color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 4px' },
  email: { color: '#888', fontSize: 13, margin: '0 0 12px' },
  badges: { display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 },
  badge: { background: 'rgba(240,192,64,0.15)', border: '1px solid rgba(240,192,64,0.4)', color: '#f0c040', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  badge2: { background: 'rgba(100,100,255,0.15)', border: '1px solid rgba(100,100,255,0.4)', color: '#aab', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  statsRow: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { color: '#f0c040', fontSize: 22, fontWeight: 700 },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 30, background: '#2a2a2a' },
  walletCard: { margin: '0 16px 16px', background: '#1a1a1a', borderRadius: 20, padding: '20px', border: '1px solid #2a2a2a' },
  walletTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  walletLabel: { color: '#fff', fontSize: 16, fontWeight: 600 },
  cashoutBtn: { background: 'transparent', border: '1px solid #f0c040', color: '#f0c040', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  coinAmount: { color: '#f0c040', fontSize: 36, fontWeight: 800, lineHeight: 1 },
  coinSub: { color: '#888', fontSize: 12, marginTop: 4 },
  menuItem: { display: 'flex', alignItems: 'center', padding: '18px 20px', margin: '0 16px 8px', background: '#1a1a1a', borderRadius: 16, cursor: 'pointer', border: '1px solid #2a2a2a' },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuLabel: { flex: 1, color: '#fff', fontSize: 15, fontWeight: 500 },
  menuArrow: { color: '#444', fontSize: 22 },
};
