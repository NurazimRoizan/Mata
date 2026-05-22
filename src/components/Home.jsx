import React from 'react';
import { Camera, Monitor } from 'lucide-react';

function Home({ setMode }) {
  return (
    <div className="flex-col items-center justify-center h-full animate-fade-in" style={{ gap: '2rem' }}>
      <div className="text-center" style={{ maxWidth: '400px', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Repurpose your old phone.</h1>
        <p>Turn this device into a smart security camera, or use it as a viewer to watch a stream from another device securely over the local network.</p>
      </div>

      <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className="glass-panel flex-col items-center gap-4" 
          style={{ width: '200px', height: '220px', transition: 'all 0.3s' }}
          onClick={() => setMode('camera')}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Camera size={48} color="var(--accent-color)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>Camera Mode</h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>Host a video stream</p>
        </button>

        <button 
          className="glass-panel flex-col items-center gap-4" 
          style={{ width: '200px', height: '220px', transition: 'all 0.3s' }}
          onClick={() => setMode('viewer')}
        >
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Monitor size={48} color="var(--success-color)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>Viewer Mode</h3>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>Watch a stream</p>
        </button>
      </div>
    </div>
  );
}

export default Home;
