import React from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Package, Map, Settings, LogOut, Coffee } from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navOperations = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Floor Plans', path: '/admin/floors', icon: Map },
  ];

  const navConfig = [
    { name: 'POS Settings', path: '/admin/settings', icon: Settings },
  ];

  const renderNavSection = (title, items) => (
     <div style={{ marginBottom: '1.5rem' }}>
         <span style={{ 
            padding: '0 1.5rem', 
            fontSize: '0.65rem', 
            fontWeight: '700', 
            color: 'var(--text-muted)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            marginBottom: '0.5rem',
            display: 'block'
         }}>
            {title}
         </span>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `flex-row ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  gap: '0.75rem',
                  padding: '0.5rem 1.25rem',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                })}
              >
                <item.icon size={18} color={window.location.pathname.includes(item.path) ? 'var(--accent-primary)' : 'var(--text-main)'} />
                {item.name}
              </NavLink>
            ))}
         </div>
     </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Enterprise Sidebar mapped exactly to reference */}
      <aside style={{ width: '220px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)' }}>
        
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Coffee size={24} color="var(--accent-primary)" />
          <h2 style={{ color: 'var(--text-inverse)', fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
             Odoo POS Cafe
          </h2>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto' }}>
           {renderNavSection('Operations', navOperations)}
           {renderNavSection('Config', navConfig)}
        </nav>

        {/* Bottom User Card */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
              {user?.name?.charAt(0) || 'V'}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-inverse)', margin: 0, lineHeight: 1.2 }}>{user?.name || 'vrajraj chauhan'}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Manager</p>
            </div>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
