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
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      padding: '100px 0',
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
          radial-gradient(circle at 70% 30%, rgba(86, 119, 252, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(56, 182, 255, 0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }}></div>

      {/* Floating Elements */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 100 + 20}px`,
          height: `${Math.random() * 100 + 20}px`,
          background: "rgba(86, 119, 252, 0.05)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `skillsFloat ${Math.random() * 20 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}></div>
      ))}
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '30px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                background: "linear-gradient(90deg, rgba(86, 119, 252, 0.2) 0%, rgba(56, 182, 255, 0.2) 100%)",
                color: "#fff",
                padding: '12px 28px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                display: 'inline-block',
                marginBottom: '25px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
              }}>
                💬 What Our Community Says
              </div>
              
              <h2 style={{ 
                color: 'white', 
                fontWeight: '800', 
                marginBottom: '20px',
                fontSize: '2.8rem',
                background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Passenger Testimonials
              </h2>
              
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '50px',
                fontSize: '1.2rem',
                lineHeight: '1.7',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '500'
              }}>
                Car-sharing saves them up to thousands of rupees a year! An average carpooler saves about 20-30% each month on commuting, 
                depending on the distance covered. Ride-sharing decreases the amount of carbon monoxide and other greenhouse gases emitted by vehicles everyday.
              </p>
              
              <Carousel 
                responsive={responsive} 
                infinite={true} 
                className="skill-slider"
                autoPlay={true}
                autoPlaySpeed={4000}
                keyBoardControl={true}
                customTransition="all 0.6s ease"
                transitionDuration={600}
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                {[
                  { 
                    meter: meter1, 
                    title: "Safety & Comfort",
                    text: "Highly safe and comfortable rides. The drivers are professional and vehicles are well-maintained.",
                    rating: "⭐⭐⭐⭐⭐"
                  },
                  { 
                    meter: meter2, 
                    title: "Professionalism",
                    text: "Appreciated drivers and their professionalism. Always on time and very courteous.",
                    rating: "⭐⭐⭐⭐⭐"
                  },
                  { 
                    meter: meter3, 
                    title: "Affordability",
                    text: "Special discounts for employees and workers make it very affordable for daily commute.",
                    rating: "⭐⭐⭐⭐⭐"
                  },
                  { 
                    meter: meter1, 
                    title: "Security & Ease",
                    text: "Enhanced data security and ease-of-operation. The app is very user-friendly and secure.",
                    rating: "⭐⭐⭐⭐⭐"
                  }
                ].map((testimonial, index) => (
                  <div key={index} style={{ 
                    padding: '20px 15px',
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '25px',
                      padding: '35px 25px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.4s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(86, 119, 252, 0.3)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(86, 119, 252, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div>
                        <div style={{
                          fontSize: '1.8rem',
                          marginBottom: '20px',
                          color: '#FFD700',
                          lineHeight: '1',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}>
                          {testimonial.rating}
                        </div>
                        
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: '0 8px 25px rgba(86, 119, 252, 0.4)'
                        }}>
                          <img src={testimonial.meter} alt={testimonial.title} style={{ 
                            width: '40px', 
                            height: '40px',
                            filter: 'brightness(0) invert(1)'
                          }} />
                        </div>
                        
                        <h4 style={{ 
                          color: '#ffffff', 
                          margin: '0 0 15px 0',
                          fontWeight: '700',
                          fontSize: '1.3rem'
                        }}>
                          {testimonial.title}
                        </h4>
                        
                        <h5 style={{ 
                          color: 'rgba(255, 255, 255, 0.9)', 
                          margin: '0',
                          fontWeight: '500',
                          fontSize: '1rem',
                          lineHeight: '1.6'
                        }}>
                          "{testimonial.text}"
                        </h5>
                      </div>
                      
                      <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        background: 'rgba(86, 119, 252, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(86, 119, 252, 0.2)'
                      }}>
                        <span style={{
                          color: '#38B6FF',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          Verified User
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
              
              {/* Stats Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '25px',
                marginTop: '60px',
                padding: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {[
                  { number: "10K+", label: "Happy Users" },
                  { number: "95%", label: "Satisfaction Rate" },
                  { number: "30%", label: "Average Savings" },
                  { number: "4.9/5", label: "App Rating" }
                ].map((stat, index) => (
                  <div key={index} style={{
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '10px'
                    }}>
                      {stat.number}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes skillsFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-20px) rotate(180deg) scale(1.1);
          }
        }
      `}</style>
    </section>
  )
}

export default Skills;