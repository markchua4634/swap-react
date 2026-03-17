export default function BottomNav({ active, onNavigate }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'browse', icon: '🔍', label: 'Browse' },
    { id: 'post', icon: '+', label: 'Post', special: true },
    { id: 'orders', icon: '📦', label: 'Orders' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div style={styles.nav}>
      {tabs.map(tab => (
        <button key={tab.id} style={styles.btn} onClick={() => onNavigate(tab.id)}>
          {tab.special ? (
            <div style={styles.postBtn}><span style={{ fontSize: 24, color: '#000', fontWeight: 300 }}>+</span></div>
          ) : (
            <>
              <span style={{ fontSize: 22 }}>{tab.icon}</span>
              <span style={{ ...styles.label, color: active === tab.id ? '#f0c040' : '#666' }}>{tab.label}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

const styles = {
  nav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#111', borderTop: '1px solid #2a2a2a',
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
    zIndex: 100,
  },
  btn: { background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', padding: '4px 12px' },
  label: { fontSize: 10, fontWeight: 500 },
  postBtn: { width: 52, height: 52, borderRadius: '50%', background: '#f0c040', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
};
