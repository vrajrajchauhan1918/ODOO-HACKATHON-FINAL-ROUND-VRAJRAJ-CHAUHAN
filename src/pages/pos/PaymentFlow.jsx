import React, { useState } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import { useOrderStore } from '../../store/useOrderStore';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentFlow = ({ order, total, onClose }) => {
  const { paymentMethods } = useConfigStore();
  const { payOrder } = useOrderStore();
  const navigate = useNavigate();
  
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleValidate = () => {
    // Process payment
    payOrder(order.id, selectedMethod);
    setPaymentSuccess(true);
    
    // Auto return to floor after a pause
    setTimeout(() => {
       navigate('/pos/floor');
    }, 2000);
  };

  if (paymentSuccess) {
    return (
       <div className="flex-center animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}>
          <div className="panel p-8 flex-center flex-column" style={{ width: '400px', textAlign: 'center' }}>
             <CheckCircle2 size={64} color="var(--accent-success)" style={{ marginBottom: '1rem' }} />
             <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Successful!</h2>
             <p style={{ color: 'var(--text-muted)' }}>Returning to floor view...</p>
          </div>
       </div>
    );
  }

  // Active methods array
  const activeMethods = Object.entries(paymentMethods)
    .filter(([_, data]) => data.enabled)
    .map(([id, data]) => ({ id, ...data }));

  return (
    <div className="flex-center animate-fade-in" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 50 }}>
       <div className="panel p-8" style={{ width: '600px', maxWidth: '90%', position: 'relative' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem' }}>
             <X size={16} />
          </button>
          
          <h2 style={{ marginBottom: '2rem' }}>Checkout - ${total.toFixed(2)}</h2>

          <div style={{ display: 'flex', gap: '2rem' }}>
             {/* Methods List */}
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Payment Method</h3>
               {activeMethods.map(method => (
                  <button 
                    key={method.id}
                    className={`btn ${selectedMethod === method.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '1rem', justifyContent: 'flex-start', fontSize: '1.125rem' }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    {method.name}
                  </button>
               ))}
             </div>
             
             {/* Dynamic Right Panel */}
             <div style={{ flex: 1, borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {selectedMethod === 'upi' ? (
                   <div style={{ textAlign: 'center' }} className="animate-fade-in">
                      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'inline-block' }}>
                        <QRCodeSVG 
                          value={`upi://pay?pa=${paymentMethods.upi.upiId}&am=${total.toFixed(2)}&cu=USD`} 
                          size={150} 
                        />
                      </div>
                      <p style={{ fontWeight: 'bold' }}>Scan to Pay ${total.toFixed(2)}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>UPI ID: {paymentMethods.upi.upiId}</p>
                   </div>
                ) : selectedMethod === 'cash' ? (
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Cash Payment</p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>${total.toFixed(2)}</p>
                   </div>
                ) : selectedMethod === 'digital' ? (
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Card / Terminal</p>
                      <p style={{ color: 'var(--text-muted)' }}>Follow instructions on terminal.</p>
                   </div>
                ) : (
                   <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      Select a payment method
                   </div>
                )}
             </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
             <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
             <button className="btn btn-success" disabled={!selectedMethod} onClick={handleValidate} style={{ paddingLeft: '2rem', paddingRight: '2rem', fontSize: '1.125rem' }}>
                Validate
             </button>
          </div>
       </div>
    </div>
  );
};

export default PaymentFlow;
