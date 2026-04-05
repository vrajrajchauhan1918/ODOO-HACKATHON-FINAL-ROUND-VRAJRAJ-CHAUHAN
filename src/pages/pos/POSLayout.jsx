import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Monitor, Settings, RotateCw, Play, Clock, Wifi } from 'lucide-react';

const POSLayout = () => {
  const { currentSession, openSession, closeSession, orders, createDraftOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [startAmount, setStartAmount] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
     const timer = setInterval(() => setTime(new Date()), 1000);
     return () => clearInterval(timer);
  }, []);

  const handleOpenSession = (e) => {
    e.preventDefault();
    openSession(parseFloat(startAmount));
  };

  const handleCloseSession = () => {
    if(window.confirm('Close Register & End Session?')) {
      closeSession();
      navigate('/pos');
    }
  };

  const handleRegisterClick = async () => {
    const takeaway = orders.find(o => o.tableId === 'takeaway' && o.status !== 'paid' && o.sessionId === currentSession?.id);
    if (takeaway) {
       navigate(`/pos/order/takeaway`);
    } else {
       await createDraftOrder('takeaway');
       navigate(`/pos/order/takeaway`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Enterprise Header */}
      <header className="panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', backgroundColor: 'var(--bg-header)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1.5rem', backgroundColor: '#000', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
           <div className="flex-row" style={{ gap: '1.5rem' }}>
              <span className="flex-row" style={{ gap: '0.25rem' }}><Wifi size={12} color="var(--status-success)" /> Connected</span>
              <span>Odoo POS Cafe V1.0</span>
           </div>
           <div className="flex-row" style={{ gap: '1.5rem' }}>
              <span className="flex-row" style={{ gap: '0.25rem' }}><Clock size={12} /> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <span>{new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(time)}</span>
           </div>
        </div>

        {/* Main Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1.5rem' }}>
          <div className="flex-row" style={{ gap: '2rem' }}>
            <h1 className="flex-row" style={{ color: 'var(--text-inverse)', fontSize: '1.25rem', gap: '0.5rem', fontWeight: '700' }}>
               <Monitor size={20} color="var(--accent-primary)" /> POS
            </h1>
            
            {/* Navigation Tabs - Excalidraw Style */}
            {currentSession && (
              <div className="flex-row" style={{ gap: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                <Link to="/pos/floor" className={`btn ${location.pathname.includes('/floor') ? 'btn-secondary' : 'btn-ghost'}`} style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1.25rem', border: '1px solid var(--border-color)' }}>
                  Table
                </Link>
                <button 
                  className={`btn ${location.pathname.includes('/order') ? 'btn-secondary' : 'btn-ghost'}`} 
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1.25rem', border: '1px solid var(--border-color)' }}
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 1.25rem', border: '1px solid var(--border-color)' }}
                  onClick={() => alert("Orders overview can be managed via the Kitchen Display (Kitchen UI) or Dashboard (Export logic).")}
                >
                  Orders
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-row" style={{ gap: '0.75rem' }}>
            <button className="btn btn-ghost" onClick={() => window.location.reload()} title="Sync Database">
               <RotateCw size={16} />
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }} />
            
            <Link to="/customer" target="_blank" className="btn btn-secondary">Customer UI</Link>
            <Link to="/kitchen" target="_blank" className="btn btn-secondary">Kitchen UI</Link>

            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }} />
            
            <div className="flex-row" style={{ gap: '0.5rem', marginRight: '1rem' }}>
               <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {user?.name?.charAt(0) || 'C'}
               </div>
               <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user?.name || 'Cashier'}</span>
            </div>

            {currentSession ? (
               <button className="btn btn-danger" onClick={handleCloseSession}>
                 <LogOut size={16} /> Close Register
               </button>
            ) : (
               <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                 <Settings size={16} /> Dashboard
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {!currentSession ? (
           <div className="flex-center animate-slide-down" style={{ height: '100%', backgroundColor: 'var(--bg-main)' }}>
              <form className="panel" onSubmit={handleOpenSession} style={{ padding: '3rem', width: '400px', textAlign: 'center' }}>
                 <Play size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                 <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Open Register</h2>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.875rem' }}>Please verify and enter the opening cash balance for this session.</p>
                 
                 <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Opening Cash</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.125rem' }}>$</span>
                       <input 
                         type="number" 
                         step="0.01" 
                         required 
                         className="input-base" 
                         style={{ fontSize: '1.25rem', paddingLeft: '2.5rem', height: '3rem' }}
                         value={startAmount} 
                         onChange={e => setStartAmount(e.target.value)} 
                         placeholder="0.00"
                       />
                    </div>
                 </div>
                 
                 <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
                    Start Session
                 </button>
              </form>
           </div>
        ) : (
           <div style={{ height: '100%', padding: '1.5rem', overflowY: 'auto' }}>
              <Outlet />
           </div>
        )}
      </main>
    </div>
  );
};

export default POSLayout;
