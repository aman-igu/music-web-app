import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Music, LayoutDashboard, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav 
        ref={navRef}
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '1200px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          zIndex: 1000,
          background: scrolled ? 'rgba(9, 9, 11, 0.85)' : 'rgba(16, 16, 22, 0.6)',
          backdropFilter: scrolled ? 'blur(30px)' : 'blur(20px)',
          WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'blur(20px)',
          border: `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{ 
            background: 'var(--gradient-primary)', 
            padding: '8px', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            transition: 'box-shadow 0.3s ease'
          }}>
            <Music size={20} color="white" />
          </div>
          <span style={{ 
            fontSize: '1.15rem', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>MELODIX</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user && user.role === 'artist' && (
            <NavLink to="/artist/dashboard" icon={<LayoutDashboard size={16} />} text="Studio" active={isActive('/artist/dashboard')} />
          )}
          
          {user ? (
            <>
              <div className="avatar" style={{ marginLeft: '8px' }}>
                {user.username?.charAt(0) || 'U'}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginRight: '4px' }}>
                {user.username}
              </span>
              <button 
                onClick={handleLogout} 
                className="btn-ghost"
                style={{ 
                  padding: '7px 14px', 
                  fontSize: '0.82rem',
                  borderRadius: '10px',
                  gap: '6px',
                }}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={<LogIn size={16} />} text="Login" active={isActive('/login')} />
              <Link 
                to="/register" 
                className="btn-primary" 
                style={{ 
                  padding: '8px 18px', 
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  borderRadius: '10px',
                }}
              >
                <UserPlus size={16} />
                <span>Join Free</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button 
          className="show-mobile-only"
          onClick={() => setMobileOpen(true)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-menu">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <Link to="/" style={mobileNavItemStyle} onClick={() => setMobileOpen(false)}>
              <Music size={18} /> Home
            </Link>
            
            {user && user.role === 'artist' && (
              <Link to="/artist/dashboard" style={mobileNavItemStyle} onClick={() => setMobileOpen(false)}>
                <LayoutDashboard size={18} /> Artist Studio
              </Link>
            )}

            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '12px 0' }} />

            {user ? (
              <>
                <div style={{ ...mobileNavItemStyle, cursor: 'default' }}>
                  <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                    {user.username?.charAt(0) || 'U'}
                  </div>
                  {user.username}
                </div>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ ...mobileNavItemStyle, border: 'none', width: '100%', background: 'transparent', color: 'var(--error)' }}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={mobileNavItemStyle} onClick={() => setMobileOpen(false)}>
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" style={mobileNavItemStyle} onClick={() => setMobileOpen(false)}>
                  <UserPlus size={18} /> Register
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

const NavLink = ({ to, icon, text, active }) => (
  <Link 
    to={to} 
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textDecoration: 'none',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      fontSize: '0.88rem',
      fontWeight: 500,
      padding: '7px 14px',
      borderRadius: '10px',
      background: active ? 'var(--accent-subtle)' : 'transparent',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

const mobileNavItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.2s',
  fontFamily: 'inherit',
};

export default Navbar;
