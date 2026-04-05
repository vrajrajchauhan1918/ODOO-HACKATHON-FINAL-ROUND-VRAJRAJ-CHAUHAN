import React from 'react';
import { useOrderStore } from '../../store/useOrderStore';
import { useFloorStore } from '../../store/useFloorStore';

const KitchenDisplay = () => {
  const { orders, updateKitchenStatus } = useOrderStore();
  const { tables } = useFloorStore();
  
  const activeOrders = orders.filter(o => o.kitchenStatus && o.kitchenStatus !== 'Completed');
  const completedOrders = orders.filter(o => o.kitchenStatus === 'Completed').slice(-10);
  
  const handleMoveOrder = (orderId, currentStatus) => {
     if (currentStatus === 'To Cook') updateKitchenStatus(orderId, 'Preparing');
     else if (currentStatus === 'Preparing') updateKitchenStatus(orderId, 'Completed');
  };

  const renderColumn = (title, statusList, highlightColor) => {
     return (
        <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-header)', borderBottom: `2px solid ${highlightColor}` }}>
              <h2 className="flex-between" style={{ fontSize: '1.125rem', margin: 0 }}>
                 {title}
                 <span className="badge" style={{ backgroundColor: highlightColor, color: 'white' }}>{statusList.length}</span>
              </h2>
           </div>
           
           <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-main)' }}>
              {statusList.map(order => {
                 const tableName = tables.find(t => t.id === order.tableId)?.name || order.tableId;
                 return (
                    <div 
                      key={order.id} 
                      className={`panel animate-slide-down ${order.kitchenStatus === 'Completed' ? 'opacity-50' : 'product-card'}`}
                      style={{ cursor: order.kitchenStatus === 'Completed' ? 'default' : 'pointer', padding: '1rem' }}
                      onClick={() => handleMoveOrder(order.id, order.kitchenStatus)}
                    >
                       <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          <span className="mono-text" style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{order.id.slice(-6)}</span>
                          <span style={{ color: 'var(--text-inverse)', fontWeight: '700' }}>{tableName}</span>
                       </div>
                       <ul style={{ listStyle: 'none', padding: 0 }}>
                          {order.items.map(item => (
                             <li key={item.productId} className="flex-between" style={{ padding: '0.375rem 0' }}>
                                <span style={{ fontWeight: '500' }}>
                                   <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>{item.quantity}x</span>
                                   {item.name}
                                </span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 );
              })}
              {statusList.length === 0 && (
                 <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No orders in this queue.</div>
              )}
           </div>
        </div>
     );
  };

  return (
    <div style={{ padding: '1.5rem', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
       <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-inverse)', fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}>
          Kitchen Display System
          <span style={{ marginLeft: '1rem', fontSize: '0.875rem', fontWeight: '400', color: 'var(--status-success)', border: '1px solid var(--status-success)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)' }}>LIVE</span>
       </h1>
       <div style={{ flex: 1, display: 'flex', gap: '1.5rem', overflow: 'hidden' }}>
          {renderColumn('To Cook', activeOrders.filter(o => o.kitchenStatus === 'To Cook'), 'var(--status-danger)')}
          {renderColumn('Preparing', activeOrders.filter(o => o.kitchenStatus === 'Preparing'), 'var(--status-warning)')}
          {renderColumn('Ready & Completed', completedOrders, 'var(--status-success)')}
       </div>
    </div>
  );
};

export default KitchenDisplay;
