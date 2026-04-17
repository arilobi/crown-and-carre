import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  

const NoPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Keyframe animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes eyeLid {
        from, 40%, 45%, to { transform: translateY(0); }
        42.5% { transform: translateY(17.5px); }
      }
      @keyframes eyes {
        from { transform: translateY(112.5px); }
        to { transform: translateY(15px); }
      }
      @keyframes pupil {
        from, 37.5%, 40%, 45%, 87.5%, to {
          stroke-dashoffset: 0;
          transform: translate(0, 0);
        }
        12.5%, 25%, 62.5%, 75% {
          stroke-dashoffset: 0;
          transform: translate(-35px, 0);
        }
        42.5% {
          stroke-dashoffset: 35;
          transform: translate(0, 17.5px);
        }
      }
      @keyframes mouthLeft {
        from, 50% { stroke-dashoffset: -102; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes mouthRight {
        from, 50% { stroke-dashoffset: 102; }
        to { stroke-dashoffset: 0; }
      }
      @keyframes nose {
        from { transform: translate(0, 0); }
        to { transform: translate(0, 22.5px); }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const styles = {
    wrapper: {
      minHeight: '100vh',  
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#060F1A',  
      padding: '120px 2rem 2rem',  
      boxSizing: 'border-box',
    },
    content: {
      textAlign: 'center',
      maxWidth: '700px',
      margin: '0 auto',
    },
    face: {
      display: 'block',
      width: '18em', 
      height: 'auto',
      margin: '0 auto 2.5rem',
      color: '#EAE4CC',  
    },
    textContainer: {
      marginTop: '2rem',
    },
    heading: {
      fontFamily: "'Wittgenstein', serif",  
      fontSize: '8rem', 
      fontWeight: 500,
      color: '#EAE4CC',
      marginBottom: '0.5rem',
      lineHeight: 1,
      letterSpacing: '-0.02em',  
    },
    subheading: {
      fontFamily: "'Wittgenstein', serif",
      fontSize: '2rem',
      fontWeight: 400,
      color: '#EAE4CC',
      marginBottom: '1rem',
      opacity: 0.8,
    },
    paragraph: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '1.2rem',
      color: '#666',  
      marginBottom: '3rem',
      maxWidth: '450px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    homeButton: {
      display: 'inline-block',
      fontFamily: "'DM Sans', sans-serif",
      backgroundColor: isHovered ? 'transparent' : '#EAE4CC',
      color: isHovered ? '#EAE4CC' : '#060F1A',
      textDecoration: 'none',
      padding: '14px 42px',
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.08em',  
      transition: 'all 0.3s ease',
      border: '2px solid #EAE4CC',
      cursor: 'pointer',
      textTransform: 'uppercase',  
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <svg 
          style={styles.face}
          viewBox="0 0 320 380" 
          width="320px" 
          height="380px" 
          aria-label="A 404 becomes a face, looks to the sides, and blinks. The 4s slide up, the 0 slides down, and then a mouth appears."
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="25"
          >
            <g style={{ animation: 'eyes 1s 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards' }} transform="translate(0, 112.5)">
              <g transform="translate(15, 0)">
                <polyline 
                  style={{ animation: 'eyeLid 4s 1.3s infinite' }}
                  points="37,0 0,120 75,120" 
                />
                <polyline 
                  style={{ animation: 'pupil 4s 1.3s infinite' }}
                  points="55,120 55,155" 
                  strokeDasharray="35 35" 
                />
              </g>
              <g transform="translate(230, 0)">
                <polyline 
                  style={{ animation: 'eyeLid 4s 1.3s infinite' }}
                  points="37,0 0,120 75,120" 
                />
                <polyline 
                  style={{ animation: 'pupil 4s 1.3s infinite' }}
                  points="55,120 55,155" 
                  strokeDasharray="35 35" 
                />
              </g>
            </g>
            <rect 
              style={{ animation: 'nose 1s 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}
              rx="4" 
              ry="4" 
              x="132.5" 
              y="112.5" 
              width="55" 
              height="155" 
            />
            <g strokeDasharray="102 102" transform="translate(65, 334)">
              <path 
                style={{ animation: 'mouthLeft 1s 0.3s cubic-bezier(0.33, 1, 0.68, 1) forwards' }}
                d="M 0 30 C 0 30 40 0 95 0" 
                strokeDashoffset="-102" 
              />
              <path 
                style={{ animation: 'mouthRight 1s 0.3s cubic-bezier(0.33, 1, 0.68, 1) forwards' }}
                d="M 95 0 C 150 0 190 30 190 30" 
                strokeDashoffset="102" 
              />
            </g>
          </g>
        </svg>
        
        <div style={styles.textContainer}>
          <h1 style={styles.heading}>404</h1>
          <h2 style={styles.subheading}>Page Not Found</h2>
          <p style={styles.paragraph}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            style={styles.homeButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoPage;