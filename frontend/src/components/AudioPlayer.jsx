import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';
import { gsap } from 'gsap';

const AudioPlayer = () => {
  const { currentTrack, isPlaying, setIsPlaying, nextTrack, prevTrack } = useApp();
  const audioRef = useRef(null);
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Sync play/pause with context
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Handle track source changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!currentTrack) return null;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className="glass"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1000px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      <audio 
        ref={audioRef}
        src={currentTrack.uri}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%', minWidth: '150px' }}>
        <div style={{ position: 'relative' }}>
          <Disc 
            size={36} 
            className="text-accent" 
            style={{ 
              animation: isPlaying ? 'spin-disc 4s linear infinite' : 'none', 
              color: 'var(--accent)'
            }} 
          />
          <style>{`
            @keyframes spin-disc { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentTrack.title}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {currentTrack.artist?.username || currentTrack.artist || 'Unknown Artist'}
          </div>
        </div>
      </div>

      {/* Playback Controls & Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={prevTrack} style={btnStyle} title="Previous">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={handlePlayPause} 
            style={{ 
              ...btnStyle, 
              background: 'white', 
              color: 'black', 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" style={{ marginLeft: '2px' }} />}
          </button>
          <button onClick={nextTrack} style={btnStyle} title="Next">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            style={{ 
              flex: 1, 
              height: '4px', 
              accentColor: 'var(--accent)', 
              cursor: 'pointer',
              borderRadius: '2px'
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '25%', justifyContent: 'flex-end' }}>
        <button onClick={toggleMute} style={btnStyle}>
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          style={{ 
            width: '80px', 
            height: '4px', 
            accentColor: 'var(--accent)', 
            cursor: 'pointer',
            borderRadius: '2px'
          }}
        />
      </div>
    </div>
  );
};

const btnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '4px',
  transition: 'transform 0.1s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.8
};

export default AudioPlayer;
