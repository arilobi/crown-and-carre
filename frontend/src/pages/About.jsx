import React from 'react';
import '../components/Forms.css'; 
import formImage from "../assets/formImage.jpg";
import formImage2 from "../assets/formImage2.jpg";
import aboutImage from "../assets/aboutImage.jpg";
import { useScrollAnimation } from '../components/hooks/useScrollAnimations';
import { FaPaintBrush, FaHandshake, FaGlobe, FaStar } from "react-icons/fa";

export default function About() {
    useScrollAnimation();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Our Story</h1>
          <p className="about-hero-subtitle">Where art meets emotion</p>
        </div>
        <div className="about-hero-image">
          <img src={formImage} alt="Artist studio" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container animate-fadeUp">
          <div className="mission-grid">
            <div className="mission-text animate-fadeUp">
              <span className="section-tag">Our Mission</span>
              <h2 className="mission-title">Bringing art to every home</h2>
              <p className="mission-description">
                Crown & Carre was born from a passion for authentic, 
                handcrafted art that tells a story. We believe every piece 
                of art deserves a home where it can be cherished for 
                generations.
              </p>
              <p className="mission-description">
                Our curated collection features emerging and established 
                artists who pour their soul into every brushstroke, 
                creating pieces that resonate with emotion and meaning.
              </p>
            </div>
            <div className="mission-stats animate-fadeUp">
              <div className="stat-item">
                <span className="stat-number">5</span>
                <span className="stat-label">Artists</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Original Pieces</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container animate-fadeUp">
          <div className="story-grid">
            <div className="story-image">
              <div className="image-frame">
                <img src={aboutImage} alt="Artist at work" />
              </div>
            </div>
            <div className="story-content animate-fadeUp">
              <span className="section-tag">Our Beginning</span>
              <h2 className="story-title">A passion for authentic art</h2>
              <p className="story-text">
                Founded in 2020, Crown & Carre started as a small gallery 
                in Budapest with a simple belief: art should be accessible 
                to everyone. What began as a dream between two friends 
                has grown into a community of artists and art lovers 
                across the globe.
              </p>
              <p className="story-text">
                Every piece in our collection is carefully selected for 
                its unique voice and emotional depth. We work directly 
                with artists to ensure fair compensation and authentic 
                representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container animate-fadeUp">
          <div className="values-header">
            <span className="section-tag light">What We Stand For</span>
            <h2 className="values-title">Our values</h2>
          </div>
          <div className="values-grid animate-fadeUp">
            <div className="value-card">
              <div className="value-icon"><FaPaintBrush /></div>
              <h3 className="value-title">Authenticity</h3>
              <p className="value-text">
                Every piece is original and handcrafted with passion.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaHandshake /></div>
              <h3 className="value-title">Fair Trade</h3>
              <p className="value-text">
                We ensure our clients receive their work in pristine condition.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaGlobe /></div>
              <h3 className="value-title">Community</h3>
              <p className="value-text">
                Building connections between artists and art lovers.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaStar /></div>
              <h3 className="value-title">Quality</h3>
              <p className="value-text">
                Curated selection of the finest artistic expressions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}