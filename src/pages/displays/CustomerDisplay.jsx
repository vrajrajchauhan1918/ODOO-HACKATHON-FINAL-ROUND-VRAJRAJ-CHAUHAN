import React, { useEffect, useState } from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useConfigStore } from '../../store/useConfigStore';
import { CheckCircle2 } from 'lucide-react';

const CustomerDisplay = () => {
  const { currentSession, orders } = useOrderStore();
  const { posSettings } = useConfigStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
     const timer = setInterval(() => setTime(new Date()), 1000);
     return () => clearInterval(timer);
  }, []);
  
  if (!currentSession) {
    return (
       <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
         <h1 style={{ fontSize: '3rem', color: 'var(--text-inverse)', letterSpacing: '-0.03em' }}>Welcome to {posSettings.companyName}</h1>
         <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '1rem' }}>Terminal Offline</p>
       </div>
    );
  }

  const sessionOrders = orders.filter(o => o.sessionId === currentSession.id);
  
  // Prioritize actively paid orders from the last 15 seconds
  const recentlyPaid = [...sessionOrders].reverse().find(o => o.status === 'paid' && o.paidAt && (new Date() - new Date(o.paidAt)) < 15000);
  
  let displayOrder = recentlyPaid ||
                     [...sessionOrders].reverse().find(o => (o.status === 'draft' && o.items.length > 0) || o.status === 'sent') ||
                     [...sessionOrders].reverse().find(o => o.status === 'paid');
                     
  if(!displayOrder) displayOrder = sessionOrders[sessionOrders.length - 1];

  if (!displayOrder) {
     return (
       <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
         <h1 style={{ fontSize: '3.5rem', color: 'var(--text-inverse)' }}>{posSettings.companyName}</h1>
         <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem', marginTop: '1rem' }}>We will be right with you!</p>
       </div>
    );
  }

  const isPaid = displayOrder.status === 'paid';
  const tax = displayOrder.totalAmount - (displayOrder.totalAmount / (1 + (posSettings.taxRate / 100)));
  const subtotal = displayOrder.totalAmount - tax;
  


  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
       {/* Left Brand Area */}
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>
             {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <h1 style={{ fontSize: '4.5rem', color: 'var(--text-inverse)', marginBottom: '3rem', textAlign: 'center', fontWeight: '700', letterSpacing: '-0.02em' }}>
             {posSettings.companyName}
          </h1>

          {isPaid && (
             <div className="panel animate-slide-down" style={{ padding: '3rem 4rem', textAlign: 'center', backgroundColor: 'rgba(56, 161, 105, 0.05)', borderColor: 'var(--status-success)', borderWidth: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircle2 size={64} color="var(--status-success)" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ color: 'var(--status-success)', fontSize: '3rem', marginBottom: '1rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Payment Successful!</h2>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Thank you for visiting!</p>
             </div>
          )}
       </div>

       {/* Right Order Area */}
       <div className="panel" style={{ width: '450px', display: 'flex', flexDirection: 'column', borderRadius: '0', borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}>
          <div style={{ padding: '2.5rem', backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border-color)' }}>
             <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Your Order</h2>
             <p className="mono-text" style={{ color: 'var(--text-muted)' }}>ID: #{displayOrder.id.slice(-6)}</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
             {displayOrder.items.length === 0 && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '1.25rem' }}>Ready for your order...</p>}
             {displayOrder.items.map(item => (
                <div key={item.productId} className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                   <div>
                      <span style={{ fontWeight: '600', color: 'var(--accent-primary)', marginRight: '1rem' }}>{item.quantity}</span> 
                      <span style={{ color: 'var(--text-inverse)' }}>{item.name}</span>
                   </div>
                   <div className="mono-text" style={{ fontWeight: '500' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                   </div>
                </div>
             ))}
          </div>
          <div style={{ padding: '2.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-header)' }}>
             <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.125rem' }}>
                <span>Subtotal</span>
                <span className="mono-text">${subtotal.toFixed(2)}</span>
             </div>
             <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                <span>Tax</span>
                <span className="mono-text">${tax.toFixed(2)}</span>
             </div>
             <div className="flex-between" style={{ fontSize: '2.25rem', fontWeight: '700', color: 'var(--text-inverse)', borderTop: '1px solid var(--border-active)', paddingTop: '1.5rem' }}>
                <span>Total</span>
                <span className="mono-text">${displayOrder.totalAmount.toFixed(2)}</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CustomerDisplay;
