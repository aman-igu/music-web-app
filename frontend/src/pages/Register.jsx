import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { UserPlus, Mail, Lock, User, Music2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef();

  useGSAP(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.7)',
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(formData);
      alert('Registration Successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div 
        ref={cardRef}
        className="premium-card" 
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Join the world of premium music</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              type="text" 
              placeholder="Username" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <label style={{ flex: 1 }}>
              <input 
                type="radio" 
                name="role" 
                value="user" 
                checked={formData.role === 'user'} 
                onChange={() => setFormData({...formData, role: 'user'})}
                style={{ display: 'none' }}
              />
              <div className={`input-field`} style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                borderColor: formData.role === 'user' ? 'var(--accent)' : 'var(--glass-border)',
                background: formData.role === 'user' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}>
                Listener
              </div>
            </label>
            <label style={{ flex: 1 }}>
              <input 
                type="radio" 
                name="role" 
                value="artist" 
                checked={formData.role === 'artist'} 
                onChange={() => setFormData({...formData, role: 'artist'})}
                style={{ display: 'none' }}
              />
              <div className={`input-field`} style={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                borderColor: formData.role === 'artist' ? 'var(--accent)' : 'var(--glass-border)',
                background: formData.role === 'artist' ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}>
                Artist
              </div>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Creating account...' : <><UserPlus size={20} /> Register</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;

