import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Music, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const navRef = useRef();

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  });

  return (
    <nav 
      ref={navRef}
      className="glass" 
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        zIndex: 1000,
      }}
    >
      <Link 
        to="/" 
        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}
        onMouseEnter={(e) => gsap.to(e.currentTarget.querySelector('div'), { rotation: 360, duration: 0.8, ease: 'back.out' })}
        onMouseLeave={(e) => gsap.to(e.currentTarget.querySelector('div'), { rotation: 0, duration: 0.8, ease: 'back.out' })}
      >
        <div style={{ background: 'var(--gradient-primary)', padding: '8px', borderRadius: '10px' }}>
          <Music size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>MELODIX</span>
      </Link>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <NavLink to="/artist/dashboard" icon={<LayoutDashboard size={18} />} text="Artist Studio" />
        <NavLink to="/login" icon={<LogIn size={18} />} text="Login" />
        <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
          <UserPlus size={18} />
          <span>Join Now</span>
        </Link>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => {
  const linkRef = useRef();

  const handleMouseEnter = () => {
    gsap.to(linkRef.current, {
      color: 'var(--text-primary)',
      x: 5,
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(linkRef.current, {
      color: 'var(--text-secondary)',
      x: 0,
      duration: 0.3,
    });
  };

  return (
    <Link 
      ref={linkRef}
      to={to} 
      className="nav-link" 
      style={navLinkStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  fontWeight: 500,
  transition: 'color 0.2s',
};

export default Navbar;

