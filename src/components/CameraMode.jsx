import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Camera, Copy, CheckCircle, Activity } from 'lucide-react';

function CameraMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const peerRef = useRef(null);
  const dataConnectionsRef = useRef([]);
  const prevDataRef = useRef(null);
  const lastAlertTimeRef = useRef(0);
  const [peerId, setPeerId] = useState('');
  const [copied, setCopied] = useState(false);
  const [stream, setStream] = useState(null);
  const [sensitivity, setSensitivity] = useState(50);
  const sensitivityRef = useRef(50);
  const [motionDetected, setMotionDetected] = useState(false);

  // Keep ref in sync with state for the setInterval closure
  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

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

        // 3. Answer incoming video calls
        peer.on('call', (call) => {
          console.log('Incoming call, answering...');
          call.answer(mediaStream);
        });

        // 4. Accept incoming data connections (for alerts)
        peer.on('connection', (conn) => {
          console.log('Data connection established with Viewer');
          dataConnectionsRef.current.push(conn);
          conn.on('close', () => {
            dataConnectionsRef.current = dataConnectionsRef.current.filter(c => c !== conn);
          });
        });

        // 5. Start Motion Detection Loop
        const intervalId = setInterval(() => detectMotion(videoRef.current), 500);

        return () => clearInterval(intervalId);
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

  const detectMotion = (videoElement) => {
    if (!videoElement || !canvasRef.current) return;
    if (videoElement.readyState < 2) return; // Wait for video to have data

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoElement, 0, 0, 64, 64);
    
    const currentData = ctx.getImageData(0, 0, 64, 64).data;
    let diffScore = 0;

    if (prevDataRef.current) {
      for (let i = 0; i < currentData.length; i += 4) {
        const rDiff = Math.abs(currentData[i] - prevDataRef.current[i]);
        const gDiff = Math.abs(currentData[i+1] - prevDataRef.current[i+1]);
        const bDiff = Math.abs(currentData[i+2] - prevDataRef.current[i+2]);
        const avgDiff = (rDiff + gDiff + bDiff) / 3;
        
        // Pixel noise threshold
        if (avgDiff > 20) {
          diffScore++;
        }
      }
    }
    
    prevDataRef.current = currentData;

    // diffScore max is 64x64 = 4096
    // Sensitivity 1 -> needs ~2000 pixels changed
    // Sensitivity 100 -> needs ~50 pixels changed
    const requiredPixels = 2050 - (sensitivityRef.current * 20);
    
    if (diffScore > requiredPixels) {
      const now = Date.now();
      // Throttle alerts to max 1 per 5 seconds
      if (now - lastAlertTimeRef.current > 5000) {
        lastAlertTimeRef.current = now;
        
        setMotionDetected(true);
        setTimeout(() => setMotionDetected(false), 2000);

        // Broadcast to all connected viewers
        dataConnectionsRef.current.forEach(conn => {
          if (conn.open) {
            conn.send('MOTION_DETECTED');
          }
        });
      }
    }
  };

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)', padding: '1rem', border: '3px solid var(--accent-cyan)', boxShadow: '4px 4px 0px var(--accent-pink)' }} className="sticker-tilt-left">
        <Activity size={24} color="var(--accent-pink)" />
        <div style={{ flex: 1 }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <span>Motion Sensitivity</span>
            <span>{sensitivity}%</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={sensitivity} 
            onChange={(e) => setSensitivity(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', padding: '0', border: 'none', height: 'auto', background: 'transparent', boxShadow: 'none', transform: 'none' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000', border: '4px solid var(--accent-cyan)', boxShadow: '6px 6px 0px var(--accent-pink)' }}>
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <canvas ref={canvasRef} width={64} height={64} style={{ display: 'none' }} />
        
        {/* Simple dimming overlay for battery saving */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: motionDetected ? 'rgba(255, 105, 180, 0.3)' : 'rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s ease'
        }}>
          {motionDetected ? (
            <div className="sticker-tilt-left" style={{ background: 'var(--danger-color)', color: '#fff', padding: '1rem 2rem', border: '4px solid var(--accent-cyan)', fontWeight: '900', fontSize: '1.5rem', textTransform: 'uppercase' }}>
              Motion Detected!
            </div>
          ) : (
            <div className="sticker-tilt-right" style={{ background: 'var(--accent-pink)', color: '#000', padding: '0.5rem 1rem', border: '3px solid #000', fontWeight: 'bold' }}>
               Screen dimmed to save battery
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraMode;
