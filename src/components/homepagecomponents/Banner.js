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
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
        zIndex: 1
      }}></div>
      
      <Container style={{ position: "relative", zIndex: 2 }}>
        <Row className="align-items-center">
          <Col xs={12} md={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div style={{
                animation: isVisible ? 'fadeInUp 1s ease-out' : 'none'
              }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  🚗 Carpooling with a Conscious
                </div>
                
                <h1 style={{
                  fontSize: '3.2rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '20px',
                  lineHeight: '1.2'
                }}>
                  Share a ride that is{" "}
                  <span style={{
                    background: "linear-gradient(45deg, #FFD700, #FFA500)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: '800',
                    fontSize: '3.3rem'
                  }}>
                    {text}
                  </span>
                </h1>
                
                <p style={{
                  fontSize: '1.3rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '40px',
                  lineHeight: '1.6',
                  fontWeight: '400',
                  maxWidth: '90%'
                }}>
                  Embrace a secure and reliable carpooling system built on Ethereum blockchain technology. 
                  Join thousands of commuters saving time, money, and the environment.
                </p>

                <div style={{
                  display: 'flex',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={scrollToProjects}
                    style={{
                      background: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                      color: "white",
                      border: "none",
                      padding: "15px 32px",
                      borderRadius: "10px",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 6px 20px rgba(255, 107, 107, 0.4)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
                    }}
                  >
                    📖 Learn More
                  </button>
                </div>
              </div>}
            </TrackVisibility>
          </Col>
          
          <Col xs={12} md={5}>
            <div style={{
              animation: "float 6s ease-in-out infinite",
              textAlign: "center",
              position: "relative"
            }}>
              <div style={{
                fontSize: "10rem",
                color: "rgba(255, 255, 255, 0.4)",
                filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
                marginBottom: "20px"
              }}>
                🚘
              </div>
              <div style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "25px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textAlign: "center"
              }}>
                <h4 style={{ 
                  color: "white", 
                  fontWeight: "600",
                  marginBottom: "15px",
                  fontSize: "1.3rem"
                }}>
                  Why Choose Us?
                </h4>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  textAlign: "left"
                }}>
                  {[
                    { icon: "🔒", text: "Secure Blockchain Technology" },
                    { icon: "💰", text: "Save up to 30% on Commuting" },
                    { icon: "🌱", text: "Eco-Friendly Travel" },
                    { icon: "⏱️", text: "Quick & Reliable Matching" }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.95rem"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </section>
  )
}

export default Banner;