import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', price: '', description: '', category: '', stock: 0, isAvailable: true };

function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadProducts = async (q = '') => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/products', { params: q ? { search: q } : {} });
      setProducts(res.data);
    } catch (err) {
      setError('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/api/v1/products/${editingId}`, payload);
      } else {
        await api.post('/api/v1/products', payload);
      }
      resetForm();
      loadProducts(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category || '',
      stock: product.stock,
      isAvailable: product.isAvailable,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await api.delete(`/api/v1/products/${id}`);
      loadProducts(search);
    } catch (err) {
      setError('Gagal menghapus produk');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Product Management</h1>
        <div style={styles.headerRight}>
          <span>Halo, <strong>{user?.name}</strong></span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Nama produk" value={form.name} onChange={handleChange} style={styles.input} required />
        <input name="price" type="number" step="0.01" placeholder="Harga" value={form.price} onChange={handleChange} style={styles.input} required />
        <input name="category" placeholder="Kategori" value={form.category} onChange={handleChange} style={styles.input} />
        <input name="stock" type="number" placeholder="Stok" value={form.stock} onChange={handleChange} style={styles.input} />
        <input name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} style={{ ...styles.input, flexBasis: '100%' }} />
        <label style={styles.checkboxLabel}>
          <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} />
          Tersedia
        </label>
        <button type="submit" style={styles.primaryBtn}>{editingId ? 'Update' : 'Tambah'} Produk</button>
        {editingId && <button type="button" onClick={resetForm} style={styles.secondaryBtn}>Batal</button>}
      </form>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.secondaryBtn}>Cari</button>
      </form>

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nama</th>
              <th style={styles.th}>Harga</th>
              <th style={styles.th}>Kategori</th>
              <th style={styles.th}>Stok</th>
              <th style={styles.th}>Tersedia</th>
              <th style={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td style={styles.td}>{p.category || '-'}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>{p.isAvailable ? '' : ''}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(p)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Hapus</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center' }}>Belum ada produk</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 960, margin: '0 auto', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  error: { backgroundColor: '#f8d7da', color: '#dc3545', padding: 12, borderRadius: 6, marginBottom: 16 },
  form: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' },
  searchForm: { display: 'flex', gap: 10, marginBottom: 16 },
  input: { padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 14, flex: '1 1 150px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 },
  primaryBtn: { padding: '9px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  secondaryBtn: { padding: '9px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  editBtn: { padding: '6px 12px', backgroundColor: '#ffc107', border: 'none', borderRadius: 4, marginRight: 6, cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', borderBottom: '2px solid #ddd', padding: 10, backgroundColor: '#f8f9fa' },
  td: { borderBottom: '1px solid #eee', padding: 10 },
};

export default ProductList;
