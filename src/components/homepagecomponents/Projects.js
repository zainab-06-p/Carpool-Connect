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
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      padding: '100px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)",
        zIndex: 1
      }}></div>
      
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    🚀 Our Premium Services
                  </div>
                  
                  <h2 style={{ 
                    color: 'white', 
                    fontWeight: '800', 
                    marginBottom: '50px',
                    fontSize: '3rem',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}>
                    Why Choose Carpool Connect?
                  </h2>
                  
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Nav variant="pills" className="justify-content-center" style={{ 
                      marginBottom: '50px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '50px',
                      padding: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'inline-flex'
                    }}>
                      <Nav.Item>
                        <Nav.Link 
                          eventKey="first" 
                          style={{ 
                            color: '#ffffff', 
                            fontWeight: '600',
                            padding: '12px 30px',
                            borderRadius: '40px',
                            margin: '0 5px',
                            transition: 'all 0.3s ease'
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
                            color: '#ffffff', 
                            fontWeight: '600',
                            padding: '12px 30px',
                            borderRadius: '40px',
                            margin: '0 5px',
                            transition: 'all 0.3s ease'
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
                            color: '#ffffff', 
                            fontWeight: '600',
                            padding: '12px 30px',
                            borderRadius: '40px',
                            margin: '0 5px',
                            transition: 'all 0.3s ease'
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
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          padding: '30px',
                          marginBottom: '40px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.2rem',
                            margin: 0,
                            fontWeight: '500'
                          }}>
                            Wide range of vehicles, suited for everyone, everyday.
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
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          padding: '40px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          textAlign: 'left'
                        }}>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            margin: 0
                          }}>
                            As a member of our carpooling network, you'll have access to an extensive network of verified drivers and passengers. 
                            Say goodbye to long commutes and hello to a more efficient and eco-friendly way of traveling. Our advanced matching 
                            algorithm intelligently connects you with compatible carpool partners, ensuring a seamless and comfortable ride every time.
                          </p>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '20px',
                            marginTop: '30px'
                          }}>
                            {['🚀 Quick Matching', '🔒 Secure Payments', '🌱 Eco-Friendly', '💰 Cost Saving'].map((benefit, index) => (
                              <div key={index} style={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                padding: '15px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                border: '1px solid rgba(102, 126, 234, 0.2)'
                              }}>
                                <span style={{
                                  color: '#fff',
                                  fontWeight: '600'
                                }}>
                                  {benefit}
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
          background: linear-gradient(45deg, #667eea, #764ba2) !important;
          color: white !important;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
      `}</style>
    </section>
  );
};

export default Projects;