import { Col } from "react-bootstrap";

const ProjectCard = ({ title, description, imgUrl }) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
        padding: '0',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      }}
      >
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          height: '180px'
        }}>
          <img 
            src={imgUrl} 
            alt={title} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
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
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '15px'
          }}>
            <h4 style={{ 
              color: '#fff', 
              fontWeight: '600',
              fontSize: '1.1rem',
              margin: 0,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}>
              {title}
            </h4>
          </div>
        </div>
        
        <div style={{ 
          padding: '20px 15px',
          background: 'white'
        }}>
          <p style={{ 
            color: '#4a5568', 
            fontSize: '0.9rem',
            lineHeight: '1.5',
            margin: '0 0 15px 0'
          }}>
            {description}
          </p>
          
          <div style={{
            padding: '8px 16px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '6px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#667eea',
            fontWeight: '500',
            fontSize: '0.85rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#667eea';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
            e.target.style.color = '#667eea';
          }}
          >
            Learn More
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProjectCard;