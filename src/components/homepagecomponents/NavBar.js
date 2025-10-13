import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Navbar expand="lg" fixed="top" style={{
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: isScrolled ? '1px solid #e2e8f0' : 'none',
      padding: '12px 0',
      transition: 'all 0.3s ease',
      boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
    }}>
      <Container>
        <Navbar.Brand 
          onClick={scrollToTop}
          style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.5rem',
            fontWeight: '700',
            textDecoration: 'none',
            margin: 0,
            cursor: 'pointer'
          }}
        >
          CARPOOL CONNECT
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{
          border: 'none',
          background: 'transparent',
          fontSize: '1.3rem',
          color: '#667eea'
        }}>
          ☰
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px'
          }}>
            <Nav.Link 
              href="#home" 
              style={{
                color: activeLink === 'home' ? '#667eea' : '#4a5568',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                background: activeLink === 'home' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
              }}
              onClick={() => onUpdateActiveLink('home')}
            >
              🏠 Home
            </Nav.Link>
            
            <Nav.Link 
              href="/verification-portal" 
              style={{
                color: activeLink === 'application-status' ? '#667eea' : '#4a5568',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                background: activeLink === 'application-status' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
              }}
              onClick={() => onUpdateActiveLink('application-status')}
            >
              📋 Application Status
            </Nav.Link>
          </Nav>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <Link 
              to={'/new-application-for-passenger'} 
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📝 Register
            </Link>
            
            <Link 
              to={'/login'} 
              style={{
                background: 'transparent',
                color: '#667eea',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.3s ease',
                border: '2px solid #667eea',
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              🔐 Login
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar;