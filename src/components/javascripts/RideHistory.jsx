import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { FaUser, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaPlay, FaCheckCircle } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import CommuteIOABI from '../ABI/contracttestingABI.json';
import Modal from 'react-bootstrap/Modal';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function RideHistory() {
  const { passengerID } = useParams();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null); 
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesHosted, setRidesHosted] = useState([]);
  const [ridesTaken, setRidesTaken] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [selectedRideID, setSelectedRideID] = useState('');

  const handleShowRideDetails = () => {
    setShowRideDetails(true);
  }

  const handleHideRideDetails = () => {
    setShowRideDetails(false);
  }

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
          
          const numRides = await contract.methods.GetnumRides().call();
          let hosted = [];
          let taken = [];   
          let ridesList = [];        

          for (let i = 1; i <= numRides; i++) {
            const rideDetails = await contract.methods.GetRideDetails(i).call();
            if(rideDetails[3]==passengerID && rideDetails[11]){hosted.push(rideDetails);}
            else if(rideDetails[4].includes(passengerID) && rideDetails[11]){taken.push(rideDetails);}
            ridesList.push(rideDetails);
          }
          setRidesHosted(hosted);
          setRidesTaken(taken);
          setRides(ridesList);

          const numPassengers = await contract.methods.GetnumPassengers().call();
          let passengersList = [];
      
          for (let i = 0; i < numPassengers; i++) {
            const passengerDetails = await contract.methods.GetPassDetails((i+1)).call();
            passengersList.push(passengerDetails);
          }
      
          setPassengers(passengersList);        
          setIsLoading(false);

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {!isLoading && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '20px 40px',
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h1 style={{
                margin: 0,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '2.2rem',
                fontWeight: '800'
              }}>
                CARPOOL CONNECT
              </h1>
              
              <nav style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {[
                  { to: `/dashboard/${passengerID}`, icon: <FaUser />, text: 'Profile' },
                  { to: `/myinprogressrides/${passengerID}`, icon: <FaCar />, text: 'Current Ride' },
                  { to: `/ridehistory/${passengerID}`, icon: <FaHistory />, text: 'History' },
                  { to: `/enterRideInbox/${passengerID}`, icon: <FaEnvelope />, text: 'Inbox' },
                  { to: `/viewallrides/${passengerID}`, icon: <FaCar />, text: 'Check Rides' },
                  { to: `/startaride/${passengerID}`, icon: <RiCaravanFill />, text: 'Start Ride' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4a5568',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: item.text === 'History' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      color: item.text === 'History' ? '#667eea' : '#4a5568'
                    }}
                    onMouseEnter={(e) => {
                      if (item.text !== 'History') {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.text !== 'History') {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#4a5568';
                      }
                    }}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Page Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '25px 30px',
            marginBottom: '25px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#2d3748',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <FaHistory style={{ color: '#667eea' }} />
              Ride History
            </h2>
            <p style={{
              color: '#718096',
              fontSize: '1.1rem',
              margin: 0
            }}>
              Review your completed carpooling journeys
            </p>
          </div>

          {/* Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            flex: 1
          }}>
            {/* Rides Hosted Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(45deg, #48bb78, #38a169)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  color: 'white'
                }}>
                  🚗
                </div>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Rides Hosted ({ridesHosted.length})
                </h3>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {ridesHosted.length > 0 ? (
                  ridesHosted.map((ride) => (
                    <div 
                      key={ride[0]}
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '15px'
                      }}>
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '700'
                            }}>
                              Ride #{ride[0]}
                            </div>
                            <div style={{
                              background: '#c6f6d5',
                              color: '#22543d',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaCheckCircle style={{ fontSize: '0.6rem' }} />
                              Completed
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                            <span style={{ fontWeight: '600' }}>From:</span>
                            <span>{ride[1]}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                            <span style={{ fontWeight: '600' }}>To:</span>
                            <span>{ride[2]}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            gap: '15px',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#718096',
                              fontSize: '0.8rem'
                            }}>
                              <FaUsers />
                              <span>{ride[4].length} passengers</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#718096',
                              fontSize: '0.8rem'
                            }}>
                              <FaCalendarAlt />
                              <span>{ride[9][0]}</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            handleShowRideDetails();
                            setSelectedRideID(ride[0]);
                          }}
                          style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
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
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#718096'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '15px',
                      opacity: '0.5'
                    }}>
                      🚗
                    </div>
                    <h4 style={{
                      color: '#4a5568',
                      marginBottom: '10px',
                      fontWeight: '600'
                    }}>
                      No Rides Hosted
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      Your completed hosted rides will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rides Taken Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(45deg, #ed8936, #dd6b20)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  color: 'white'
                }}>
                  👤
                </div>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  Rides Taken ({ridesTaken.length})
                </h3>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {ridesTaken.length > 0 ? (
                  ridesTaken.map((ride) => (
                    <div 
                      key={ride[0]}
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '15px'
                      }}>
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '700'
                            }}>
                              Ride #{ride[0]}
                            </div>
                            <div style={{
                              background: '#c6f6d5',
                              color: '#22543d',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaCheckCircle style={{ fontSize: '0.6rem' }} />
                              Completed
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                            <span style={{ fontWeight: '600' }}>From:</span>
                            <span>{ride[1]}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                            <span style={{ fontWeight: '600' }}>To:</span>
                            <span>{ride[2]}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaUser style={{ color: '#667eea' }} />
                            <span style={{ fontWeight: '600' }}>Host:</span>
                            <span>
                              {passengers.find(p => p[0] === ride[3])?.[1] || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            handleShowRideDetails();
                            setSelectedRideID(ride[0]);
                          }}
                          style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
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
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#718096'
                  }}>
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '15px',
                      opacity: '0.5'
                    }}>
                      👤
                    </div>
                    <h4 style={{
                      color: '#4a5568',
                      marginBottom: '10px',
                      fontWeight: '600'
                    }}>
                      No Rides Taken
                    </h4>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>
                      Your completed passenger rides will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ride Details Modal */}
      <Modal show={showRideDetails} onHide={handleHideRideDetails} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          color: 'white',
          borderBottom: 'none',
          borderRadius: '15px 15px 0 0'
        }}>
          <Modal.Title style={{
            fontWeight: '700',
            fontSize: '1.3rem'
          }}>
            🚗 Ride Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px', maxHeight: '60vh', overflowY: 'auto' }}>
          {selectedRideID > 0 && selectedRideID <= rides.length && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Ride ID Header */}
              <div style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <h4 style={{
                  color: '#2d3748',
                  fontWeight: '700',
                  margin: 0,
                  fontSize: '1.2rem'
                }}>
                  Ride #{selectedRideID}
                </h4>
              </div>

              {/* Route Information */}
              <div>
                <h5 style={{
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaMapMarkerAlt style={{ color: '#667eea' }} />
                  Route Details
                </h5>
                <div style={{
                  display: 'grid',
                  gap: '10px',
                  background: '#f7fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Source:</span>
                    <span style={{ color: '#2d3748' }}>{rides[selectedRideID - 1][1]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Destination:</span>
                    <span style={{ color: '#2d3748' }}>{rides[selectedRideID - 1][2]}</span>
                  </div>
                  {rides[selectedRideID - 1][5].length > 0 && (
                    <div>
                      <span style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '8px' }}>Stops:</span>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#2d3748' }}>
                        {rides[selectedRideID - 1][5].map((stop, index) => (
                          <li key={index}>{stop}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Information */}
              <div>
                <h5 style={{
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCalendarAlt style={{ color: '#667eea' }} />
                  Schedule
                </h5>
                <div style={{
                  display: 'grid',
                  gap: '10px',
                  background: '#f7fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Date:</span>
                    <span style={{ color: '#2d3748' }}>{rides[selectedRideID - 1][9][0]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Time:</span>
                    <span style={{ color: '#2d3748' }}>{rides[selectedRideID - 1][9][1]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Status:</span>
                    <span style={{
                      color: '#22543d',
                      background: '#c6f6d5',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div>
                <h5 style={{
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaUsers style={{ color: '#667eea' }} />
                  Participants
                </h5>
                <div style={{
                  background: '#f7fafc',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontWeight: '600', color: '#4a5568' }}>Host: </span>
                    <span style={{ color: '#2d3748' }}>
                      {rides[selectedRideID - 1][3] === passengerID 
                        ? 'You' 
                        : passengers.find(p => p[0] === rides[selectedRideID - 1][3])?.[1] || 'Unknown'
                      }
                    </span>
                  </div>
                  {rides[selectedRideID - 1][4].length > 0 && (
                    <div>
                      <span style={{ fontWeight: '600', color: '#4a5568', display: 'block', marginBottom: '8px' }}>Passengers:</span>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#2d3748' }}>
                        {rides[selectedRideID - 1][4].map((peer, index) => (
                          <li key={index}>
                            {peer === passengerID 
                              ? 'You' 
                              : passengers.find(p => p[0] === peer)?.[1] || 'Unknown'
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none' }}>
          <button 
            onClick={handleHideRideDetails}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
    </div>
  );
}

export default RideHistory;