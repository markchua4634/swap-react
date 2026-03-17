import { useState, useEffect } from 'react';
import { Item, Category } from '../../api/base44';

export default function HomePage({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsData, catsData] = await Promise.all([
        Item.filter({ status: 'available' }, { limit: 30, sort: { created_date: -1 } }),
        Category.filter({ is_active: true }, { sort: { sort_order: 1 } }),
      ]);
      setItems(itemsData);
      setCategories(catsData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = items.filter(item => {
    const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerLogo}>⛩️ SwapHub</div>
          <div style={styles.headerSub}>Sacred Exchange</div>
        </div>
        <button style={styles.notifBtn} onClick={() => onNavigate('notifications')}>🔔</button>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          style={styles.search}
          placeholder="Search sacred amulets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div style={styles.cats}>
        <button style={activeCategory === 'all' ? styles.catActive : styles.cat} onClick={() => setActiveCategory('all')}>All</button>
        {categories.map(c => (
          <button key={c.id} style={activeCategory === c.slug ? styles.catActive : styles.cat} onClick={() => setActiveCategory(c.slug)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div style={styles.grid}>
        {loading ? (
          <p style={styles.loading}>Loading amulets...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.loading}>No amulets found</p>
        ) : (
          filtered.map(item => (
            <div key={item.id} style={styles.card} onClick={() => onNavigate('item', item)}>
              <div style={styles.cardImg}>
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.title} style={styles.img} />
                ) : (
                  <div style={styles.noImg}>⛩️</div>
                )}
                {item.is_boosted && <span style={styles.boostedBadge}>⭐ Featured</span>}
              </div>
              <div style={styles.cardBody}>
                <p style={styles.cardTitle}>{item.title}</p>
                <p style={styles.cardCat}>{item.category}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.listingType}>{item.listing_type === 'sale' ? `RM ${item.sale_price}` : '🔄 Swap'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#0a0a0a', minHeight: '100vh', paddingBottom: 80 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 8px' },
  headerLogo: { color: '#f0c040', fontSize: 18, fontWeight: 700 },
  headerSub: { color: '#888', fontSize: 11 },
  notifBtn: { background: '#1a1a1a', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 18, cursor: 'pointer' },
  searchWrap: { margin: '8px 16px', background: '#1a1a1a', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', border: '1px solid #2a2a2a' },
  searchIcon: { fontSize: 16, marginRight: 8 },
  search: { flex: 1, background: 'transparent', border: 'none', padding: '14px 0', color: '#fff', fontSize: 14, outline: 'none' },
  cats: { display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' },
  cat: { padding: '8px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, color: '#888', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' },
  catActive: { padding: '8px 14px', background: '#f0c040', border: 'none', borderRadius: 20, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' },
  card: { background: '#1a1a1a', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid #2a2a2a' },
  cardImg: { position: 'relative', aspectRatio: '1', background: '#111' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 },
  boostedBadge: { position: 'absolute', top: 6, left: 6, background: '#f0c040', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 6px', borderRadius: 6 },
  cardBody: { padding: '10px 12px' },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardCat: { color: '#888', fontSize: 11, margin: '0 0 8px', textTransform: 'uppercase' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  listingType: { color: '#f0c040', fontSize: 12, fontWeight: 700 },
  loading: { color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: 40 },
};
