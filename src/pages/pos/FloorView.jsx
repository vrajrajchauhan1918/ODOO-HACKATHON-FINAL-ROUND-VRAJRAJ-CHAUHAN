import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFloorStore } from '../../store/useFloorStore';
import { useOrderStore } from '../../store/useOrderStore';
import { Users, AlertCircle } from 'lucide-react';

const FloorView = () => {
  const { floors, tables } = useFloorStore();
  const { currentSession, createDraftOrder, orders } = useOrderStore();
  const navigate = useNavigate();
  
  const [activeFloor, setActiveFloor] = useState(floors[0]?.id);

  const handleTableClick = async (table) => {
    if (!table.active) return;
    
    const existingActive = orders.find(o => o.tableId === table.id && o.status !== 'paid' && o.sessionId === currentSession?.id);
    
    if (existingActive) {
      navigate(`/pos/order/${table.id}`);
    } else {
      await createDraftOrder(table.id);
      navigate(`/pos/order/${table.id}`);
    }
  };

  return (
    <div className="animate-slide-down" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Visual Header */}
      <div style={{ marginBottom: '2rem' }}>
         <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Table Selection</h2>
         <p style={{ color: 'var(--text-muted)' }}>Select a table to open a new order or manage an existing one.</p>
      </div>

      {/* Modern Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {floors.map(floor => (
          <button 
             key={floor.id}
             className={`btn ${activeFloor === floor.id ? 'btn-ghost' : 'btn-ghost'}`}
             onClick={() => setActiveFloor(floor.id)}
             style={{ 
                padding: '0.75rem 1.5rem', 
                fontSize: '1rem',
                borderBottom: activeFloor === floor.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                borderRadius: '0',
                color: activeFloor === floor.id ? 'var(--text-inverse)' : 'var(--text-muted)'
             }}
          >
             {floor.name}
          </button>
        ))}
      </div>

      {/* Grid of Tables - Square Excalidraw Style */}
      <div style={{ 
         display: 'flex', 
         flexWrap: 'wrap', 
         gap: '2rem', 
         padding: '2rem', 
         justifyContent: 'center',
         backgroundColor: 'var(--bg-header)',
         borderRadius: 'var(--radius-md)',
         border: '1px solid var(--border-color)',
         minHeight: '400px',
         alignContent: 'flex-start'
      }}>
         {/* Floors Header Overlay */}
         <div style={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-inverse)', fontWeight: '500' }}>Floor View</h3>
         </div>

        {tables.filter(t => t.floorId === activeFloor).map(table => {
          const tableActive = orders.find(o => o.tableId === table.id && o.status !== 'paid' && o.sessionId === currentSession?.id);
          const isOccupied = !!tableActive;
          
          return (
            <div 
               key={table.id}
               className={`panel ${table.active ? 'product-card' : ''}`}
               style={{ 
                 cursor: table.active ? 'pointer' : 'not-allowed', 
                 minWidth: '100px',
                 height: '100px',
                 padding: '0.5rem 1rem',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 position: 'relative',
                 borderColor: isOccupied ? 'var(--accent-primary)' : 'var(--border-light)',
                 borderWidth: isOccupied ? '2px' : '1px',
                 opacity: table.active ? 1 : 0.4,
                 backgroundColor: 'var(--bg-main)',
                 borderRadius: 'var(--radius-sm)'
               }}
               onClick={() => handleTableClick(table)}
            >
               <span style={{ 
                  fontSize: '1.25rem', 
                  color: isOccupied ? 'var(--accent-primary)' : '#60A5FA', 
                  fontWeight: '500',
                  textAlign: 'center'
               }}>
                 {table.name}
               </span>
            </div>
          );
        })}
        {tables.filter(t => t.floorId === activeFloor).length === 0 && (
           <div style={{ width: '100%', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              There are no tables on this floor. Configure them in the Dashboard.
           </div>
        )}
      </div>
    </div>
  );
};

export default FloorView;
