import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Play, Disc, TrendingUp, Radio, Search, Pause, Music, Volume2, X, Headphones, Sparkles } from 'lucide-react';
import { musicAPI } from '../services/api';
import { useApp } from '../context/AppContext';

const Home = () => {
  const container = useRef();
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack } = useApp();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-badge', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .from('.hero-title', {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power4.out',
    }, '-=0.3')
    .from('.hero-text', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-btns button, .hero-btns a', {
      scale: 0.9,
      opacity: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: 'back.out(1.7)',
    }, '-=0.3')
    .from('.feature-card', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    }, '-=0.2');
  }, { scope: container });

  // Fetch all music from DB
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const { data } = await musicAPI.getAllMusic();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching music:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  // Animate tracks when loaded
  useGSAP(() => {
    if (tracks.length > 0) {
      gsap.from('.track-item', {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [tracks]);

  // Handle Play/Pause logic
  const handleTrackAction = (track) => {
    const isCurrent = currentTrack && (currentTrack._id === track._id);
    if (isCurrent) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    } else {
      playTrack(track, filteredTracks);
    }
  };

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.artist?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={container} className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 0 20px', position: 'relative' }}>
        {/* Subtle hero glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }} />

        <div className="hero-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'var(--accent-subtle)',
          border: '1px solid rgba(59, 130, 246, 0.15)',
          color: 'var(--accent)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '24px',
          letterSpacing: '0.02em',
        }}>
          <Sparkles size={14} />
          AI-Powered Recommendations
        </div>

        <h1 
          className="hero-title"
          style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            fontWeight: 900, 
            marginBottom: '20px', 
            background: 'linear-gradient(135deg, #f0f0f5 0%, #3b82f6 50%, #8b5cf6 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            animation: 'gradient-shift 8s ease infinite',
          }}
        >
          Your Music,<br />Elevated.
        </h1>
        <p className="hero-text" style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.15rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '540px', 
          margin: '0 auto 36px', 
          lineHeight: 1.7 
        }}>
          Experience high-fidelity sound, discover new releases, and get personalized smart AI recommendations.
        </p>
        <div className="hero-btns" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '0.95rem' }} onClick={() => {
            document.getElementById('library-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <Headphones size={18} />
            Explore Library
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <FeatureCard icon={<TrendingUp size={24} />} title="Trending Hits" description="Stay updated with what the world is listening to right now." />
        <FeatureCard icon={<Disc size={24} />} title="New Releases" description="Be the first to hear the latest albums from your favorite artists." />
        <FeatureCard icon={<Radio size={24} />} title="Live Radio" description="Tune into live sessions and curated playlists 24/7." />
      </section>

      {/* Library Section */}
      <section id="library-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>Browse Melodies</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Stream high-fidelity music uploaded by our artist community</p>
          </div>
          
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search songs or artists..." 
              className="input-field" 
              style={{ paddingLeft: '42px', paddingRight: searchQuery ? '36px' : '16px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                  width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <div style={{ 
              display: 'inline-block', 
              width: '36px', height: '36px', 
              borderRadius: '50%',
              border: '3px solid var(--border-subtle)', 
              borderLeftColor: 'var(--accent)', 
              animation: 'spin 0.8s linear infinite',
              marginBottom: '16px' 
            }} />
            <p style={{ fontSize: '0.9rem' }}>Loading the catalog...</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div style={{ 
            padding: '60px 24px', 
            textAlign: 'center', 
            border: '1px dashed var(--border-default)', 
            borderRadius: 'var(--radius-xl)',
            background: 'var(--accent-subtle)',
          }}>
            <Music size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: 700 }}>No Songs Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Be the first to upload an audio track as an artist!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {filteredTracks.map((track) => {
              const isCurrent = currentTrack && (currentTrack._id === track._id);
              const isCurrentPlaying = isCurrent && isPlaying;
              return (
                <div 
                  key={track._id}
                  className="premium-card track-item"
                  onClick={() => handleTrackAction(track)}
                  style={{
                    cursor: 'pointer',
                    padding: 0,
                    overflow: 'hidden',
                    borderColor: isCurrent ? 'var(--border-accent)' : undefined,
                    boxShadow: isCurrent ? 'var(--shadow-glow), var(--shadow-md)' : undefined,
                  }}
                >
                  {/* Album art placeholder */}
                  <div className="track-artwork">
                    {isCurrentPlaying ? (
                      <div className="equalizer">
                        <div className="bar" />
                        <div className="bar" />
                        <div className="bar" />
                        <div className="bar" />
                      </div>
                    ) : (
                      <Music size={28} style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-tertiary)', position: 'relative', zIndex: 1 }} />
                    )}

                    {/* Play overlay on hover */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                      }}>
                        {isCurrentPlaying ? <Pause size={20} fill="white" color="white" /> : <Play size={20} fill="white" color="white" style={{ marginLeft: '2px' }} />}
                      </div>
                    </div>
                  </div>

                  {/* Track info */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    <h4 style={{ 
                      fontSize: '0.92rem', 
                      fontWeight: 600, 
                      marginBottom: '4px', 
                      whiteSpace: 'nowrap', 
                      textOverflow: 'ellipsis', 
                      overflow: 'hidden',
                      color: isCurrent ? 'var(--accent)' : 'var(--text-primary)',
                    }}>
                      {track.title}
                    </h4>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}>
                      {track.artist?.username || 'Unknown Artist'}
                    </p>
                    {isCurrentPlaying && (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        color: 'var(--accent)', 
                        fontWeight: 600, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        marginTop: '6px',
                      }}>
                        <Volume2 size={12} /> Now Playing
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const cardRef = useRef();

  return (
    <div 
      ref={cardRef}
      className="premium-card feature-card" 
      style={{ textAlign: 'center', padding: '32px 24px' }}
    >
      <div className="feature-icon" style={{ margin: '0 auto 20px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '10px', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.88rem' }}>{description}</p>
    </div>
  );
};

export default Home;
