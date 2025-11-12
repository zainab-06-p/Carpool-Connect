import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { Link } from 'react-router-dom';
import Leaf from "../images/leaf.png"
import { display } from '@mui/system';
import "../stylesheets/slidercss.css";

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function LoginPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleAdminCheckboxChange = (event) => {
    setIsAdmin(!isAdmin);
    console.log(isAdmin);
  };

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);

          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);

          const contract = new web3.eth.Contract(CommuteIOABI, contractAddress);
          setContract(contract);
        } catch (error) {
          console.error('Error initializing Web3:', error);
          alert('An error occurred while initializing Web3. Please make sure you have MetaMask installed and try again.');
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    initialize();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    if(isAdmin){
      if(isChecked){
        try {
          setLoading(true);
          const message = 'Login authentication: ' + Date.now();
          const signature = await web3.eth.personal.sign(message, accounts[0]);
          history.push(`/administrator-login`);
        }
        catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      else{alert("Please confirm the verification of your digital signature.")}
      
    }
    else{
      if (isChecked) {
        const passengerID = event.target.passengerID.value;
        console.log(passengerID, typeof (passengerID));
        const obj = await contract.methods.GetPassDetails(passengerID).call();
        const passDetails = Object.values(obj);
        if ((passengerID == passDetails[0]) && (passDetails[2] == accounts[0])) {
          try {
            setLoading(true);
            const message = 'Login authentication: ' + Date.now();
            const signature = await web3.eth.personal.sign(message, accounts[0]);
            history.push(`/startaride/${passengerID}`);
            history.push(`/bookaride/${passengerID}`);
            history.push(`/viewallrides/${passengerID}`);
            history.push(`/ridehistory/${passengerID}`);
            history.push(`/myinprogressrides/${passengerID}`);
            history.push(`/dashboard/${passengerID}`);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
        else {
          alert("Invalid Passenger ID or Wallet Address.");
        }
      }
      else {
        alert('Please confirm the verification of your digital signature.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #0f0c29 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(86, 119, 252, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite",
        filter: "blur(40px)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite reverse",
        filter: "blur(30px)"
      }}></div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          background: "rgba(86, 119, 252, 0.6)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `floatParticle ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          filter: 'blur(1px)'
        }}></div>
      ))}

      {/* Header */}
      <header style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        background: 'rgba(10, 10, 42, 0.8)',
        backdropFilter: 'blur(15px)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(86, 119, 252, 0.2)',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'linear-gradient(45deg, #5677FC, #38B6FF)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 8px 25px rgba(86, 119, 252, 0.4)'
            }}>
              🚗
            </div>
            <h1 style={{
              margin: 0,
              background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2rem',
              fontWeight: '800'
            }}>
              CARPOOL CONNECT
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <Link to="/" style={{
              color: '#38B6FF',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '8px 16px',
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
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        maxWidth: '1200px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 2,
        marginTop: '40px'
      }}>
        
        {/* Left Side - Visual & Info */}
        <div style={{
          padding: '60px 50px',
          background: 'linear-gradient(135deg, rgba(86, 119, 252, 0.1) 0%, rgba(56, 182, 255, 0.1) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(86, 119, 252, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(56, 182, 255, 0.05) 0%, transparent 50%)
            `,
            zIndex: 1
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '50px'
            }}>
              <div style={{
                fontSize: '5rem',
                marginBottom: '25px',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                animation: 'bounce 3s ease-in-out infinite'
              }}>
                {isAdmin ? '👨‍💼' : '🚗'}
              </div>
              
              <h2 style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '15px',
                background: 'linear-gradient(45deg, #38B6FF, #5677FC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {isAdmin ? 'Admin Portal' : 'Welcome Back'}
              </h2>
              
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                marginBottom: '0',
                fontWeight: '500'
              }}>
                {isAdmin 
                  ? 'Manage the platform with secure administrator access and blockchain-powered tools.'
                  : 'Join thousands of eco-conscious commuters in our blockchain-secured carpooling network.'
                }
              </p>
            </div>

            {/* Features List */}
            <div style={{
              display: 'grid',
              gap: '20px'
            }}>
              {[
                { icon: '🔒', title: 'Blockchain Security', desc: 'Military-grade encryption' },
                { icon: '⚡', title: 'Instant Login', desc: 'Digital signature verification' },
                { icon: '🌱', title: 'Eco Community', desc: 'Reduce carbon footprint' },
                { icon: '💰', title: 'Save Money', desc: 'Split commuting costs' }
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '18px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(86, 119, 252, 0.1)';
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <div style={{
                    fontSize: '2rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <div style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '1rem',
                      marginBottom: '4px'
                    }}>
                      {feature.title}
                    </div>
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      {feature.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={{
          padding: '60px 50px',
          background: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Role Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
            gap: '25px'
          }}>
            <span style={{
              color: !isAdmin ? '#5677FC' : '#a0aec0',
              fontWeight: '700',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}>
              User Login
            </span>
            
            <label className="switch" style={{ margin: '0' }}>
              <input 
                type="checkbox" 
                checked={isAdmin} 
                onChange={handleAdminCheckboxChange} 
              />
              <span className="slider round"></span>
            </label>
            
            <span style={{
              color: isAdmin ? '#5677FC' : '#a0aec0',
              fontWeight: '700',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}>
              Admin Login
            </span>
          </div>

          {/* Form Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h3 style={{
              color: '#2d3748',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '10px'
            }}>
              {isAdmin ? 'Administrator Access' : 'Secure Login'}
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {isAdmin 
                ? 'Access the administrator dashboard'
                : 'Sign in to your carpooling account'
              }
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Wallet Address */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                color: '#4a5568',
                fontWeight: '700',
                marginBottom: '12px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>👛</span>
                Connected Wallet Address
              </label>
              <input
                type="text"
                value={accounts[0] || 'Not connected'}
                readOnly
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  background: '#f7fafc',
                  color: '#718096',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            {/* Passenger ID (Only for Users) */}
            {!isAdmin && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  color: '#4a5568',
                  fontWeight: '700',
                  marginBottom: '12px',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🎫</span>
                  Passenger ID
                </label>
                <input
                  type="number"
                  name="passengerID"
                  placeholder="Enter your Passenger ID"
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5677FC';
                    e.target.style.background = '#f7fafc';
                    e.target.style.boxShadow = '0 0 0 4px rgba(86, 119, 252, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Digital Signature Agreement */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '15px',
              marginBottom: '35px',
              padding: '20px',
              background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)',
              borderRadius: '15px',
              border: '2px solid #fc8181'
            }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                style={{
                  transform: 'scale(1.3)',
                  marginTop: '3px',
                  accentColor: '#5677FC'
                }}
              />
              <div>
                <label style={{
                  color: '#2d3748',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  🔐 Verify My Digital Signature
                </label>
                <p style={{
                  color: '#718096',
                  fontSize: '0.9rem',
                  margin: '0',
                  lineHeight: '1.5',
                  fontWeight: '500'
                }}>
                  I authorize this platform to use my digital signature for secure blockchain authentication and login verification.
                </p>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !isChecked}
              style={{
                width: '100%',
                background: isChecked && !loading 
                  ? 'linear-gradient(45deg, #5677FC, #38B6FF)' 
                  : '#cbd5e0',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isChecked && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                marginBottom: '25px',
                boxShadow: isChecked && !loading ? '0 10px 30px rgba(86, 119, 252, 0.4)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (isChecked && !loading) {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 15px 35px rgba(86, 119, 252, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (isChecked && !loading) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(86, 119, 252, 0.4)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Authenticating...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span>{isAdmin ? '👨‍💼' : '🚗'}</span>
                  Login as {isAdmin ? 'Administrator' : 'User'}
                </div>
              )}
            </button>

            {/* Registration Link */}
            {!isAdmin && (
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: '#718096',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  marginBottom: '15px'
                }}>
                  New to our platform?
                </p>
                <Link 
                  to={'/new-application-for-passenger'} 
                  style={{
                    color: '#5677FC',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    padding: '12px 24px',
                    border: '2px solid #5677FC',
                    borderRadius: '10px',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#5677FC';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#5677FC';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Create New Account
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
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
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Enhanced Switch Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 70px;
          height: 38px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e0;
          transition: .4s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 30px;
          width: 30px;
          left: 4px;
          bottom: 4px;
          background: linear-gradient(45deg, #5677FC, #38B6FF);
          transition: .4s;
          box-shadow: 0 2px 8px rgba(86, 119, 252, 0.4);
        }

        input:checked + .slider {
          background-color: rgba(86, 119, 252, 0.2);
        }

        input:checked + .slider:before {
          transform: translateX(32px);
          background: linear-gradient(45deg, #5677FC, #38B6FF);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;