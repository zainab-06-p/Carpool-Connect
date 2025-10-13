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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
        zIndex: 1
      }}></div>

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '0',
        right: '0',
        zIndex: 3
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '15px 40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: 0,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2rem',
            fontWeight: '800'
          }}>
            CARPOOL CONNECT
          </h1>
        </div>
      </div>

      {/* Main Login Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '900px',
        position: 'relative',
        zIndex: 2,
        marginTop: '80px'
      }}>
        {/* Toggle Switch */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '20px'
        }}>
          <span style={{
            color: !isAdmin ? '#667eea' : '#a0aec0',
            fontWeight: '600',
            fontSize: '1rem',
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
            color: isAdmin ? '#667eea' : '#a0aec0',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}>
            Admin Login
          </span>
        </div>

        {/* Login Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Side - Welcome Message */}
          <div style={{
            textAlign: 'center',
            padding: '30px'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px',
              color: '#667eea'
            }}>
              {isAdmin ? '👨‍💼' : '🚗'}
            </div>
            
            <h2 style={{
              color: '#2d3748',
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '15px'
            }}>
              Welcome to {isAdmin ? 'Admin Portal' : 'Carpool Connect'}
            </h2>
            
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '0'
            }}>
              {isAdmin 
                ? 'Access the administrator dashboard to manage passenger applications and platform operations.'
                : 'Join thousands of commuters saving time, money, and the environment through smart carpooling.'
              }
            </p>

            <div style={{
              marginTop: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {[
                { icon: '🔒', text: 'Secure Blockchain Login' },
                { icon: '⚡', text: 'Instant Verification' },
                { icon: '🌱', text: 'Eco-Friendly Community' }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#4a5568',
                  fontSize: '0.9rem'
                }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={{
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '15px',
            border: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <h3 style={{
              textAlign: 'center',
              color: '#2d3748',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '30px'
            }}>
              {isAdmin ? 'Administrator Access' : 'User Login'}
            </h3>

            <form onSubmit={handleLogin}>
              {/* Wallet Address */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  color: '#4a5568',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.9rem'
                }}>
                  Connected Wallet Address
                </label>
                <input
                  type="text"
                  value={accounts[0] || 'Not connected'}
                  readOnly
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: '#f7fafc',
                    color: '#718096'
                  }}
                />
              </div>

              {/* Passenger ID (Only for Users) */}
              {!isAdmin && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#4a5568',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '0.9rem'
                  }}>
                    Passenger ID
                  </label>
                  <input
                    type="number"
                    name="passengerID"
                    placeholder="Enter your Passenger ID"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              )}

              {/* Digital Signature Agreement */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '30px',
                padding: '15px',
                background: '#fff5f5',
                borderRadius: '8px',
                border: '2px solid #fed7d7'
              }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  style={{
                    transform: 'scale(1.2)',
                    marginTop: '2px'
                  }}
                />
                <div>
                  <label style={{
                    color: '#2d3748',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}>
                    Verify My Digital Signature
                  </label>
                  <p style={{
                    color: '#718096',
                    fontSize: '0.8rem',
                    margin: '5px 0 0 0',
                    lineHeight: '1.4'
                  }}>
                    I authorize this platform to use my digital signature for secure authentication.
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
                    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                    : '#cbd5e0',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isChecked && !loading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  marginBottom: '20px'
                }}
                onMouseEnter={(e) => {
                  if (isChecked && !loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isChecked && !loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Authenticating...
                  </div>
                ) : (
                  `Login as ${isAdmin ? 'Administrator' : 'User'}`
                )}
              </button>

              {/* Registration Link */}
              {!isAdmin && (
                <div style={{ textAlign: 'center' }}>
                  <Link 
                    to={'/new-application-for-passenger'} 
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#764ba2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#667eea';
                    }}
                  >
                    Don't have an account? Register here
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Switch Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
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
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #667eea;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
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