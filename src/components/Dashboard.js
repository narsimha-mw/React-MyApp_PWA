import React, { useState } from 'react';
import './Dashboard.css';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', quantity: 50, stock: 35, price: 79.99, description: 'Over-ear noise cancelling wireless headphones with 30hr battery life.' },
  { id: 2, name: 'Mechanical Keyboard', quantity: 30, stock: 18, price: 129.99, description: 'TKL mechanical keyboard with RGB backlight and blue switches.' },
  { id: 3, name: 'USB-C Hub', quantity: 100, stock: 72, price: 39.99, description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader and PD charging.' },
  { id: 4, name: 'Webcam 4K', quantity: 40, stock: 12, price: 149.99, description: '4K autofocus webcam with built-in dual mic and privacy cover.' },
  { id: 5, name: 'Desk Lamp LED', quantity: 60, stock: 45, price: 29.99, description: 'Touch-control LED desk lamp with 5 brightness levels and USB charging port.' },
  { id: 6, name: 'Laptop Stand', quantity: 80, stock: 55, price: 49.99, description: 'Adjustable aluminium laptop stand compatible with 10-17 inch laptops.' },
  { id: 7, name: 'Wireless Mouse', quantity: 90, stock: 67, price: 24.99, description: 'Ergonomic silent wireless mouse with 12-month battery life.' },
  { id: 8, name: 'Monitor 27"', quantity: 20, stock: 8, price: 349.99, description: '27-inch QHD IPS monitor with 144Hz refresh rate and AMD FreeSync.' },
  { id: 9, name: 'Cable Management Kit', quantity: 200, stock: 180, price: 14.99, description: 'Velcro cable ties, clips and sleeves for a clean desk setup.' },
  { id: 10, name: 'Portable SSD 1TB', quantity: 45, stock: 30, price: 99.99, description: 'USB 3.2 Gen2 portable SSD with up to 1050MB/s read speed.' },
];

const SAMPLE_ORDERS = [
  { id: 'ORD-001', date: '2026-03-15', items: 3, total: 259.97, status: 'Delivered' },
  { id: 'ORD-002', date: '2026-03-28', items: 1, total: 149.99, status: 'Shipped' },
  { id: 'ORD-003', date: '2026-04-01', items: 2, total: 79.98, status: 'Processing' },
];

const SAMPLE_INVOICES = [
  { id: 'INV-2026-001', date: '2026-03-15', amount: 259.97, status: 'Paid' },
  { id: 'INV-2026-002', date: '2026-03-28', amount: 149.99, status: 'Paid' },
  { id: 'INV-2026-003', date: '2026-04-01', amount: 79.98, status: 'Pending' },
];

const SAMPLE_PAYMENTS = [
  { id: 'PAY-001', date: '2026-03-15', method: 'Visa •••• 4242', amount: 259.97, status: 'Success' },
  { id: 'PAY-002', date: '2026-03-28', method: 'PayPal', amount: 149.99, status: 'Success' },
  { id: 'PAY-003', date: '2026-04-01', method: 'Mastercard •••• 1234', amount: 79.98, status: 'Pending' },
];

const TABS = ['Profile', 'Products', 'Orders', 'Invoices', 'Payments'];
const EMPTY_FORM = { name: '', quantity: '', stock: '', price: '', description: '' };

// Cart SVG icon
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

