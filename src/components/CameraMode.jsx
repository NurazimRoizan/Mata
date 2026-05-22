import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Camera, Copy, CheckCircle } from 'lucide-react';

function CameraMode() {
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const [copied, setCopied] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // 1. Get Camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true })
      .then(mediaStream => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // 2. Initialize Peer
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', (id) => {
          setPeerId(id);
        });

        // 3. Answer incoming calls
        peer.on('call', (call) => {
          console.log('Incoming call, answering...');
          call.answer(mediaStream);
        });
      })
      .catch(err => {
        console.error('Failed to get local stream', err);
        alert('Could not access camera. Please ensure permissions are granted.');
      });

    // Request Wake Lock
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock API not supported or denied');
      }
    };
    requestWakeLock();

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (wakeLock) wakeLock.release();
    };
  }, []);

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-col h-full animate-fade-in gap-4">
      <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Camera size={20} color="var(--accent-color)" /> Camera is Active
        </h3>
        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Enter this ID on the viewer device:</p>
        
        {peerId ? (
          <div 
            className="flex items-center justify-center gap-2" 
            style={{ 
              background: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              cursor: 'pointer' 
            }}
            onClick={copyId}
          >
            <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>{peerId}</span>
            {copied ? <CheckCircle size={20} color="var(--success-color)" /> : <Copy size={20} color="var(--text-secondary)" />}
          </div>
        ) : (
          <p>Generating ID...</p>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: '#000' }}>
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Simple dimming overlay for battery saving */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Screen dimmed to save battery</p>
        </div>
      </div>
    </div>
  );
}

export default CameraMode;
