import React, { useState, useRef, useEffect } from 'react';
import { musicAPI } from '../services/api';
import { Upload, Plus, Music, Disc, Trash2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const formRef = useRef();

  // Music upload state
  const [musicTitle, setMusicTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);

  // Album creation state
  const [albumData, setAlbumData] = useState({
    title: '',
    description: '',
    coverImage: '',
    songs: [] // Array of song IDs
  });

  useGSAP(() => {
    gsap.from('.header-content', {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { opacity: 0, x: activeTab === 'upload' ? -30 : 30 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeTab]);

  const handleMusicUpload = async (e) => {
    e.preventDefault();
    if (!musicFile) return alert('Please select a music file');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', musicTitle);
    formData.append('file', musicFile);

    try {
      await musicAPI.createMusic(formData);
      alert('Music uploaded successfully!');
      setMusicTitle('');
      setMusicFile(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await musicAPI.createAlbum(albumData);
      alert('Album created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Album creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header className="header-content" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Artist Studio</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your music and albums</p>
        </div>
        <div className="glass" style={{ display: 'flex', padding: '6px', borderRadius: '12px' }}>
          <TabBtn active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Upload size={18} />} label="Upload" />
          <TabBtn active={activeTab === 'album'} onClick={() => setActiveTab('album')} icon={<Disc size={18} />} label="Create Album" />
        </div>
      </header>

      <div ref={formRef}>
        {activeTab === 'upload' ? (
          <div className="premium-card">
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Music className="text-accent" /> Upload New Track
            </h2>
            <form onSubmit={handleMusicUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Track Title</label>
                <input type="text" className="input-field" placeholder="Enter song title" value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Audio File</label>
                <input type="file" accept="audio/*" onChange={(e) => setMusicFile(e.target.files[0])} style={{ color: 'var(--text-secondary)', marginTop: '8px' }} required />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Publish Track'}
              </button>
            </form>
          </div>
        ) : (
          <div className="premium-card">
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Plus className="text-accent" /> Create New Album
            </h2>
            <form onSubmit={handleAlbumCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Album Title</label>
                <input type="text" className="input-field" placeholder="E.g. Summer Vibes 2024" onChange={(e) => setAlbumData({...albumData, title: e.target.value})} required />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea className="input-field" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Tell us about this album..." onChange={(e) => setAlbumData({...albumData, description: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Cover Image URL</label>
                <input type="text" className="input-field" placeholder="https://image-url.com/cover.jpg" onChange={(e) => setAlbumData({...albumData, coverImage: e.target.value})} />
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Album'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }) => {
  const btnRef = useRef();

  const handleMouseEnter = () => {
    if (!active) {
      gsap.to(btnRef.current, { backgroundColor: 'rgba(255, 255, 255, 0.05)', scale: 1.05, duration: 0.2 });
    }
  };

  const handleMouseLeave = () => {
    if (!active) {
      gsap.to(btnRef.current, { backgroundColor: 'transparent', scale: 1, duration: 0.2 });
    }
  };

  return (
    <button 
      ref={btnRef}
      onClick={onClick} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: active ? 'var(--gradient-primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-secondary)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 600,
        transition: 'all 0.2s'
      }}
    >
      {icon} {label}
    </button>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 };

export default ArtistDashboard;

