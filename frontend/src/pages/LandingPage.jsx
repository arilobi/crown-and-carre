import cover2 from "../assets/cover2.jpg";
import formImage2 from "../assets/formImage2.jpg";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lenis from '@studio-freight/lenis';

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleBuyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  };

  // Smooth scroll setup 
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Scroll animation detection
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, { threshold: 0.2 });

    const animatedElements = document.querySelectorAll(
      '.animate-fadeUp, .animate-slideDown, .animate-slideUp, .stagger-item'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const faqData = [
    {
      question: 'Do you do custom paintings?',
      answer: 'Currently, we do not.'
    },
    {
      question: 'Do you have a physical shop?',
      answer: 'Unfortunately, we do not. However, it is something that as a team were striving to achieve.'
    },
    {
      question: 'Do you sell internationally?',
      answer: 'Yes, we do but you will have to contact our team for further inquiries.'
    }
  ];

  const FAQAccordion = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleAccordion = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
      <div className="faq-container">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question-container">
              <h2 className="faq-question">{faq.question}</h2>
              <button 
                onClick={() => toggleAccordion(index)} 
                className="faq-toggle-btn"
                aria-label={expandedIndex === index ? 'Collapse' : 'Expand'}
              >
                {expandedIndex === index ? '−' : '+'}
              </button>
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Hero section */}
      <div className="hero-video animate-fadeUp">
        <img src={formImage2} alt="Painting of three women" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-main-title">CROWN & CARRE</h1>
            <p className="hero-sub-title">The Art Of Essential</p>
          </div>
          <a href="/login" className="hero-btn">Shop now →</a>
        </div>
      </div>

      {/* BEST SELLERS SECTION */}
      <div className="best-sellers-section">
       
        <div className="best-sellers-header animate-slideDown">
          <h1>Best Sellers</h1>
          <div className="circle-view-container">
            <a href="/login" className="circle-view-link">
              <div className="circle-view">
                <svg viewBox="0 0 200 200">
                  <defs>
                    <path id="circlePath" d="M 100,100 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
                  </defs>
                  <text fill="currentColor" fontSize="16" fontWeight="500" fontFamily="Crimson Text">
                    <textPath href="#circlePath" startOffset="0%">
                      • VIEW ALL • VIEW ALL • VIEW ALL • VIEW ALL •
                    </textPath>
                  </text>
                </svg>
                <span className="center-arrow">→</span>
              </div>
            </a>
          </div>
        </div>

        {/* Product grid */}
        <div className="best-sellers">
          <div className="best-section">
            {[
              { img: p1, alt: "The Montrea Women", title: "The Montrea Women" },
              { img: p4, alt: "Afternoon Tea", title: "Afternoon Tea" },
              { img: p3, alt: "Swan Lake", title: "The Swan Lake" },
              { img: p2, alt: "Riding The Sun", title: "Riding The Sun" }
            ].map((item, index) => (
              <div 
                key={index}
                className="wrap-section stagger-item"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <img src={item.img} alt={item.alt} className="wrap-image" />
                <h3>{item.title}</h3>
                <div className="price-container">
                  <span className="price">$250.00</span>
                  <button className="buy-btn" onClick={handleBuyClick}>BUY</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="faq-section animate-slideUp">
        <h2 className="faq-title">FAQ's</h2>
        <FAQAccordion />
      </div>
    </>
  );
}