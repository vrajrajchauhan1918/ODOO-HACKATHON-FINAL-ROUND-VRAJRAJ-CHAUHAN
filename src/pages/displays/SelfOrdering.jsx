import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useConfigStore } from '../../store/useConfigStore';
import { useFloorStore } from '../../store/useFloorStore';
import { ShoppingBag, ChevronRight, CheckCircle2 } from 'lucide-react';

const SelfOrdering = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { products, categories } = useProductStore();
  const { createDraftOrder, orders, currentSession, updateOrderItems, sendOrderToKitchen } = useOrderStore();
  const { posSettings } = useConfigStore();
  const { tables } = useFloorStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [localCart, setLocalCart] = useState([]);
  const [isPlaced, setIsPlaced] = useState(false);

  // Validation
  const table = tables.find(t => t.id === tableId);
  useEffect(() => {
     if (!table || !currentSession) {
        // Mobile user scanned an invalid code or session is closed
     }
  }, [table, currentSession]);

  if (!table || !currentSession) {
     return (
        <div className="flex-center flex-col" style={{ height: '100vh', backgroundColor: 'var(--bg-main)', padding: '2rem' }}>
           <h1 style={{ color: 'var(--status-danger)', marginBottom: '1rem' }}>Unavailable</h1>
           <p style={{ color: 'var(--text-muted)' }}>The restaurant is currently not accepting mobile orders for this table. Please see a waiter.</p>
        </div>
     );
  }

  const handleAdd = (product) => {
     const existing = localCart.find(i => i.productId === product.id);
     if (existing) {
        setLocalCart(localCart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
     } else {
        setLocalCart([...localCart, { productId: product.id, name: product.name, price: product.price, quantity: 1, category: product.category }]);
     }
  };

  const handlePlaceOrder = () => {
     // Find existing draft order for table, or create one
     let draftOrder = orders.find(o => o.tableId === table.id && o.status === 'draft' && o.sessionId === currentSession?.id);
     
     if (!draftOrder) {
        createDraftOrder(table.id);
        draftOrder = useOrderStore.getState().orders.find(o => o.tableId === table.id && o.status === 'draft' && o.sessionId === currentSession?.id);
     }
     
     // Merge items (in real life, maybe distinct lines. Here we just add to draft)
     const existingItems = draftOrder.items || [];
     const mergedItems = [...existingItems];
     
     localCart.forEach(newItem => {
        const existing = mergedItems.find(i => i.productId === newItem.productId);
        if (existing) {
           existing.quantity += newItem.quantity;
        } else {
           mergedItems.push(newItem);
        }
     });

     const newSubtotal = mergedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
     const newTotal = newSubtotal + (newSubtotal * (posSettings.taxRate / 100));

     updateOrderItems(draftOrder.id, mergedItems, newTotal);
     sendOrderToKitchen(draftOrder.id);
     
     setLocalCart([]);
     setIsPlaced(true);
  };

  const totalCart = localCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  if (isPlaced) {
     return (
        <div className="flex-center flex-col animate-slide-down" style={{ height: '100vh', backgroundColor: 'var(--bg-main)', padding: '2rem', textAlign: 'center' }}>
           <CheckCircle2 size={80} color="var(--status-success)" style={{ marginBottom: '2rem' }} />
           <h1>Order Sent to Kitchen!</h1>
           <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.125rem' }}>Your items are being prepared. You can pay at the counter when you're ready.</p>
           <button className="btn btn-secondary" style={{ marginTop: '3rem' }} onClick={() => setIsPlaced(false)}>
              Order more items
           </button>
        </div>
     );
  }

  const visibleProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
       {/* Mobile Header */}
       <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-color)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{posSettings.companyName}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{table.name} · Table Order</p>
       </div>

       {/* Horizontal Categories */}
       <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', overflowX: 'auto', borderBottom: '1px solid var(--border-color)' }}>
           <button 
              className={`btn ${activeCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
              onClick={() => setActiveCategory('All')}
           >
              All
           </button>
           {categories.map(cat => (
             <button 
               key={cat}
               className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
               style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
               onClick={() => setActiveCategory(cat)}
             >
               {cat}
             </button>
           ))}
       </div>

       {/* Products List (Mobile Style) */}
       <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visibleProducts.map(p => (
             <div key={p.id} className="panel flex-between" style={{ padding: '1rem' }}>
                <div>
                   <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{p.name}</h3>
                   <span style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>${p.price.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }} onClick={() => handleAdd(p)}>
                   Add
                </button>
             </div>
          ))}
       </div>

       {/* Mobile Bottom Cart Drawer */}
       {localCart.length > 0 && (
          <div className="panel animate-slide-down" style={{ 
             borderTopLeftRadius: 'var(--radius-lg)', 
             borderTopRightRadius: 'var(--radius-lg)', 
             borderBottom: 'none', 
             borderLeft: 'none', borderRight: 'none',
             margin: 0, padding: '1.5rem', 
             backgroundColor: 'var(--bg-surface)' 
          }}>
             <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                   <ShoppingBag size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                   {localCart.reduce((sum, i) => sum + i.quantity, 0)} items
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>${totalCart.toFixed(2)}</span>
             </div>
             <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }} onClick={handlePlaceOrder}>
                Send to Kitchen <ChevronRight size={20} />
             </button>
          </div>
       )}
    </div>
  );
};

export default SelfOrdering;
