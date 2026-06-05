import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [trackIndex, setTrackIndex] = useState(0);

  // Check login on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { data } = await authAPI.getProfile();
        setUser(data);
      } catch (err) {
        // Not logged in or invalid token
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoadingProfile(false);
      }
    };
    checkLogin();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout API call error:", err);
    }
    setUser(null);
    localStorage.removeItem('user');
    setCurrentTrack(null);
    setIsPlaying(false);
    setPlaylist([]);
  };

  // Playback controls
  const playTrack = (track, newPlaylist = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
      const index = newPlaylist.findIndex(t => t._id === track._id || t.id === track.id);
      setTrackIndex(index !== -1 ? index : 0);
    } else {
      setPlaylist([track]);
      setTrackIndex(0);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (playlist.length <= 1) return;
    const nextIdx = (trackIndex + 1) % playlist.length;
    setTrackIndex(nextIdx);
    setCurrentTrack(playlist[nextIdx]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (playlist.length <= 1) return;
    const prevIdx = (trackIndex - 1 + playlist.length) % playlist.length;
    setTrackIndex(prevIdx);
    setCurrentTrack(playlist[prevIdx]);
    setIsPlaying(true);
  };

  return (
    <AppContext.Provider value={{
      user,
      loadingProfile,
      login,
      logout,
      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,
      playlist,
      setPlaylist,
      trackIndex,
      playTrack,
      pauseTrack,
      resumeTrack,
      nextTrack,
      prevTrack
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
