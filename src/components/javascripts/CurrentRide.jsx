import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';
import Web3 from 'web3';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaUser, FaCar, FaHistory, FaEnvelope, FaPlay, FaTimes, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function CurrentRide() {
  const { passengerID } = useParams();
  const history = useHistory();

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [passengerRequests, setPassengerRequests] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [rides, setRides] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let isHandlingEvent = false;

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
            const rideDetails = await contract.methods.GetRideDetails(i).call();
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

  const handleLogin = (rideid) => {
    history.push(`/viewselectedupcomingride/${passengerID}/${rideid}`);
  };

  const handleCancelRide = async (rideId, role) => {
    try {
      if (role === "Host") {
        await contract.methods.CancelRideAsHost(rideId).send({ from: accounts[0] });
        alert("Ride cancelled successfully!");
      } else {
        await contract.methods.CancelRideAsPassenger(rideId, passengerID).send({ from: accounts[0] });
        alert("Ride booking cancelled successfully! Your fare has been refunded.");
      }
      
      // Refresh rides list
      const numRides = await contract.methods.GetnumRides().call();
      let ridesList = [];

      for (let i = 1; i <= numRides; i++) {
        const rideDetails = await contract.methods.GetRideDetails(i).call();
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

    } catch (error) {
      console.error('Error cancelling ride:', error);
      alert("Error cancelling ride: " + error.message);
    }
  };

  const currentRides = rides.filter(ride => 
    (ride.HostID === passengerID || ride.PeersID.includes(passengerID)) && !ride.isRideEnded
  );

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
                  { to: `/myinprogressrides/${passengerID}`, icon: <FaCar />, text: 'Current Rides' },
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
                      background: item.text === 'Current Rides' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      color: item.text === 'Current Rides' ? '#667eea' : '#4a5568'
                    }}
                    onMouseEnter={(e) => {
                      if (item.text !== 'Current Rides') {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.text !== 'Current Rides') {
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
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
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
                <FaCar style={{ color: '#667eea' }} />
                Active Rides
              </h2>
              <p style={{
                color: '#718096',
                fontSize: '1.1rem',
                margin: 0
              }}>
                Manage your ongoing carpooling journeys
              </p>
            </div>

            {/* Rides List */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {currentRides.length > 0 ? (
                currentRides.map((ride) => (
                  <div
                    key={ride.RideID}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '15px',
                      padding: '25px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '20px',
                      alignItems: 'start'
                    }}>
                      {/* Ride Information */}
                      <div style={{
                        display: 'grid',
                        gap: '15px'
                      }}>
                        {/* Header Row */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '700'
                            }}>
                              Ride #{ride.RideID}
                            </div>
                            <div style={{
                              background: ride.HostID === passengerID ? '#e6fffa' : '#ebf8ff',
                              color: ride.HostID === passengerID ? '#234e52' : '#2c5282',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaUser style={{ fontSize: '0.7rem' }} />
                              {ride.HostID === passengerID ? 'Host' : 'Passenger'}
                            </div>
                            <div style={{
                              background: ride.isRideStarted ? '#c6f6d5' : '#fffaf0',
                              color: ride.isRideStarted ? '#22543d' : '#744210',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <FaPlay style={{ fontSize: '0.7rem' }} />
                              {ride.isRideStarted ? 'In Progress' : 'Scheduled'}
                            </div>
                          </div>
                        </div>

                        {/* Route Information */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr auto',
                          gap: '15px',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontWeight: '600'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                            <span>From:</span>
                          </div>
                          <div style={{
                            color: '#2d3748',
                            fontWeight: '500',
                            padding: '8px 12px',
                            background: '#f7fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {ride.RideSourceLocation}
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontWeight: '600'
                          }}>
                            <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                            <span>To:</span>
                          </div>
                          <div style={{
                            color: '#2d3748',
                            fontWeight: '500',
                            padding: '8px 12px',
                            background: '#f7fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {ride.RideDestinationLocation}
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div style={{
                          display: 'flex',
                          gap: '20px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaUsers style={{ color: '#667eea' }} />
                            <span>Seats: {ride.RideSeatsAvailable}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaCalendarAlt style={{ color: '#667eea' }} />
                            <span>Fare: {ride.RideFare} ETH</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        minWidth: '200px'
                      }}>
                        <button
                          onClick={() => handleLogin(ride.RideID)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <FaEye />
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleCancelRide(ride.RideID, ride.HostID === passengerID ? "Host" : "Passenger")}
                          disabled={ride.isRideStarted}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: ride.isRideStarted ? '#cbd5e0' : 'linear-gradient(45deg, #f56565, #e53e3e)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: ride.isRideStarted ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: ride.isRideStarted ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!ride.isRideStarted) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 20px rgba(245, 101, 101, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!ride.isRideStarted) {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }
                          }}
                        >
                          <FaTimes />
                          Cancel Ride
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* No Rides State */
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  padding: '60px 30px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    color: '#cbd5e0',
                    marginBottom: '20px'
                  }}>
                    🚗
                  </div>
                  <h3 style={{
                    color: '#4a5568',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}>
                    No Active Rides
                  </h3>
                  <p style={{
                    color: '#718096',
                    fontSize: '1rem',
                    margin: '0 0 25px 0'
                  }}>
                    You don't have any ongoing rides at the moment.
                  </p>
                  <Link
                    to={`/viewallrides/${passengerID}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <FaCar />
                    Find Available Rides
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CurrentRide;