import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import { Monitor, Play, Loader } from 'lucide-react';

function ViewerMode() {
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, connected, error
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const dataConnRef = useRef(null);

  useEffect(() => {
    peerRef.current = new Peer();
    
    // Ask for Notification Permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setHasPermission(permission === 'granted');
      });
    }
    
    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const connectToCamera = (e) => {
    e.preventDefault();
    if (!targetId.trim()) return;

    setStatus('connecting');
    
    // 1. Establish Media Connection (Video)
    const call = peerRef.current.call(targetId, null); // We don't send our own stream
    
    call.on('stream', (remoteStream) => {
      setStatus('connected');
      if (videoRef.current) {
        videoRef.current.srcObject = remoteStream;
      }
    });

    call.on('error', (err) => {
      console.error(err);
      setStatus('error');
    });

    call.on('close', () => {
      setStatus('idle');
    });

    // 2. Establish Data Connection (For Motion Alerts)
    const conn = peerRef.current.connect(targetId);
    dataConnRef.current = conn;

    conn.on('open', () => {
      console.log('Data connection opened to receive alerts');
    });

    conn.on('data', (data) => {
      if (data === 'MOTION_DETECTED') {
        console.log('Motion Detected Received!');
        if (hasPermission && 'Notification' in window) {
          // Send System Notification
          new Notification('Mata Alert 🚨', {
            body: 'Motion detected on your camera!',
            icon: '/mata/vite.svg' // Provide an icon if available
          });
        }
      }
    });
  };

  return (
    <div className="flex-col h-full animate-pop-in gap-4">
      {status !== 'connected' && (
        <div className="brutal-panel cyan-shadow flex-col items-center justify-center text-center sticker-tilt-left" style={{ flex: 1, gap: '1.5rem', background: 'var(--bg-secondary)' }}>
          <div style={{ background: 'var(--accent-pink)', padding: '1rem', border: '3px solid var(--text-primary)', transform: 'rotate(5deg)' }}>
             <Monitor size={48} color="var(--bg-primary)" />
          </div>
          <div>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>Connect to Camera</h2>
            <p style={{ background: 'var(--accent-pink)', color: '#000', padding: '0.25rem 0.5rem', display: 'inline-block', transform: 'rotate(-2deg)' }}>Enter the Connection ID displayed on your camera device.</p>
          </div>
          
          <form onSubmit={connectToCamera} className="flex-col gap-4 sticker-tilt-right" style={{ width: '100%', maxWidth: '300px', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="e.g. 1a2b-3c4d" 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '1px' }}
            />
            <button type="submit" className="primary w-full" disabled={status === 'connecting' || !targetId}>
              {status === 'connecting' ? <Loader className="lucide-spin" size={24} /> : <Play size={24} />}
              {status === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          </form>
          
          {status === 'error' && (
            <div className="sticker-tilt-left" style={{ background: 'var(--danger-color)', color: '#fff', padding: '0.5rem', border: '3px solid #000', fontWeight: 'bold' }}>
               Failed to connect. Please check the ID.
            </div>
          )}
        </div>
      )}

      {status === 'connected' && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', border: '4px solid var(--accent-pink)', boxShadow: '6px 6px 0px var(--accent-cyan)' }}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }} className="sticker-tilt-right">
             <div style={{ background: 'var(--accent-cyan)', color: '#000', border: '3px solid #000', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger-color)', border: '2px solid #000' }}></div>
                LIVE
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewerMode;
