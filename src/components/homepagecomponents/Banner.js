import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TrackVisibility from 'react-on-screen';

const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["built for the modern commuter"];
  const period = 100;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(56, 182, 255, 0.2) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite",
        filter: "blur(20px)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(86, 119, 252, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite reverse",
        filter: "blur(15px)"
      }}></div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          background: "rgba(255, 255, 255, 0.6)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `floatParticle ${Math.random() * 10 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}></div>
      ))}
      
      <Container style={{ position: "relative", zIndex: 2 }}>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="order-2 order-md-1">
            <TrackVisibility>
              {({ isVisible }) =>
              <div style={{
                animation: isVisible ? 'slideInLeft 1s ease-out' : 'none'
              }}>
                <div style={{
                  background: "linear-gradient(90deg, rgba(86, 119, 252, 0.2) 0%, rgba(56, 182, 255, 0.2) 100%)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  padding: '14px 28px',
                  borderRadius: '50px',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '35px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
                }}>
                  🚗 Smart Carpooling Revolution
                </div>
                
                <h1 style={{
                  fontSize: '3.5rem',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '25px',
                  lineHeight: '1.1',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  Share rides{" "}
                  <span style={{
                    background: "linear-gradient(45deg, #38B6FF, #5677FC)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: '900',
                    fontSize: '3.6rem',
                    display: 'block',
                    marginTop: '10px'
                  }}>
                    {text}
                  </span>
                </h1>
                
                <p style={{
                  fontSize: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '45px',
                  lineHeight: '1.7',
                  fontWeight: '400',
                  maxWidth: '95%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '25px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  Embrace a secure and reliable carpooling system built on Ethereum blockchain technology. 
                  Join thousands of commuters saving time, money, and the environment.
                </p>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <button 
                    onClick={scrollToProjects}
                    style={{
                      background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                      color: "white",
                      border: "none",
                      padding: "18px 38px",
                      borderRadius: "15px",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      boxShadow: "0 10px 30px rgba(86, 119, 252, 0.4)",
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.02)';
                      e.target.style.boxShadow = '0 15px 35px rgba(86, 119, 252, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(86, 119, 252, 0.4)';
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 2 }}>🚀 Get Started</span>
                  </button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '5px'
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: '#FFD700', fontSize: '1.2rem' }}>⭐</span>
                      ))}
                    </div>
                    <span>Rated 4.9/5 by 10k+ users</span>
                  </div>
                </div>
              </div>}
            </TrackVisibility>
          </Col>
          
          <Col xs={12} md={6} className="order-1 order-md-2">
            <div style={{
              animation: "float 8s ease-in-out infinite",
              textAlign: "center",
              position: "relative"
            }}>
              <div style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                <div style={{
                  fontSize: "18rem",
                  color: "rgba(86, 119, 252, 0.3)",
                  filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4))",
                  marginBottom: "30px",
                  animation: "pulse 3s ease-in-out infinite"
                }}>
                  🚘
                </div>
                
                {/* Floating badges around the car */}
                {[
                  { icon: "🔒", text: "Secure", top: "20%", left: "10%" },
                  { icon: "💰", text: "Save 30%", top: "30%", right: "15%" },
                  { icon: "🌱", text: "Eco", bottom: "40%", left: "5%" },
                  { icon: "⚡", text: "Fast", bottom: "25%", right: "10%" }
                ].map((badge, index) => (
                  <div key={index} style={{
                    position: "absolute",
                    top: badge.top,
                    left: badge.left,
                    right: badge.right,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "50px",
                    padding: "10px 15px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "white",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    animation: `floatBadge ${3 + index * 0.5}s ease-in-out infinite`,
                    animationDelay: `${index * 0.3}s`
                  }}>
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes floatBadge {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.1);
          }
        }
      `}</style>
    </section>
  )
}

export default Banner;