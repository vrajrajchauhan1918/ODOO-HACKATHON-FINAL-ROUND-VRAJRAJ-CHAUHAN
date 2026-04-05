import React, { useState } from 'react';
import { useFloorStore } from '../../store/useFloorStore';
import { Plus, Edit2, Trash2, Map, Users, CircleDashed } from 'lucide-react';

const FloorManagement = () => {
  const { floors, tables, addFloor, addTable, updateTable, removeTable } = useFloorStore();
  const [activeFloor, setActiveFloor] = useState(floors[0]?.id || null);
  
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');
  
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('2');

  const handleAddFloor = (e) => {
    e.preventDefault();
    if (newFloorName) {
      addFloor(newFloorName);
      setNewFloorName('');
      setIsAddingFloor(false);
    }
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (newTableName && activeFloor) {
      addTable(activeFloor, newTableName, parseInt(newTableSeats));
      setNewTableName('');
      setNewTableSeats('2');
      setIsAddingTable(false);
    }
  };

  const currentFloorTables = tables.filter(t => t.floorId === activeFloor);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      
      {/* Professional Nav Sidebar for Floors */}
      <div style={{ width: '240px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
           <h3 style={{ margin: 0, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Locations</h3>
           <button className="btn btn-ghost" style={{ padding: '0.25rem' }} onClick={() => setIsAddingFloor(!isAddingFloor)}>
              <Plus size={16} />
           </button>
        </div>

        {isAddingFloor && (
           <form onSubmit={handleAddFloor} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input autoFocus required type="text" className="input-base" value={newFloorName} onChange={e => setNewFloorName(e.target.value)} placeholder="Floor Name" />
           </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
           {floors.map(floor => (
              <button 
                 key={floor.id} 
                 className="flex-row"
                 style={{ 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: 'none', 
                    background: activeFloor === floor.id ? 'var(--bg-hover)' : 'transparent', 
                    color: activeFloor === floor.id ? 'var(--text-inverse)' : 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    gap: '0.5rem',
                    transition: 'all 0.15s ease'
                 }} 
                 onClick={() => setActiveFloor(floor.id)}
              >
                 <Map size={16} color={activeFloor === floor.id ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                 {floor.name}
              </button>
           ))}
           {floors.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No locations added.</p>
           )}
        </div>
      </div>

      {/* Main Workspace for Tables */}
      <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex-between" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
           <div>
              <h2>{floors.find(f => f.id === activeFloor)?.name || 'Select a floor'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Manage tables and seating limits.</p>
           </div>
           {activeFloor && (
             <button className="btn btn-primary" onClick={() => setIsAddingTable(!isAddingTable)}>
               <Plus size={16} /> Add Table
             </button>
           )}
        </div>

        {isAddingTable && activeFloor && (
          <form className="panel" onSubmit={handleAddTable} style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', backgroundColor: 'var(--bg-main)' }}>
             <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Table Name</label>
                <input required type="text" className="input-base" value={newTableName} onChange={e => setNewTableName(e.target.value)} placeholder="e.g. Table 12"/>
             </div>
             <div style={{ width: '120px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Seats</label>
                <input required type="number" min="1" className="input-base" value={newTableSeats} onChange={e => setNewTableSeats(e.target.value)} />
             </div>
             <button type="submit" className="btn btn-secondary" style={{ height: '36px' }}>Save</button>
          </form>
        )}

        {activeFloor ? (
           <div className="grid-cols-4">
             {currentFloorTables.map(table => (
                <div key={table.id} className="panel card-hover" style={{ display: 'flex', flexDirection: 'column', height: '140px', padding: '1.25rem', position: 'relative' }}>
                   
                   <div className="flex-between" style={{ marginBottom: 'auto' }}>
                      <span className="badge" style={{ backgroundColor: table.active ? 'rgba(22, 163, 74, 0.1)' : 'var(--bg-hover)', color: table.active ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                         {table.active ? 'Active' : 'Offline'}
                      </span>
                      <div className="flex-row" style={{ gap: '0.25rem' }}>
                         <button className="btn-ghost" style={{ padding: '0.25rem' }} onClick={() => updateTable(table.id, { active: !table.active })}>
                            <Edit2 size={14} />
                         </button>
                         <button className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--accent-danger)' }} onClick={() => removeTable(table.id)}>
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>

                   <div style={{ marginTop: 'auto' }}>
                      <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-inverse)' }}>{table.name}</h3>
                      <div className="flex-row" style={{ gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                         <Users size={14} /> {table.seats} seats
                      </div>
                   </div>
                </div>
             ))}
             
             {currentFloorTables.length === 0 && (
                <div className="flex-center flex-col panel" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', borderStyle: 'dashed' }}>
                   <CircleDashed size={48} style={{ color: 'var(--border-light)', marginBottom: '1rem' }} />
                   <h3 style={{ color: 'var(--text-inverse)', marginBottom: '0.25rem' }}>No tables yet</h3>
                   <p style={{ color: 'var(--text-muted)' }}>Add tables to this location to start serving customers.</p>
                </div>
             )}
           </div>
        ) : (
           <div className="flex-center flex-col" style={{ height: '300px', color: 'var(--text-muted)' }}>
              <Map size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p>Select or create a location from the sidebar.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default FloorManagement;
