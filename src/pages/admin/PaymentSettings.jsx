import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../../store/useConfigStore';
import { useOrderStore } from '../../store/useOrderStore';
import { CreditCard, Banknote, QrCode, Monitor } from 'lucide-react';

const PaymentSettings = () => {
  const { paymentMethods, updatePaymentMethod } = useConfigStore();
  const { currentSession, orders } = useOrderStore();
  const navigate = useNavigate();

  const handleToggle = (id, enabled) => {
    updatePaymentMethod(id, { enabled: !enabled });
  };

  const methods = [
    { id: 'cash', icon: Banknote, info: 'Enable standard cash drawers.' },
    { id: 'digital', icon: CreditCard, info: 'Enable card and bank transfers.' },
    { id: 'upi', icon: QrCode, info: 'Enable dynamic QR Code generation.' },
  ];

  const closedOrders = orders.filter(o => o.status === 'paid');
  const lastClosedAmount = closedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      <div className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div>
           <h2 style={{ margin: 0 }}>Terminal Config</h2>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your active POS connection and payment gateways.</p>
        </div>
      </div>

      <div className="panel" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
        <div className="flex-between">
           <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Active Session</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: currentSession ? 'var(--accent-success)' : 'var(--text-inverse)' }}>
                 {currentSession ? `Register Open (ID: ${currentSession.id.substring(0,8)})` : 'Register Closed'}
              </h3>
           </div>
           <div style={{ textAlign: 'center', padding: '0 2rem', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Gross Revenue</p>
              <h3 className="mono-text" style={{ margin: 0 }}>${lastClosedAmount.toFixed(2)}</h3>
           </div>
           <button className={`btn ${currentSession ? 'btn-secondary' : 'btn-primary'}`} onClick={() => navigate('/pos')}>
              <Monitor size={16} />
              {currentSession ? 'Resume Terminal' : 'Launch New Session'}
           </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Payment Gateways</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        {methods.map(({ id, icon: Icon, info }) => {
          const methodData = paymentMethods[id];
          return (
            <div key={id} className="panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                     <Icon size={20} color={methodData.enabled ? 'var(--text-inverse)' : 'var(--text-muted)'} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{id.charAt(0).toUpperCase() + id.slice(1)}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{info}</p>
                    
                    {id === 'upi' && methodData.enabled && (
                      <div className="animate-slide-down" style={{ marginTop: '1rem' }}>
                         <input 
                           type="text" 
                           className="input-base" 
                           style={{ width: '280px' }}
                           value={methodData.upiId || ''} 
                           onChange={e => updatePaymentMethod('upi', { upiId: e.target.value })}
                           placeholder="Enter UPI ID (e.g. store@bank)" 
                         />
                      </div>
                    )}
                  </div>
               </div>
               
               <button 
                 onClick={() => handleToggle(id, methodData.enabled)}
                 style={{
                    width: '44px', height: '24px', 
                    backgroundColor: methodData.enabled ? 'var(--text-inverse)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px',
                    transition: 'all 0.15s ease',
                    border: methodData.enabled ? '1px solid var(--text-inverse)' : '1px solid var(--border-light)',
                    display: 'flex', alignItems: 'center', cursor: 'pointer',
                    justifyContent: methodData.enabled ? 'flex-end' : 'flex-start'
                 }}
               >
                  <div style={{ width: '18px', height: '18px', backgroundColor: methodData.enabled ? '#000' : 'var(--text-muted)', borderRadius: '50%' }} />
               </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentSettings;
