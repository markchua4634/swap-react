import { useState } from 'react';
import { auth } from '../../api/base44';

export default function LoginPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signin') await auth.signInWithEmail(email, password);
      else await auth.signUpWithEmail(email, password);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await auth.signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>⛩️</div>
        <h1 style={styles.title}>SwapHub</h1>
        <p style={styles.subtitle}>SACRED EXCHANGE</p>
      </div>

      <div style={styles.tabs}>
        <button style={mode === 'signin' ? styles.tabActive : styles.tab} onClick={() => setMode('signin')}>Sign In</button>
        <button style={mode === 'signup' ? styles.tabActive : styles.tab} onClick={() => setMode('signup')}>Sign Up</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.btnPrimary} type="submit" disabled={loading}>
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div style={styles.divider}><span>or</span></div>

      <button style={styles.btnGoogle} onClick={handleGoogle}>
        <span style={{ marginRight: 8 }}>G</span> Continue with Google
      </button>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' },
  header: { textAlign: 'center', marginBottom: 32 },
  logo: { fontSize: 60, marginBottom: 12 },
  title: { color: '#f0c040', fontSize: 32, fontWeight: 700, margin: 0 },
  subtitle: { color: '#888', fontSize: 11, letterSpacing: 4, marginTop: 4 },
  tabs: { display: 'flex', background: '#1a1a1a', borderRadius: 12, padding: 4, marginBottom: 24, width: '100%', maxWidth: 360 },
  tab: { flex: 1, padding: '12px 0', border: 'none', background: 'transparent', color: '#888', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 600 },
  tabActive: { flex: 1, padding: '12px 0', border: 'none', background: '#f0c040', color: '#000', borderRadius: 10, cursor: 'pointer', fontSize: 15, fontWeight: 700 },
  form: { width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 },
  input: { width: '100%', padding: '16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  error: { color: '#ff6b6b', fontSize: 13, margin: 0 },
  btnPrimary: { padding: '16px', background: '#f0c040', border: 'none', borderRadius: 12, color: '#000', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  divider: { color: '#444', margin: '20px 0', fontSize: 13 },
  btnGoogle: { width: '100%', maxWidth: 360, padding: '16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
