import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import { Monitor, Play, Loader } from 'lucide-react';

function ViewerMode() {
  const [targetId, setTargetId] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, connected, error
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    peerRef.current = new Peer();
    
    return () => {
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const connectToCamera = (e) => {
    e.preventDefault();
    if (!targetId.trim()) return;

    setStatus('connecting');
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
  };

  return (
    <div className="flex-col h-full animate-fade-in gap-4">
      {status !== 'connected' && (
        <div className="brutal-panel flex-col items-center justify-center text-center" style={{ flex: 1, gap: '1.5rem' }}>
          <Monitor size={48} color="var(--success-color)" />
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Connect to Camera</h2>
            <p>Enter the Connection ID displayed on your camera device.</p>
          </div>
          
          <form onSubmit={connectToCamera} className="flex-col gap-4" style={{ width: '100%', maxWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="e.g. 1a2b-3c4d" 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '1px' }}
            />
            <button type="submit" className="primary w-full" disabled={status === 'connecting' || !targetId}>
              {status === 'connecting' ? <Loader className="lucide-spin" size={20} /> : <Play size={20} />}
              {status === 'connecting' ? 'Connecting...' : 'Connect'}
            </button>
          </form>
          
          {status === 'error' && (
            <p style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>Failed to connect. Please check the ID.</p>
          )}
        </div>
      )}

      {status === 'connected' && (
        <div style={{ flex: 1, position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: '#000' }}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
             <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
                Live
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewerMode;
