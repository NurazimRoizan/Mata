import React, { useState } from 'react';
import Home from './components/Home';
import CameraMode from './components/CameraMode';
import ViewerMode from './components/ViewerMode';
import { Shield } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('home'); // 'home', 'camera', 'viewer'

  return (
    <div className="flex-col h-full w-full">
      <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid var(--dark-border-color)', background: 'var(--bg-secondary)' }}>
        <Shield size={28} color="var(--accent-color)" />
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Mata</h2>
        {mode !== 'home' && (
          <button 
            style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }} 
            onClick={() => setMode('home')}
          >
            Leave
          </button>
        )}
      </header>

      <main style={{ flex: 1, padding: '1rem', overflow: 'hidden' }}>
        {mode === 'home' && <Home setMode={setMode} />}
        {mode === 'camera' && <CameraMode />}
        {mode === 'viewer' && <ViewerMode />}
      </main>
    </div>
  );
}

export default App;
