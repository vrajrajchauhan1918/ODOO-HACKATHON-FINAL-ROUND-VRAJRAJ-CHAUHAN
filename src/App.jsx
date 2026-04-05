import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AuthPage from './pages/auth/AuthPage';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import FloorManagement from './pages/admin/FloorManagement';
import PaymentSettings from './pages/admin/PaymentSettings';

import POSLayout from './pages/pos/POSLayout';
import FloorView from './pages/pos/FloorView';
import OrderScreen from './pages/pos/OrderScreen';

import KitchenDisplay from './pages/displays/KitchenDisplay';
import CustomerDisplay from './pages/displays/CustomerDisplay';
import SelfOrdering from './pages/displays/SelfOrdering';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/pos" replace />} />
        
        {/* Auth Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Backend Config Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="floors" element={<FloorManagement />} />
          <Route path="settings" element={<PaymentSettings />} />
        </Route>

        {/* POS Terminal Routes */}
        <Route path="/pos" element={<POSLayout />}>
          <Route index element={<Navigate to="floor" replace />} />
          <Route path="floor" element={<FloorView />} />
          <Route path="order/:tableId" element={<OrderScreen />} />
        </Route>

        {/* Displays */}
        <Route path="/kitchen" element={<KitchenDisplay />} />
        <Route path="/customer" element={<CustomerDisplay />} />
        
        {/* Customer Self-Ordering Kiosk */}
        <Route path="/self-order/:tableId" element={<SelfOrdering />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