export default function Dashboard({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('Profile');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [modalState, setModalState] = useState({ open: false, mode: null, product: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [cart, setCart] = useState([]);           // [{...product, qty}]
  const [cartOpen, setCartOpen] = useState(false);

  const username = userEmail.split('@')[0];
  const domain = '@' + userEmail.split('@')[1];

  // ---------- Cart ----------
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  // ---------- Product CRUD ----------
  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setModalState({ open: true, mode: 'add', product: null }); };
  const openEdit = (product) => {
    setForm({ ...product, quantity: String(product.quantity), stock: String(product.stock), price: String(product.price) });
    setFormErrors({});
    setModalState({ open: true, mode: 'edit', product });
  };
  const openView = (product) => setModalState({ open: true, mode: 'view', product });
  const closeModal = () => setModalState({ open: false, mode: null, product: null });

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) errors.quantity = 'Valid quantity required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) errors.stock = 'Valid stock required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errors.price = 'Valid price required';
    if (!form.description.trim()) errors.description = 'Description is required';
    return errors;
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    if (modalState.mode === 'add') {
      setProducts(prev => [...prev, {
        id: Date.now(), name: form.name.trim(), quantity: Number(form.quantity),
        stock: Number(form.stock), price: parseFloat(form.price), description: form.description.trim(),
      }]);
    } else {
      setProducts(prev => prev.map(p =>
        p.id === modalState.product.id
          ? { ...p, name: form.name.trim(), quantity: Number(form.quantity), stock: Number(form.stock), price: parseFloat(form.price), description: form.description.trim() }
          : p
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setDeleteConfirm(null); };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-icon">&#128274;</span>
          <span className="sidebar-brand">E MyApp</span>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button key={tab} className={`sidebar-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              <span className="sidebar-tab-icon">{tabIcon(tab)}</span>
              {tab}
            </button>
          ))}
        </nav>
        <button className="sidebar-logout" onClick={onLogout}>
          <span>&#x2192;</span> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">{activeTab}</h1>
            <p className="dash-subtitle">
              <strong className="header-username">{username}</strong>
              <span className="header-domain">{domain}</span>
            </p>
          </div>

          {/* Cart Icon */}
          <div className="cart-area">
            <button className="cart-btn" onClick={() => setCartOpen(o => !o)}>
              <CartIcon />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Cart Dropdown */}
            {cartOpen && (
              <div className="cart-dropdown">
                <div className="cart-dropdown-header">
                  <strong>Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})</strong>
                  <button className="modal-close" onClick={() => setCartOpen(false)}>&#x2715;</button>
                </div>
                {cart.length === 0 ? (
                  <p className="cart-empty">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="cart-list">
                      {cart.map(c => (
                        <li key={c.id} className="cart-item">
                          <div className="cart-item-info">
                            <span className="cart-item-name">{c.name}</span>
                            <span className="cart-item-meta">Qty: {c.qty} &nbsp;|&nbsp; ₹{(c.price * c.qty).toFixed(2)}</span>
                          </div>
                          <button className="cart-remove" onClick={() => removeFromCart(c.id)} title="Remove">&#x2715;</button>
                        </li>
                      ))}
                    </ul>
                    <div className="cart-total">
                      <span>Total</span>
                      <strong>₹{cartTotal.toFixed(2)}</strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="dash-content">
          {activeTab === 'Profile' && <ProfileTab email={userEmail} />}
          {activeTab === 'Products' && (
            <ProductsTab products={products} onAdd={openAdd} onEdit={openEdit} onView={openView}
              onDelete={(id) => setDeleteConfirm(id)} onAddToCart={addToCart} />
          )}
          {activeTab === 'Orders' && <OrdersTab orders={SAMPLE_ORDERS} />}
          {activeTab === 'Invoices' && <InvoicesTab invoices={SAMPLE_INVOICES} />}
          {activeTab === 'Payments' && <PaymentsTab payments={SAMPLE_PAYMENTS} />}
        </div>
      </main>

      {/* Product Modal */}
      {modalState.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalState.mode === 'add' ? 'Add Product' : modalState.mode === 'edit' ? 'Edit Product' : 'Product Details'}</h2>
              <button className="modal-close" onClick={closeModal}>&#x2715;</button>
            </div>
            {modalState.mode === 'view' ? (
              <div className="modal-view">
                <div className="view-row"><span>Name</span><strong>{modalState.product.name}</strong></div>
                <div className="view-row"><span>Quantity</span><strong>{modalState.product.quantity}</strong></div>
                <div className="view-row"><span>Stock</span><strong>{modalState.product.stock}</strong></div>
                <div className="view-row"><span>Price</span><strong>₹{modalState.product.price.toFixed(2)}</strong></div>
                <div className="view-row"><span>Description</span><strong>{modalState.product.description}</strong></div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={closeModal}>Close</button>
                  <button className="btn-edit" onClick={() => { closeModal(); openEdit(modalState.product); }}>Edit</button>
                </div>
              </div>
            ) : (
              <div className="modal-form">
                {[
                  { label: 'Product Name', name: 'name', type: 'text', placeholder: 'e.g. Wireless Headphones' },
                  { label: 'Quantity', name: 'quantity', type: 'number', placeholder: 'e.g. 50' },
                  { label: 'Stock', name: 'stock', type: 'number', placeholder: 'e.g. 35' },
                  { label: 'Price (₹)', name: 'price', type: 'number', placeholder: 'e.g. 79.99' },
                ].map(field => (
                  <div className="modal-field" key={field.name}>
                    <label>{field.label}</label>
                    <input type={field.type} name={field.name} value={form[field.name]}
                      onChange={handleFormChange} placeholder={field.placeholder}
                      className={formErrors[field.name] ? 'input-error' : ''}
                      min={field.type === 'number' ? '0' : undefined}
                      step={field.name === 'price' ? '0.01' : '1'} />
                    {formErrors[field.name] && <span className="error-msg">{formErrors[field.name]}</span>}
                  </div>
                ))}
                <div className="modal-field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange}
                    placeholder="Product description..." rows={3}
                    className={formErrors.description ? 'input-error' : ''} />
                  {formErrors.description && <span className="error-msg">{formErrors.description}</span>}
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button className="btn-primary-sm" onClick={handleSave}>
                    {modalState.mode === 'add' ? 'Add Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Product</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>&#x2715;</button>
            </div>
            <p className="delete-msg">Are you sure you want to delete <strong>{products.find(p => p.id === deleteConfirm)?.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Tab Components ----

function ProfileTab({ email }) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">{email.charAt(0).toUpperCase()}</div>
      <h2 className="profile-name">{email.split('@')[0]}</h2>
      <p className="profile-email">{email}</p>
      <div className="profile-stats">
        <div className="stat"><span className="stat-value">3</span><span className="stat-label">Orders</span></div>
        <div className="stat"><span className="stat-value">₹489.94</span><span className="stat-label">Spent</span></div>
        <div className="stat"><span className="stat-value">Gold</span><span className="stat-label">Tier</span></div>
      </div>
      <div className="profile-info">
        <div className="info-row"><span>Member since</span><span>January 2025</span></div>
        <div className="info-row"><span>Account status</span><span className="badge-active">Active</span></div>
        <div className="info-row"><span>Phone</span><span>+91 1234567890</span></div>
        <div className="info-row"><span>Location</span><span>Bangalore, India</span></div>
      </div>
    </div>
  );
}

function ProductsTab({ products, onAdd, onEdit, onView, onDelete, onAddToCart }) {
  return (
    <div>
      <div className="section-toolbar">
        <span className="section-count">{products.length} Products</span>
        <button className="btn-primary-sm" onClick={onAdd}>+ Add Product</button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Quantity</th><th>Stock</th>
              <th>Price</th><th>Description</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td className="td-name">{p.name}</td>
                <td>{p.quantity}</td>
                <td><span className={`stock-badge ${p.stock < 15 ? 'low' : 'ok'}`}>{p.stock}</span></td>
                <td>₹{p.price.toFixed(2)}</td>
                <td className="td-desc">{p.description}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-view" onClick={() => onView(p)}>View</button>
                    <button className="btn-edit" onClick={() => onEdit(p)}>Edit</button>
                    <button className="btn-danger-sm" onClick={() => onDelete(p.id)}>Delete</button>
                    <button className="btn-cart" onClick={() => onAddToCart(p)} title="Add to Cart">🛒</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td><strong>{o.id}</strong></td>
              <td>{o.date}</td>
              <td>{o.items}</td>
              <td>₹{o.total.toFixed(2)}</td>
              <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvoicesTab({ invoices }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead><tr><th>Invoice ID</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td><strong>{inv.id}</strong></td>
              <td>{inv.date}</td>
              <td>₹{inv.amount.toFixed(2)}</td>
              <td><span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentsTab({ payments }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead><tr><th>Payment ID</th><th>Date</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {payments.map(pay => (
            <tr key={pay.id}>
              <td><strong>{pay.id}</strong></td>
              <td>{pay.date}</td>
              <td>{pay.method}</td>
              <td>₹{pay.amount.toFixed(2)}</td>
              <td><span className={`status-badge ${pay.status.toLowerCase()}`}>{pay.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function tabIcon(tab) {
  const icons = { Profile: '👤', Products: '📦', Orders: '🛒', Invoices: '🧾', Payments: '💳' };
  return icons[tab] || '';
}
