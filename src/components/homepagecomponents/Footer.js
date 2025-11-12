import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%)",
      padding: '70px 0 30px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(56, 182, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(86, 119, 252, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>
      
      {/* Floating Elements */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 80 + 20}px`,
          height: `${Math.random() * 80 + 20}px`,
          background: "rgba(86, 119, 252, 0.05)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `footerFloat ${Math.random() * 20 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}></div>
      ))}
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="align-items-center">
          <Col md={4}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: '0 8px 25px rgba(86, 119, 252, 0.4)',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                🚗
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '2rem',
                  fontWeight: '800',
                  background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  CARPOOL CONNECT
                </h3>
                <p style={{
                  margin: '8px 0 0 0',
                  opacity: '0.8',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  Revolutionizing Commutes with Blockchain
                </p>
              </div>
            </div>
            
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '30px',
              maxWidth: '300px'
            }}>
              Join thousands of smart commuters saving time, money, and the environment through secure blockchain-powered carpooling.
            </p>
          </Col>
          
          <Col md={4}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '25px',
              textAlign: 'center'
            }}>
              {[
                { icon: "🔒", label: "Secure", desc: "Blockchain Protected" },
                { icon: "🌱", label: "Eco-Friendly", desc: "Reduce Carbon" },
                { icon: "💰", label: "Save 30%", desc: "On Commuting" },
                { icon: "⚡", label: "Fast", desc: "Quick Matching" }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  padding: '20px 15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'rgba(86, 119, 252, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                >
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '12px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '700',
                    marginBottom: '5px'
                  }}>
                    {item.label}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    opacity: '0.8',
                    fontWeight: '500'
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </Col>
          
          <Col md={4}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <h5 style={{
                color: 'white',
                fontWeight: '700',
                marginBottom: '20px',
                fontSize: '1.3rem'
              }}>
                🚀 Join Today
              </h5>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.95rem',
                marginBottom: '25px',
                lineHeight: '1.5'
              }}>
                Start your carpooling journey and experience the future of commuting.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                >
                  Get Started
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              marginTop: '50px',
              paddingTop: '25px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                opacity: '0.7',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                © 2024 Carpool Connect. All rights reserved. | Built on Ethereum Blockchain
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        @keyframes footerFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
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
      `}</style>
    </footer>
  );
};

export default Footer;