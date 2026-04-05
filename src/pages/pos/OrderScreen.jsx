import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useConfigStore } from '../../store/useConfigStore';
import PaymentFlow from './PaymentFlow';
import { Plus, Minus, Trash2, Send, Search, Tag, QrCode as QrCodeIcon, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const OrderScreen = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { products, categories } = useProductStore();
  const { orders, currentSession, updateOrderItems, sendOrderToKitchen } = useOrderStore();
  const { posSettings } = useConfigStore();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const order = orders.find(o => String(o.tableId) === String(tableId) && o.status !== 'paid' && o.sessionId === currentSession?.id);

  useEffect(() => {
    if (!order && !showPayment) {
       navigate('/pos/floor');
    }
  }, [order, navigate, showPayment]);

  if (!order) return null;

  const currentItems = order.items || [];
  
  const subtotal = currentItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * (posSettings.taxRate / 100);
  const total = subtotal + tax;

  const handleUpdateCart = (newItems) => {
    const newSubtotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newTotal = newSubtotal + (newSubtotal * (posSettings.taxRate / 100));
    updateOrderItems(order.id, newItems, newTotal);
  };

  const handleAddProduct = (product) => {
    const existing = currentItems.find(i => i.productId === product.id);
    if (existing) {
      handleUpdateCart(currentItems.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
       handleUpdateCart([...currentItems, { productId: product.id, name: product.name, price: product.price, quantity: 1, category: product.category }]);
    }
  };

  const handleChangeQty = (productId, delta) => {
    const existing = currentItems.find(i => i.productId === productId);
    if (!existing) return;
    
    if (existing.quantity + delta <= 0) {
       handleUpdateCart(currentItems.filter(i => i.productId !== productId));
    } else {
       handleUpdateCart(currentItems.map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i));
    }
  };

  const visibleProducts = products.filter(p => {
     const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
     return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', height: '100%', gap: '1.5rem', margin: '-1.5rem' }}>
      
      {/* Left side: Products Grid Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', padding: '1.5rem' }}>
        
        {/* Top Controls Toolbar */}
        <div className="flex-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
           <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', flex: 1 }}>
              <button 
                 className={`btn ${activeCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`} 
                 style={{ borderRadius: 'var(--radius-full)' }}
                 onClick={() => setActiveCategory('All')}
              >
                 All Items
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
           </div>
           
           <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input-base" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
              />
           </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid-cols-4" style={{ overflowY: 'auto', paddingRight: '0.5rem', alignContent: 'start' }}>
           {visibleProducts.map(p => (
              <div 
                key={p.id} 
                className="panel product-card" 
                style={{ display: 'flex', flexDirection: 'column', height: '140px', padding: '1.25rem', userSelect: 'none' }}
                onClick={() => handleAddProduct(p)}
              >
                 <h4 style={{ flex: 1, fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{p.name}</h4>
                 <div className="flex-between" style={{ marginTop: 'auto' }}>
                    <span style={{ color: 'var(--text-inverse)', fontWeight: '700', fontSize: '1.125rem' }}>${p.price.toFixed(2)}</span>
                    <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                       {p.category}
                    </span>
                 </div>
              </div>
           ))}
           {visibleProducts.length === 0 && (
              <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                 No products found matching criteria.
              </div>
           )}
        </div>
      </div>

      {/* Right side: Modern Receipt Cart */}
      <div style={{ width: '420px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface)', borderLeft: '1px solid var(--border-color)' }}>
         <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-header)' }}>
            <div className="flex-between">
               <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Order details</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>#{order.id}</p>
               </div>
               <div className="flex-row" style={{ gap: '0.5rem' }}>
                  <button className="btn btn-ghost" onClick={() => setShowQr(true)} title="Show Self-Order QR">
                     <QrCodeIcon size={20} />
                  </button>
                  <span className="badge" style={{ backgroundColor: 'rgba(221, 107, 32, 0.2)', color: 'var(--status-warning)' }}>
                     {order.kitchenStatus || 'Draft'}
                  </span>
               </div>
            </div>
         </div>
         
         <div className="receipt-area" style={{ flex: 1, overflowY: 'auto', margin: '1rem', padding: '0', backgroundColor: 'transparent', boxShadow: 'none', color: 'var(--text-main)' }}>
            {currentItems.length === 0 ? (
               <div className="flex-center flex-col" style={{ height: '100%', color: 'var(--text-muted)' }}>
                  <Tag size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <p>Cart is currently empty</p>
               </div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentItems.map(item => (
                     <div key={item.productId} className="panel" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid var(--border-color)' }}>
                        <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                           <span style={{ fontWeight: '600', fontSize: '1rem' }}>{item.name}</span>
                           <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex-between">
                           <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>${item.price.toFixed(2)} / each</span>
                           <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F1115', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                              <button className="btn-ghost" style={{ padding: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex' }} onClick={() => handleChangeQty(item.productId, -1)}>
                                 {item.quantity === 1 ? <Trash2 size={16} color="var(--status-danger)" /> : <Minus size={16} color="var(--text-main)" />}
                              </button>
                              <span style={{ fontWeight: 'bold', width: '32px', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</span>
                              <button className="btn-ghost" style={{ padding: '0.375rem', border: 'none', cursor: 'pointer', display: 'flex' }} onClick={() => handleChangeQty(item.productId, 1)}>
                                 <Plus size={16} color="var(--text-main)" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Checkout Section Totals */}
         <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-header)' }}>
            <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
               <span>Subtotal</span>
               <span className="mono-text">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
               <span>Tax ({posSettings.taxRate}%)</span>
               <span className="mono-text">${tax.toFixed(2)}</span>
            </div>
            <div className="flex-between" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-inverse)' }}>
               <span>Total</span>
               <span className="mono-text">${total.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <button 
                 className="btn btn-secondary" 
                 style={{ padding: '1rem', fontSize: '1rem', fontWeight: '600', height: '100%', flexDirection: 'column' }} 
                 disabled={currentItems.length === 0 || order.status !== 'draft'}
                 onClick={() => sendOrderToKitchen(order.id)}
               >
                 <Send size={20} style={{ marginBottom: '0.25rem' }} />
                 {order.status === 'sent' ? 'Sent' : 'Kitchen'}
               </button>
               <button 
                 className="btn btn-success" 
                 style={{ padding: '1rem', fontSize: '1.25rem', fontWeight: '700', border: 'none', boxShadow: '0 4px 14px rgba(56, 161, 105, 0.4)' }} 
                 disabled={currentItems.length === 0}
                 onClick={() => setShowPayment(true)}
               >
                 Pay
               </button>
            </div>
         </div>

         {showPayment && <PaymentFlow order={order} total={total} onClose={() => setShowPayment(false)} />}
      </div>

      {showQr && (
         <div className="flex-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}>
            <div className="panel animate-slide-down" style={{ padding: '2rem', textAlign: 'center', position: 'relative', width: '400px' }}>
               <button className="btn-ghost flex-center" style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.25rem', border: 'none', cursor: 'pointer' }} onClick={() => setShowQr(false)}>
                  <X size={20} />
               </button>
               <h2 style={{ marginBottom: '0.5rem' }}>Self-Order QR</h2>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>Guests can scan this to order from their mobile devices straight to the kitchen.</p>
               <div style={{ padding: '1rem', backgroundColor: 'white', display: 'inline-block', borderRadius: 'var(--radius-md)' }}>
                  <QRCodeSVG value={`http://localhost:5173/self-order/${tableId}`} size={200} />
               </div>
               <p className="mono-text" style={{ marginTop: '1.5rem', color: 'var(--accent-primary)', fontSize: '0.875rem' }}>
                  http://localhost:5173/self-order/{tableId}
               </p>
            </div>
         </div>
      )}
    </div>
  );
};

export default OrderScreen;
