import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import ProjectCard from "./ProjectCard";
import projImg1 from "../../assets/img/jenny-ueberberg-v_1k3vRX4kg-unsplash.jpg";
import projImg2 from "../../assets/img/sincerely-media-dGxOgeXAXm8-unsplash.jpg";
import projImg3 from "../../assets/img/dan-nelson-ah-HeguOe9k-unsplash.jpg";
import projImg4 from "../../assets/img/artur-aldyrkhanov-tC0g72uns0M-unsplash.jpg";
import projImg5 from "../../assets/img/kylie-paz-aml-5TDo2_k-unsplash.jpg";
import projImg6 from "../../assets/img/jannis-lucas-3_Pm95bUwLg-unsplash.jpg";
import TrackVisibility from 'react-on-screen';

const Projects = () => {
  const projects = [
    {
      title: "Female Drivers",
      description: "Available on request to make your rides safe at odd hours",
      imgUrl: projImg1,
    },
    {
      title: "Worker Benefits",
      description: "We can't help you with deadlines, but with a valid ID, your travel is made easy.",
      imgUrl: projImg2,
    },
    {
      title: "Maximum Security",
      description: "Blockchain Technology ensures maximum data privacy for our users.",
      imgUrl: projImg3,
    },
  ];

  const vehiclesdescription = [
    {
      title: "Well-Equipped Navigation System",
      description: "To ensure you reach your destinations on time.",
      imgUrl: projImg6,
    },
    {
      title: "Spacious",
      description: "..or not, if you're a party of 2. Our vehicles comfortably fit any number of people.",
      imgUrl: projImg5,
    },
    {
      title: "Well-Maintained",
      description: "Comfortable rides on the worst of roads are ensured.",
      imgUrl: projImg4,
    },
  ];

  return (
    <section style={{ 
      background: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #0f0c29 100%)",
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "5%",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(86, 119, 252, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "pulse 8s ease-in-out infinite",
        filter: "blur(40px)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "8%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(56, 182, 255, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "pulse 6s ease-in-out infinite reverse",
        filter: "blur(30px)"
      }}></div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 8 + 2}px`,
          height: `${Math.random() * 8 + 2}px`,
          background: "rgba(86, 119, 252, 0.4)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `floatParticle ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          filter: 'blur(1px)'
        }}></div>
      ))}
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: "linear-gradient(90deg, rgba(86, 119, 252, 0.2) 0%, rgba(56, 182, 255, 0.2) 100%)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    padding: '14px 32px',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    display: 'inline-block',
                    marginBottom: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
                  }}>
                    🚀 Premium Carpooling Services
                  </div>
                  
                  <h2 style={{ 
                    color: 'white', 
                    fontWeight: '800', 
                    marginBottom: '60px',
                    fontSize: '3.5rem',
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Why Choose Carpool Connect?
                  </h2>
                  
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Nav variant="pills" className="justify-content-center" style={{ 
                      marginBottom: '60px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '50px',
                      padding: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'inline-flex',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="first" 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontWeight: '700',
                            padding: '14px 35px',
                            borderRadius: '40px',
                            margin: '0 8px',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            border: '1px solid transparent'
                          }}
                          className="nav-link-custom"
                        >
                          ✨ Features
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="second" 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontWeight: '700',
                            padding: '14px 35px',
                            borderRadius: '40px',
                            margin: '0 8px',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            border: '1px solid transparent'
                          }}
                          className="nav-link-custom"
                        >
                          🚗 Vehicles
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="third" 
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            fontWeight: '700',
                            padding: '14px 35px',
                            borderRadius: '40px',
                            margin: '0 8px',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            border: '1px solid transparent'
                          }}
                          className="nav-link-custom"
                        >
                          💎 Benefits
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Row>
                          {projects.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                          ))}
                        </Row>
                      </Tab.Pane>
                      
                      <Tab.Pane eventKey="second">
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(15px)',
                          borderRadius: '25px',
                          padding: '35px',
                          marginBottom: '50px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                        }}>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '1.3rem',
                            margin: 0,
                            fontWeight: '600',
                            textAlign: 'center'
                          }}>
                            🚙 Wide range of premium vehicles, perfectly suited for everyone's daily commute needs.
                          </p>
                        </div>
                        <Row>
                          {vehiclesdescription.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                          ))}
                        </Row>
                      </Tab.Pane>
                      
                      <Tab.Pane eventKey="third">
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(15px)',
                          borderRadius: '25px',
                          padding: '45px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          textAlign: 'left',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                        }}>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '1.2rem',
                            lineHeight: '1.8',
                            margin: '0 0 35px 0',
                            fontWeight: '500'
                          }}>
                            As a member of our advanced carpooling network, you'll have exclusive access to an extensive network of verified drivers and passengers. 
                            Say goodbye to stressful commutes and welcome a more efficient, eco-friendly way of traveling. Our intelligent matching 
                            algorithm connects you with perfectly compatible carpool partners, ensuring a seamless and comfortable ride experience every time.
                          </p>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '25px',
                            marginTop: '35px'
                          }}>
                            {[
                              { icon: '🚀', text: 'Quick Matching' },
                              { icon: '🔒', text: 'Secure Payments' },
                              { icon: '🌱', text: 'Eco-Friendly' },
                              { icon: '💰', text: 'Cost Saving' },
                              { icon: '⭐', text: 'Premium Service' },
                              { icon: '⚡', text: 'Fast Support' }
                            ].map((benefit, index) => (
                              <div key={index} style={{
                                background: 'linear-gradient(135deg, rgba(86, 119, 252, 0.15), rgba(56, 182, 255, 0.15))',
                                padding: '20px 15px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                border: '1px solid rgba(86, 119, 252, 0.2)',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(5px)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 119, 252, 0.25), rgba(56, 182, 255, 0.25))';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(86, 119, 252, 0.15), rgba(56, 182, 255, 0.15))';
                              }}
                              >
                                <div style={{
                                  fontSize: '2rem',
                                  marginBottom: '12px',
                                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                }}>
                                  {benefit.icon}
                                </div>
                                <span style={{
                                  color: '#fff',
                                  fontWeight: '700',
                                  fontSize: '1rem'
                                }}>
                                  {benefit.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              }
            </TrackVisibility>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .nav-link-custom.active {
          background: linear-gradient(45deg, #5677FC, #38B6FF) !important;
          color: white !important;
          box-shadow: 0 8px 25px rgba(86, 119, 252, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.05);
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
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
      `}</style>
    </section>
  );
};

export default Projects;