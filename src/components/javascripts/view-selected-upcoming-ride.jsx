import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';
import Web3 from 'web3';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaUser, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaUsers, FaDollarSign, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function CurrentRide() {
  const { passengerID, rideID } = useParams();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [passengerRequests, setPassengerRequests] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [rides, setRides] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

          const numPassengers = await contract.methods.GetnumPassengers().call();
          let passengersList = [];
      
          for (let i = 0; i < numPassengers; i++) {
            const passengerDetails = await contract.methods.GetPassDetails((i+1)).call();
            passengersList.push({
              PassID: passengerDetails[0],
              PassName: passengerDetails[1],
              PassWalletAddress: passengerDetails[2],
              PassHomeAddress: passengerDetails[3],
              PassEMail: passengerDetails[9],
              PassVehicleName: passengerDetails[10],
              PassVehicleNumber: passengerDetails[11],
              PassVehicleDetailsHash: passengerDetails[4],
              PassGender: passengerDetails[5],
              PassReview: passengerDetails[6],
              PassRidesHosted: passengerDetails[7],
              PassRidesTaken: passengerDetails[8],
            });
          }
      
          setPassengers(passengersList);

          const numRides = await contract.methods.GetnumRides().call();
          let ridesList = [];

          for (let i = 1; i <= numRides; i++) {
            const rideDetails = await contract.methods.GetRideDetails((i)).call();
            ridesList.push({
               RideID: rideDetails[0],
               RideSourceLocation: rideDetails[1],
               RideDestinationLocation: rideDetails[2],
               HostID: rideDetails[3],
               PeersID: rideDetails[4],
               Stops: rideDetails[5],
               RideFare: rideDetails[6],
               RideSeatsAvailable: rideDetails[7],
                RideUpdates: rideDetails[8],
                RideDateandTime: rideDetails[9],
                isRideStarted: rideDetails[10],
                isRideEnded: rideDetails[11],
                rideStartTime: rideDetails[12],
                rideEndTime: rideDetails[13]
            });
          }

          setRides(ridesList);
          setIsLoading(false);
          console.log(passengers);

          const requestDetails = await contract.methods.GetPassRequestDetails(parseInt(passengerID)).call();
          setUserDetails(requestDetails);

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
          {/* Header Navigation */}
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
                      color: item.text === 'Current Ride' ? '#667eea' : '#4a5568',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: item.text === 'Current Ride' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (item.text !== 'Current Ride') {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.text !== 'Current Ride') {
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

          {/* Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            flex: 1
          }}>
            {/* Left Panel - Ride Information */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}>
              {/* Ride Header Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    🚗
                  </div>
                  <div>
                    <h2 style={{
                      color: '#2d3748',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      margin: '0 0 5px 0'
                    }}>
                      {passengers[passengerID-1]?.PassName?.split(" ")[0]}'s Ride
                    </h2>
                    <div style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      Ride ID: {rideID}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#4a5568'
                  }}>
                    <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                    <div>
                      <strong>From:</strong> {rides[rideID-1]?.RideSourceLocation}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#4a5568'
                  }}>
                    <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                    <div>
                      <strong>To:</strong> {rides[rideID-1]?.RideDestinationLocation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Information */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaUser style={{ color: '#667eea' }} />
                  Your Ride Host
                </h3>
                <div style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <div style={{
                    color: '#2d3748',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '5px'
                  }}>
                    {passengers[rides[rideID-1]?.HostID-1]?.PassName}
                  </div>
                  <div style={{
                    color: '#718096',
                    fontSize: '0.9rem'
                  }}>
                    Experienced Carpool Host
                  </div>
                </div>
              </div>

              {/* Peers Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                flex: 1
              }}>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaUsers style={{ color: '#667eea' }} />
                  Travel Companions ({rides[rideID-1]?.PeersID?.length || 0})
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  paddingRight: '10px'
                }}>
                  {rides[rideID-1]?.PeersID?.map((peerid) => (
                    <div key={peerid} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: '#f7fafc',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f7fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(45deg, #ed8936, #dd6b20)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {passengers[peerid-1]?.PassName?.charAt(0)}
                      </div>
                      <div>
                        <div style={{
                          color: '#2d3748',
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>
                          {passengers[peerid-1]?.PassName}
                        </div>
                        <div style={{
                          color: '#718096',
                          fontSize: '0.8rem'
                        }}>
                          Co-traveler
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Ride Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}>
              {/* Ride Updates */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  📢 Ride Updates
                </h3>
                <div style={{
                  background: '#f7fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {rides[rideID-1]?.RideUpdates?.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {rides[rideID-1]?.RideUpdates?.map((update, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px',
                          background: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            background: '#667eea',
                            borderRadius: '50%'
                          }}></div>
                          <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>{update}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      color: '#718096',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      No recent updates available
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Information */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaClock style={{ color: '#667eea' }} />
                  Ride Schedule
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f7fafc',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <span style={{ fontWeight: '600', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaCalendarAlt style={{ color: '#667eea' }} />
                      Date & Time:
                    </span>
                    <span style={{ color: '#2d3748', fontWeight: '500' }}>
                      {rides[rideID-1]?.RideDateandTime}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f7fafc',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <span style={{ fontWeight: '600', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaDollarSign style={{ color: '#667eea' }} />
                      Fare:
                    </span>
                    <span style={{ color: '#2d3748', fontWeight: '500' }}>
                      {rides[rideID-1]?.RideFare} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Stops Information */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  🗺️ Route Stops
                </h3>
                <div style={{
                  background: '#f7fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {rides[rideID-1]?.Stops?.length > 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {rides[rideID-1]?.Stops?.map((stop, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px',
                          background: 'white',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '600'
                          }}>
                            {index + 1}
                          </div>
                          <span style={{ color: '#4a5568', fontWeight: '500' }}>{stop}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      color: '#718096',
                      textAlign: 'center',
                      padding: '20px'
                    }}>
                      No additional stops on this route
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  background: 'linear-gradient(45deg, #48bb78, #38a169)',
                  color: 'white',
                  border: 'none',
                  padding: '18px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(72, 187, 120, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(72, 187, 120, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.4)';
                }}
              >
                ✅ I have Joined
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
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

export default CurrentRide;