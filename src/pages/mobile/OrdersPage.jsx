import { useState, useEffect } from 'react';
import { Order } from '../../api/base44';

export default function OrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('buying');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadOrders(); }, [user, tab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const field = tab === 'buying' ? 'buyer_email' : 'seller_email';
      const data = await Order.filter({ [field]: user.email }, { sort: { created_date: -1 } });
      setOrders(data);
    } catch (e) {}
    setLoading(false);
  };

  const statusColor = (s) => ({ pending: '#f0c040', active: '#4fc3f7', completed: '#81c784', cancelled: '#e57373', disputed: '#ff7043' }[s] || '#888');

  return (
    <div style={styles.page}>
      <div style={styles.header}><h1 style={styles.title}>My Orders</h1></div>

      <div style={styles.tabs}>
        <button style={tab === 'buying' ? styles.tabActive : styles.tab} onClick={() => setTab('buying')}>Buying</button>
        <button style={tab === 'selling' ? styles.tabActive : styles.tab} onClick={() => setTab('selling')}>Selling</button>
      </div>

      <div style={styles.list}>
        {loading ? <p style={styles.empty}>Loading...</p> : orders.length === 0 ? <p style={styles.empty}>No orders yet</p> : orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardImg}>
              {order.item_image ? <img src={order.item_image} alt="" style={styles.img} /> : <div style={styles.noImg}>📦</div>}
            </div>
            <div style={styles.cardInfo}>
              <p style={styles.itemTitle}>{order.item_title || 'Unknown Item'}</p>
              <p style={styles.orderType}>{order.type === 'swap' ? '🔄 Exchange' : '💰 Purchase'}</p>
              <p style={{ ...styles.status, color: statusColor(order.status) }}>{order.status?.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#0a0a0a', minHeight: '100vh', paddingBottom: 90 },
  header: { padding: '16px 16px 4px' },
  title: { color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 },
  tabs: { display: 'flex', background: '#1a1a1a', margin: '12px 16px', borderRadius: 12, padding: 4 },
  tab: { flex: 1, padding: '11px 0', background: 'transparent', border: 'none', color: '#888', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  tabActive: { flex: 1, padding: '11px 0', background: '#f0c040', border: 'none', color: '#000', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  list: { padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  card: { background: '#1a1a1a', borderRadius: 16, display: 'flex', gap: 12, padding: 12, border: '1px solid #2a2a2a' },
  cardImg: { width: 70, height: 70, borderRadius: 12, overflow: 'hidden', background: '#111', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
  cardInfo: { flex: 1 },
  itemTitle: { color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 4px' },
  orderType: { color: '#888', fontSize: 12, margin: '0 0 4px' },
  status: { fontSize: 11, fontWeight: 700, margin: 0 },
  empty: { color: '#888', textAlign: 'center', padding: 40 },
};
