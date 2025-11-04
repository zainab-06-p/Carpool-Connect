import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';
import Web3 from 'web3';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaUser, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaUsers, FaDollarSign, FaClock, FaCalendarAlt } from 'react-icons/fa';
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

  const handleTesting = () => {
    const rideid = 2;
    console.log(typeof(rides[rideid-1].isRideStarted), rides[rideid-1].isRideStarted);
  };

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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flex: 1
          }}>
            {/* Header Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '30px'
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
                  My Current Rides
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
                  Active & Upcoming
                </div>
              </div>
            </div>

            {/* Rides List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxHeight: '60vh',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {rides.length > 0 ? rides.map((ride) => (
                ((ride.HostID === passengerID || ride.PeersID.includes(passengerID)) && !(ride.isRideEnded)) && (
                  <div key={ride.RideID} style={{
                    background: '#f7fafc',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                  }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      {/* Ride Information */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            Ride ID: {ride.RideID}
                          </div>
                          <div style={{
                            background: ride.HostID === passengerID ? '#ed8936' : '#48bb78',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {ride.HostID === passengerID ? 'Host' : 'Passenger'}
                          </div>
                          <div style={{
                            background: ride.isRideStarted ? '#48bb78' : '#e53e3e',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {ride.isRideStarted ? 'Started' : 'Not Started'}
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: '#4a5568'
                        }}>
                          <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                            <strong>From:</strong> {ride.RideSourceLocation}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: '#4a5568'
                        }}>
                          <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                            <strong>To:</strong> {ride.RideDestinationLocation}
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
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                          }}
                        >
                          View Ride Details
                        </button>

                        <button
                          onClick={() => handleCancelRide(ride.RideID, ride.HostID === passengerID ? "Host" : "Passenger")}
                          disabled={ride.isRideStarted}
                          style={{
                            background: ride.isRideStarted ? 
                              'linear-gradient(45deg, #cccccc, #999999)' : 
                              'linear-gradient(45deg, #e53e3e, #c53030)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: ride.isRideStarted ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: ride.isRideStarted ? 
                              '0 4px 15px rgba(204, 204, 204, 0.3)' : 
                              '0 4px 15px rgba(229, 62, 62, 0.3)',
                            opacity: ride.isRideStarted ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!ride.isRideStarted) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 6px 20px rgba(229, 62, 62, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!ride.isRideStarted) {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 15px rgba(229, 62, 62, 0.3)';
                            }
                          }}
                        >
                          Cancel Ride
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#718096',
                  fontSize: '1.1rem'
                }}>
                  No current rides found. Start a new ride or join an existing one!
                </div>
              )}
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