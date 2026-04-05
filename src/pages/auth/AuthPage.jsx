import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Coffee } from 'lucide-react';

const AuthPage = () => {
  const { login, signup } = useAuthStore();
  const navigate = useNavigate();

  // Excalidraw mockup shows two distinct blocks: Log In & New User
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if(login({ email: loginEmail, name: loginEmail.split('@')[0] })) navigate('/admin');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if(signup({ email: regEmail, password: regPass, name: regName })) {
      login({ email: regEmail, name: regName });
      navigate('/admin');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
         <Coffee size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
         <h1 style={{ fontSize: '2rem' }}>Odoo POS Cafe</h1>
         <p style={{ color: 'var(--text-muted)' }}>Restaurant Point of Sale System</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
         
         {/* Log In Panel */}
         <div className="panel" style={{ width: '300px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>Log In</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Email</label>
                  <input required type="email" className="input-base" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Password</label>
                  <input required type="password" className="input-base" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
               </div>
               <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Log In</button>
            </form>
         </div>

         {/* New User Panel */}
         <div className="panel" style={{ width: '300px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>New User</h2>
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Name</label>
                  <input required type="text" className="input-base" value={regName} onChange={e => setRegName(e.target.value)} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Email</label>
                  <input required type="email" className="input-base" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Password</label>
                  <input required type="password" className="input-base" value={regPass} onChange={e => setRegPass(e.target.value)} />
               </div>
               <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Sign Up</button>
            </form>
         </div>

      </div>
    </div>
  );
};

export default AuthPage;
