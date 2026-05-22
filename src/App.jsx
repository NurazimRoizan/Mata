import React, { useState } from 'react';
import Home from './components/Home';
import CameraMode from './components/CameraMode';
import ViewerMode from './components/ViewerMode';
import { Shield } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('home'); // 'home', 'camera', 'viewer'

  return (
    <div className="flex-col h-full w-full">
      <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '4px solid var(--text-primary)', background: 'var(--bg-secondary)', boxShadow: '0 4px 0px var(--accent-cyan)', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'var(--accent-pink)', padding: '0.5rem', border: '2px solid var(--text-primary)', transform: 'rotate(-5deg)' }}>
           <Shield size={28} color="var(--bg-primary)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0, textTransform: 'uppercase', color: 'var(--accent-cyan)', textShadow: '2px 2px 0px var(--accent-pink)' }}>Mata</h2>
        {mode !== 'home' && (
          <button 
            style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }} 
            onClick={() => setMode('home')}
          >
            Leave
          </button>
        )}
      </header>

      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {mode === 'home' && <Home setMode={setMode} />}
        {mode === 'camera' && <CameraMode />}
        {mode === 'viewer' && <ViewerMode />}
      </main>
    </div>
  );
}

export default App;
