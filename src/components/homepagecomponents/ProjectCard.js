import { Col } from "react-bootstrap";

const ProjectCard = ({ title, description, imgUrl }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        padding: '0',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        height: '100%',
        backdropFilter: 'blur(10px)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 15px 40px rgba(86, 119, 252, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(86, 119, 252, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
      >
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: '220px'
        }}>
          <img 
            src={imgUrl} 
            alt={title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(10, 10, 42, 0.8) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '20px'
          }}>
            <h4 style={{ 
              color: '#fff', 
              fontWeight: '700',
              fontSize: '1.3rem',
              margin: 0,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}>
              {title}
            </h4>
          </div>
          
          {/* Hover effect overlay */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'linear-gradient(45deg, rgba(86, 119, 252, 0.2), rgba(56, 182, 255, 0.2))',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hover-overlay"
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              transform: 'scale(0)',
              transition: 'transform 0.3s ease'
            }}
            className="hover-icon"
            >
              👁️
            </div>
          </div>
        </div>
        
        <div style={{ 
          padding: '25px 20px',
          background: 'transparent'
        }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: '0 0 20px 0',
            fontWeight: '500'
          }}>
            {description}
          </p>
          
          <div style={{
            padding: '12px 24px',
            background: 'linear-gradient(45deg, rgba(86, 119, 252, 0.2), rgba(56, 182, 255, 0.2))',
            borderRadius: '10px',
            border: '1px solid rgba(86, 119, 252, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#38B6FF',
            fontWeight: '700',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(45deg, #5677FC, #38B6FF)';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(45deg, rgba(86, 119, 252, 0.2), rgba(56, 182, 255, 0.2))';
            e.target.style.color = '#38B6FF';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            <span>Learn More</span>
            <span style={{ transition: 'transform 0.3s ease' }}>→</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-overlay:hover {
          opacity: 1;
        }
        
        .hover-overlay:hover .hover-icon {
          transform: scale(1);
        }
      `}</style>
    </Col>
  );
};

export default ProjectCard;