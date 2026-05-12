import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Play, Disc, TrendingUp, Radio } from 'lucide-react';

const Home = () => {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
    .from('.hero-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')
    .from('.hero-btns button', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(1.7)',
    }, '-=0.4')
    .from('.feature-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
    }, '-=0.4');
  }, { scope: container });

  return (
    <div ref={container}>
      <section style={{ textAlign: 'center', padding: '60px 0' }}>
        <h1 
          className="hero-title"
          style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '20px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Your Music, Elevated.
        </h1>
        <p className="hero-text" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}>
          Experience high-fidelity sound, exclusive artist drops, and a community built for true music lovers.
        </p>
        <div className="hero-btns" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Get Started
          </button>
          <button className="glass" style={{ padding: '16px 40px', fontSize: '1.1rem', color: 'white' }}>
            Learn More
          </button>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '60px' }}>
        <FeatureCard icon={<TrendingUp size={32} />} title="Trending Hits" description="Stay updated with what the world is listening to right now." />
        <FeatureCard icon={<Disc size={32} />} title="New Releases" description="Be the first to hear the latest albums from your favorite artists." />
        <FeatureCard icon={<Radio size={32} />} title="Live Radio" description="Tune into live sessions and curated playlists 24/7." />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const cardRef = useRef();

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.inOut',
      boxShadow: 'none',
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="premium-card feature-card" 
      style={{ textAlign: 'center', transition: 'box-shadow 0.3s' }}
    >
      <div style={{ color: 'var(--accent)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
};

export default Home;

