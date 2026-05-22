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
    <div className="flex-col h-full animate-pop-in gap-4">
      <div className="brutal-panel pink-shadow text-center sticker-tilt-right" style={{ padding: '1.5rem', background: 'var(--bg-secondary)' }}>
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-pink)' }}>
          <div style={{ background: 'var(--accent-cyan)', padding: '0.5rem', border: '2px solid var(--text-primary)', transform: 'rotate(-5deg)' }}>
             <Camera size={24} color="var(--bg-primary)" />
          </div>
          Camera is Active
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '1rem', background: 'var(--accent-cyan)', color: '#000', padding: '0.25rem 0.5rem', display: 'inline-block', transform: 'rotate(1deg)' }}>Enter this ID on the viewer device:</p>
        
        {peerId ? (
          <div 
            className="flex items-center justify-center gap-2 sticker-tilt-left" 
            style={{ 
              background: '#000', 
              padding: '1rem', 
              border: '3px solid var(--accent-pink)',
              boxShadow: '4px 4px 0px var(--accent-cyan)',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
            onClick={copyId}
          >
            <span style={{ fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--text-primary)' }}>{peerId}</span>
            {copied ? <CheckCircle size={24} color="var(--accent-cyan)" /> : <Copy size={24} color="var(--accent-pink)" />}
          </div>
        ) : (
          <p style={{ fontWeight: 'bold', color: 'var(--accent-pink)' }}>Generating ID...</p>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', border: '4px solid var(--accent-cyan)', boxShadow: '6px 6px 0px var(--accent-pink)' }}>
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
          background: 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="sticker-tilt-right" style={{ background: 'var(--accent-pink)', color: '#000', padding: '0.5rem 1rem', border: '3px solid #000', fontWeight: 'bold' }}>
             Screen dimmed to save battery
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraMode;
