import React from 'react';
import { Camera, Monitor } from 'lucide-react';

function Home({ setMode }) {
  return (
    <div className="flex-col items-center animate-pop-in" style={{ gap: '2rem', margin: 'auto', padding: '1rem 0' }}>
      <div className="text-center" style={{ maxWidth: '400px', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '2px 2px 0px var(--accent-pink)' }}>Repurpose your old phone.</h1>
        <p style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)', padding: '0.5rem', display: 'inline-block', transform: 'rotate(-1deg)', border: '2px solid var(--bg-primary)' }}>
          Turn this device into a smart security camera, or use it as a viewer to watch a stream securely.
        </p>
      </div>

      <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className="brutal-panel pink-shadow sticker-tilt-left flex-col items-center gap-4" 
          style={{ width: '220px', height: '240px', cursor: 'pointer', padding: '0' }}
          onClick={() => setMode('camera')}
        >
          <div style={{ background: 'var(--accent-cyan)', border: '3px solid var(--bg-primary)', padding: '1rem', borderRadius: '0', boxShadow: '4px 4px 0px var(--accent-pink)', marginTop: '2rem' }}>
            <Camera size={56} color="var(--bg-primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem', color: 'var(--accent-pink)', textShadow: '1px 1px 0px var(--bg-primary)' }}>Camera Mode</h3>
          <p style={{ fontSize: '1rem', margin: 0, paddingBottom: '2rem' }}>Host a video stream</p>
        </button>

        <button 
          className="brutal-panel cyan-shadow sticker-tilt-right flex-col items-center gap-4" 
          style={{ width: '220px', height: '240px', cursor: 'pointer', padding: '0' }}
          onClick={() => setMode('viewer')}
        >
          <div style={{ background: 'var(--accent-pink)', border: '3px solid var(--bg-primary)', padding: '1rem', borderRadius: '0', boxShadow: '4px 4px 0px var(--accent-cyan)', marginTop: '2rem' }}>
            <Monitor size={56} color="var(--bg-primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem', color: 'var(--accent-cyan)', textShadow: '1px 1px 0px var(--bg-primary)' }}>Viewer Mode</h3>
          <p style={{ fontSize: '1rem', margin: 0, paddingBottom: '2rem' }}>Watch a stream</p>
        </button>
      </div>
    </div>
  );
}

export default Home;
