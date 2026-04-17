import React from 'react';
import './Footer.css';
import cclogo from "../assets/ccLogo.png"; 
import { useScrollAnimation } from './hooks/useScrollAnimations.js';
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  useScrollAnimation();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo Section */}
        <div className="footer-section logo-section animate-fadeUp">
          <img src={cclogo} alt="C & C Logo" className="footer-logo" />
        </div>

        {/* Socials and Links Section */}
        <div 
          className="footer-section animate-fadeUp" 
          style={{ transitionDelay: '0.1s' }}
        >
          <h3 className="footer-title">Connect</h3>
          <ul className="footer-links">
            <li>
              <a href="/nopage">Instagram</a>
            </li>
            <li>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=marionnabulobi@gmail.com">
                Email
              </a>
            </li>
            <li>
              <a href="/nopage">Tiktok</a>
            </li>
          </ul>
        </div>

        {/* Menu Section */}
        <div 
          className="footer-section animate-fadeUp" 
          style={{ transitionDelay: '0.1s' }}
        >
          <h3 className="footer-title">Menu</h3>
          <ul className="footer-links">
            <li>
              <Link to="#">Home</Link>
            </li>
            <li>
              <Link to="#">Products</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="footer-bottom animate-slideUp">
        <p>© {year} Built and Designed by Marion Nabulobi</p>
      </div>
    </footer>
  );
}