import meter1 from "../../assets/img/meter1.svg";
import meter2 from "../../assets/img/meter2.svg";
import meter3 from "../../assets/img/meter3.svg";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1
    }
  };

  return (
    <section style={{ 
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      padding: '80px 0',
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
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(15px)',
              borderRadius: '25px',
              padding: '50px 30px',
              textAlign: 'center',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                padding: '10px 25px',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}>
                💬 Passenger Testimonials
              </div>
              
              <h2 style={{ 
                color: 'white', 
                fontWeight: '700', 
                marginBottom: '15px',
                fontSize: '2.2rem'
              }}>
                What Our Community Says
              </h2>
              
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '40px',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}>
                Car-sharing saves them up to thousands of rupees a year! An average carpooler saves about 20-30% each month on commuting, 
                depending on the distance covered. Ride-sharing decreases the amount of carbon monoxide and other greenhouse gases emitted by vehicles everyday.
              </p>
              
              <Carousel 
                responsive={responsive} 
                infinite={true} 
                className="skill-slider"
                autoPlay={true}
                autoPlaySpeed={3500}
                keyBoardControl={true}
                customTransition="all 0.5s ease"
                transitionDuration={500}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                <div style={{ 
                  padding: '20px 15px',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1.8rem',
                        marginBottom: '15px',
                        color: '#FFD700',
                        lineHeight: '1'
                      }}>
                        ⭐⭐⭐⭐⭐
                      </div>
                      <img src={meter1} alt="Safety" style={{ 
                        width: '60px', 
                        height: '60px',
                        margin: '0 auto 15px',
                        filter: 'brightness(0) invert(1)'
                      }} />
                      <h5 style={{ 
                        color: '#ffffff', 
                        margin: '0',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5'
                      }}>
                        "Highly safe and comfortable rides. The drivers are professional and vehicles are well-maintained."
                      </h5>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  padding: '20px 15px',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1.8rem',
                        marginBottom: '15px',
                        color: '#FFD700',
                        lineHeight: '1'
                      }}>
                        ⭐⭐⭐⭐⭐
                      </div>
                      <img src={meter2} alt="Professionalism" style={{ 
                        width: '60px', 
                        height: '60px',
                        margin: '0 auto 15px',
                        filter: 'brightness(0) invert(1)'
                      }} />
                      <h5 style={{ 
                        color: '#ffffff', 
                        margin: '0',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5'
                      }}>
                        "Appreciated drivers and their professionalism. Always on time and very courteous."
                      </h5>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  padding: '20px 15px',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1.8rem',
                        marginBottom: '15px',
                        color: '#FFD700',
                        lineHeight: '1'
                      }}>
                        ⭐⭐⭐⭐⭐
                      </div>
                      <img src={meter3} alt="Discounts" style={{ 
                        width: '60px', 
                        height: '60px',
                        margin: '0 auto 15px',
                        filter: 'brightness(0) invert(1)'
                      }} />
                      <h5 style={{ 
                        color: '#ffffff', 
                        margin: '0',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5'
                      }}>
                        "Special discounts for employees and workers make it very affordable for daily commute."
                      </h5>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  padding: '20px 15px',
                  textAlign: 'center',
                  height: '100%'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '25px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1.8rem',
                        marginBottom: '15px',
                        color: '#FFD700',
                        lineHeight: '1'
                      }}>
                        ⭐⭐⭐⭐⭐
                      </div>
                      <img src={meter1} alt="Security" style={{ 
                        width: '60px', 
                        height: '60px',
                        margin: '0 auto 15px',
                        filter: 'brightness(0) invert(1)'
                      }} />
                      <h5 style={{ 
                        color: '#ffffff', 
                        margin: '0',
                        fontWeight: '500',
                        fontSize: '1rem',
                        lineHeight: '1.5'
                      }}>
                        "Enhanced data security and ease-of-operation. The app is very user-friendly and secure."
                      </h5>
                    </div>
                  </div>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills;