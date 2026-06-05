import React, { useState, useRef, useEffect } from 'react';
import { musicAPI } from '../services/api';
import { Upload, Plus, Music, Disc, Trash2, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [artistTracks, setArtistTracks] = useState([]);
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

  // Fetch artist's existing music
  const fetchArtistMusic = async () => {
    try {
      const { data } = await musicAPI.getArtistMusic();
      setArtistTracks(data);
    } catch (error) {
      console.error("Error fetching artist music:", error);
    }
  };

  useEffect(() => {
    fetchArtistMusic();
  }, []);

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
      // Reset file input
      const fileInput = document.getElementById('music-file-input');
      if (fileInput) fileInput.value = '';
      
      // Refresh the tracks list
      fetchArtistMusic();
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
      setAlbumData({
        title: '',
        description: '',
        coverImage: '',
        songs: []
      });
      // Clear inputs manually if needed
      document.getElementById('album-form').reset();
    } catch (error) {
      alert(error.response?.data?.message || 'Album creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <header className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Artist Studio</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your music catalog and release albums</p>
        </div>
        <div className="glass" style={{ display: 'flex', padding: '6px', borderRadius: '12px' }}>
          <TabBtn active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Upload size={18} />} label="Upload" />
          <TabBtn active={activeTab === 'album'} onClick={() => setActiveTab('album')} icon={<Disc size={18} />} label="Create Album" />
        </div>
      </header>

      <div ref={formRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', alignItems: 'start' }}>
        {activeTab === 'upload' ? (
          <>
            {/* Upload Track Form */}
            <div className="premium-card" style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
                <Music style={{ color: 'var(--accent)' }} /> Upload New Track
              </h2>
              <form onSubmit={handleMusicUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Track Title</label>
                  <input type="text" className="input-field" placeholder="Enter song title" value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>Audio File</label>
                  <input id="music-file-input" type="file" accept="audio/*" onChange={(e) => setMusicFile(e.target.files[0])} style={{ color: 'var(--text-secondary)', marginTop: '8px' }} required />
                </div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
                  {loading ? 'Uploading...' : 'Publish Track'}
                </button>
              </form>
            </div>

            {/* Current Catalog Listing */}
            <div className="premium-card" style={{ flex: 1, maxHeight: '420px', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>Your Tracks</h2>
              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                {artistTracks.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No tracks uploaded yet. Start publishing!</p>
                ) : (
                  artistTracks.map(t => (
                    <div key={t._id} className="glass" style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '12px 16px', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--gradient-primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Music size={16} color="white" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Live
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Create Album Form */
          <div className="premium-card" style={{ gridColumn: 'span 2' }}>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
              <Plus style={{ color: 'var(--accent)' }} /> Create New Album
            </h2>
            <form id="album-form" onSubmit={handleAlbumCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Album Title</label>
                  <input type="text" className="input-field" placeholder="E.g. Summer Vibes 2026" onChange={(e) => setAlbumData({...albumData, title: e.target.value})} required />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea className="input-field" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="Tell us about this album..." onChange={(e) => setAlbumData({...albumData, description: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Cover Image URL</label>
                  <input type="text" className="input-field" placeholder="https://image-url.com/cover.jpg" onChange={(e) => setAlbumData({...albumData, coverImage: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Select Songs for Album</label>
                  <div style={{ 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    maxHeight: '230px', 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}>
                    {artistTracks.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                        No tracks available. Please upload tracks first.
                      </p>
                    ) : (
                      artistTracks.map(t => (
                        <label key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                          <input 
                            type="checkbox" 
                            checked={albumData.songs.includes(t._id)}
                            onChange={(e) => {
                              const updatedSongs = e.target.checked
                                ? [...albumData.songs, t._id]
                                : albumData.songs.filter(id => id !== t._id);
                              setAlbumData({ ...albumData, songs: updatedSongs });
                            }}
                            style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '0.95rem' }}>{t.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 'auto', padding: '14px' }}>
                  {loading ? 'Creating...' : 'Create Album'}
                </button>
              </div>
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


