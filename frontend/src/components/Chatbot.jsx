import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Play, Disc } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { gsap } from 'gsap';

const Chatbot = () => {
  const { user, playTrack } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi there! I'm Melodix AI, your personal music assistant. 🎧\n\nAsk me for music recommendations based on your mood, activities, or tell me what vibes you're looking for (e.g. "I want to party", "relaxing beats", "energetic gym music")!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableTracks, setAvailableTracks] = useState([]);

  const chatRef = useRef(null);
  const triggerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle open/close GSAP animations
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatRef.current, 
        { opacity: 0, scale: 0.8, y: 100 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiAPI.chat({ message: userMsg.text });
      
      // Store returned songs list context for resolving play actions
      if (data.songs) {
        setAvailableTracks(data.songs);
      }

      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Oops! I encountered an error connecting to my server. Make sure you are logged in and the server is running." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse message text and extract song links
  const renderMessageContent = (msg) => {
    if (msg.sender === 'user') {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>;
    }

    // Bot message parsing: check for (ID: <id>)
    const idRegex = /\(ID:\s*([a-f0-9]{24})\)/g;
    
    // Find all matches
    const matches = [...msg.text.matchAll(idRegex)];
    
    if (matches.length === 0) {
      return <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>;
    }

    // Clean up text (remove the (ID: xxx) clutter for clean reading) and display matching play cards
    const cleanedText = msg.text.replace(/\(ID:\s*[a-f0-9]{24}\)/g, '');

    return (
      <div>
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: '12px' }}>{cleanedText}</div>
        
        {/* Render interactive direct-play cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          {matches.map((match, idx) => {
            const songId = match[1];
            const track = availableTracks.find(t => t.id === songId || t._id === songId);
            
            if (!track) return null;

            return (
              <div 
                key={songId + '-' + idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <Disc size={18} className="text-accent" style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {track.artist}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => playTrack({ _id: track.id, title: track.title, artist: track.artist, uri: track.uri })}
                  className="btn-primary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Play size={12} fill="white" /> Play
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Only render if user is logged in
  if (!user) return null;

  return (
    <div style={{ position: 'fixed', bottom: '110px', right: '30px', zIndex: 999 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          ref={triggerRef}
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--gradient-primary)',
            border: 'none',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, rotation: 10, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotation: 0, duration: 0.2 })}
          title="Ask AI Assistant"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Slide-up Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="glass"
          style={{
            width: '360px',
            height: '480px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
        >
          {/* Chat Header */}
          <div 
            style={{ 
              background: 'var(--gradient-primary)', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px', borderRadius: '8px' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Melodix AI Assistant</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            style={{ 
              flex: 1, 
              padding: '16px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              background: 'rgba(9, 9, 11, 0.4)'
            }}
          >
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease forwards'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '85%', 
                    padding: '12px 16px', 
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '16px 16px 16px 2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={dotStyle(0)}></span>
                  <span style={dotStyle(0.2)}></span>
                  <span style={dotStyle(0.4)}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form 
            onSubmit={handleSend}
            style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              display: 'flex', 
              gap: '10px',
              background: 'rgba(24, 24, 27, 0.9)',
              alignItems: 'center'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask for recommendations..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem'
              }}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', flexShrink: 0 }}
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      
      {/* Styles for fadeIn and bouncing dots */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-dot { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
};

const dotStyle = (delay) => ({
  width: '6px',
  height: '6px',
  background: 'var(--text-secondary)',
  borderRadius: '50%',
  display: 'inline-block',
  animation: 'bounce-dot 1s infinite ease-in-out',
  animationDelay: `${delay}s`
});

export default Chatbot;
