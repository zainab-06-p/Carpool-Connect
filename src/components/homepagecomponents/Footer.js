import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{
      background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
      padding: '60px 0 30px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        zIndex: 1
      }}></div>
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="align-items-center">
          <Col md={6}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                CD
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #fff, #bdc3c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  CARPOOL DAPP
                </h3>
                <p style={{
                  margin: '5px 0 0 0',
                  opacity: '0.8',
                  fontSize: '0.9rem'
                }}>
                  Revolutionizing Commutes with Blockchain
                </p>
              </div>
            </div>
          </Col>
          
          <Col md={6}>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '10px',
                  opacity: '0.9'
                }}>
                  🔒
                </div>
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>Secure</span>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '10px',
                  opacity: '0.9'
                }}>
                  🌱
                </div>
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>Eco-Friendly</span>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '10px',
                  opacity: '0.9'
                }}>
                  💰
                </div>
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>Cost-Effective</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '40px',
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: 0,
                opacity: '0.7',
                fontSize: '0.9rem'
              }}>
                © 2024 Carpooling Dapp. All rights reserved. | Built on Ethereum Blockchain
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;