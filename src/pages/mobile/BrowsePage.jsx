import { useState, useEffect } from 'react';
import { Item, Category } from '../../lib/base44';

export default function BrowsePage({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filter, setFilter] = useState('all'); // all, swap, sale
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [itemsData, catsData] = await Promise.all([
        Item.filter({ status: 'available' }, { limit: 50, sort: { created_date: -1 } }),
        Category.filter({ is_active: true }, { sort: { sort_order: 1 } }),
      ]);
      setItems(itemsData);
      setCategories(catsData);
    } catch (e) {}
    setLoading(false);
  };

  const filtered = items.filter(item => {
    const matchSearch = !search || item.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchFilter = filter === 'all' || item.listing_type === filter;
    return matchSearch && matchCat && matchFilter;
  });

  return (
    <div style={styles.page}>
      <div style={styles.header}><h1 style={styles.title}>Browse</h1></div>

      <div style={styles.searchWrap}>
        <span>🔍</span>
        <input style={styles.search} placeholder="Search amulets..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={styles.filterRow}>
        {['all', 'swap', 'sale'].map(f => (
          <button key={f} style={filter === f ? styles.filterActive : styles.filter} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'swap' ? '🔄 Swap' : '💰 Sale'}
          </button>
        ))}
      </div>

      <div style={styles.cats}>
        <button style={activeCategory === 'all' ? styles.catActive : styles.cat} onClick={() => setActiveCategory('all')}>All</button>
        {categories.map(c => (
          <button key={c.id} style={activeCategory === c.slug ? styles.catActive : styles.cat} onClick={() => setActiveCategory(c.slug)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <p style={styles.resultCount}>{filtered.length} amulets found</p>

      <div style={styles.grid}>
        {loading ? <p style={styles.empty}>Loading...</p> : filtered.length === 0 ? <p style={styles.empty}>No results</p> : filtered.map(item => (
          <div key={item.id} style={styles.card} onClick={() => onNavigate('item', item)}>
            <div style={styles.imgWrap}>
              {item.images?.[0] ? <img src={item.images[0]} alt={item.title} style={styles.img} /> : <div style={styles.noImg}>⛩️</div>}
              {item.is_boosted && <span style={styles.boost}>⭐</span>}
              <span style={item.listing_type === 'sale' ? styles.saleBadge : styles.swapBadge}>{item.listing_type === 'sale' ? `RM${item.sale_price}` : '🔄'}</span>
            </div>
            <div style={styles.cardBody}>
              <p style={styles.cardTitle}>{item.title}</p>
              <p style={styles.cardCat}>{item.category}</p>
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
  searchWrap: { margin: '8px 16px', background: '#1a1a1a', borderRadius: 12, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, border: '1px solid #2a2a2a' },
  search: { flex: 1, background: 'transparent', border: 'none', padding: '13px 0', color: '#fff', fontSize: 14, outline: 'none' },
  filterRow: { display: 'flex', gap: 8, padding: '10px 16px' },
  filter: { padding: '8px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, color: '#888', fontSize: 13, cursor: 'pointer' },
  filterActive: { padding: '8px 16px', background: '#f0c040', border: 'none', borderRadius: 20, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  cats: { display: 'flex', gap: 8, padding: '4px 16px 8px', overflowX: 'auto', scrollbarWidth: 'none' },
  cat: { padding: '7px 12px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, color: '#888', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' },
  catActive: { padding: '7px 12px', background: '#f0c040', border: 'none', borderRadius: 20, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  resultCount: { color: '#888', fontSize: 12, padding: '0 16px 8px', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' },
  card: { background: '#1a1a1a', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid #2a2a2a' },
  imgWrap: { position: 'relative', aspectRatio: '1', background: '#111' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 },
  boost: { position: 'absolute', top: 6, left: 6, fontSize: 14 },
  saleBadge: { position: 'absolute', bottom: 6, right: 6, background: '#f0c040', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 6px', borderRadius: 6 },
  swapBadge: { position: 'absolute', bottom: 6, right: 6, background: '#2a2a2a', color: '#fff', fontSize: 12, padding: '3px 6px', borderRadius: 6 },
  cardBody: { padding: '10px 12px' },
  cardTitle: { color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardCat: { color: '#888', fontSize: 11, margin: 0, textTransform: 'uppercase' },
  empty: { color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: 40 },
};
