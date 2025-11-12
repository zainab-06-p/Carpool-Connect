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
      background: isScrolled ? 'rgba(10, 10, 42, 0.95)' : 'rgba(10, 10, 42, 0.9)',
      backdropFilter: 'blur(15px)',
      borderBottom: isScrolled ? '1px solid rgba(86, 119, 252, 0.2)' : 'none',
      padding: '15px 0',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.2)' : 'none'
    }}>
      <Container>
        <Navbar.Brand 
          onClick={scrollToTop}
          style={{
            background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '1.8rem',
            fontWeight: '800',
            textDecoration: 'none',
            margin: 0,
            cursor: 'pointer',
            textShadow: '0 2px 10px rgba(86, 119, 252, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 15px rgba(86, 119, 252, 0.4)'
          }}>
            🚗
          </div>
          CARPOOL CONNECT
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{
          border: 'none',
          background: 'transparent',
          fontSize: '1.5rem',
          color: '#38B6FF',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(86, 119, 252, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
        }}
        >
          ☰
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '35px'
          }}>
            <Nav.Link 
              href="#home" 
              style={{
                color: activeLink === 'home' ? '#38B6FF' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                background: activeLink === 'home' ? 'rgba(86, 119, 252, 0.15)' : 'transparent',
                border: activeLink === 'home' ? '1px solid rgba(86, 119, 252, 0.3)' : '1px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => onUpdateActiveLink('home')}
              onMouseEnter={(e) => {
                if (activeLink !== 'home') {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.color = '#38B6FF';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== 'home') {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>🏠 Home</span>
            </Nav.Link>
            
            <Nav.Link 
              href="/verification-portal" 
              style={{
                color: activeLink === 'application-status' ? '#38B6FF' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: '700',
                fontSize: '1rem',
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                background: activeLink === 'application-status' ? 'rgba(86, 119, 252, 0.15)' : 'transparent',
                border: activeLink === 'application-status' ? '1px solid rgba(86, 119, 252, 0.3)' : '1px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => onUpdateActiveLink('application-status')}
              onMouseEnter={(e) => {
                if (activeLink !== 'application-status') {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.color = '#38B6FF';
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== 'application-status') {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                }
              }}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>📋 Application Status</span>
            </Nav.Link>
          </Nav>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <Link 
              to={'/new-application-for-passenger'} 
              style={{
                background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(86, 119, 252, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 10px 25px rgba(86, 119, 252, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 6px 20px rgba(86, 119, 252, 0.4)';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>📝</span>
              Register Now
            </Link>
            
            <Link 
              to={'/login'} 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#38B6FF',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                border: '2px solid rgba(86, 119, 252, 0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(86, 119, 252, 0.2)';
                e.target.style.borderColor = '#5677FC';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(86, 119, 252, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🔐</span>
              Login
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar;