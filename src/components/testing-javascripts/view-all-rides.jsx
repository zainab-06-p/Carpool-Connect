import { useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';
import Web3 from 'web3';
import Dropdown from 'react-bootstrap/Dropdown';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaUser, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaSearch, FaDollarSign, FaUsers, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E'; 

function ViewAllRides() {
  const history = useHistory();
  const allarray = useSelector((state) => state.allarray);
  
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRideStopsLoading, setIsRideStopsLoading] = useState(true);
  const [sourceValue, setSourceValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [filteredSourceLocations, setFilteredSourceLocations] = useState([]);
  const [filteredDestinationLocations, setFilteredDestinationLocations] = useState([]);
  const [soucedropdownOpen, setSourceDropdownOpen] = useState(false);
  const [destinationdropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [selectedRides, setSelectedRides] = useState([]);
  const [isSelectedRidesLoading, setIsSelectedRidesLoading] = useState(true);
  const [isSearchStarted, setisSearchStarted] = useState(false);
  const [allStopsAvailable, setAllStopsAvailable] = useState([]);
  const [showRideBookedModal, setShowRideBookedModal] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownMenuStyle = {
    position: 'absolute',
    top: "100%",
    left: '0',
    backgroundColor: 'white',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    padding: '12px',
    zIndex: 1000,
    fontSize: '1rem',
    width: "100%",
    maxHeight: "200px",
    overflowY: 'auto',
    border: '2px solid #e2e8f0'
  };

  const DestinationdropdownMenuStyle = {
    position: 'absolute',
    top: "100%",
    left: '0',
    backgroundColor: 'white',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    padding: '12px',
    zIndex: 1000,
    fontSize: '1rem',
    width: "100%",
    maxHeight: "200px",
    overflowY: 'auto',
    border: '2px solid #e2e8f0'
  };
  
  const handleRideBookedModal = () => {
    setShowRideBookedModal(false);
  };

  const { passengerID } = useParams();

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
              RideFare: web3.utils.fromWei(rideDetails[6], 'ether'),
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
          const obj = await contract.methods.getAllStopsAvailable().call();
          const allstopsList = Object.values(obj);
          setAllStopsAvailable(allstopsList);
          setIsRideStopsLoading(false);
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

  const handleSourceInputChange = (event) => {
    const value = event.target.value;
    setSourceValue(value);
    const filtered = allStopsAvailable.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSourceLocations(filtered);
    setSourceDropdownOpen(true);
  };

  const handleDestinationInputChange = (event) => {
    const value = event.target.value;
    setDestinationValue(value);
    const filtered = allStopsAvailable.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDestinationLocations(filtered);
    setDestinationDropdownOpen(true);
  };

  const handleSourceLocationSelect = (location) => {
    setSourceValue(location);
    setSourceDropdownOpen(false);
  };

  const handleDestinationLocationSelect = (location) => {
    setDestinationValue(location);
    setDestinationDropdownOpen(false);
  };

  const handleBookRide = async (id) => {
    const ride = rides.find(r => r.RideID === id);
    if (!ride) {
      console.error("Ride not found");
      return;
    }

    const fareInEth = ride.RideFare;
    const fareInWei = web3.utils.toWei(fareInEth, 'ether');

    try {
      const gasAmount = await contract.methods
        .BookARide(passengerID, id, sourceValue, destinationValue)
        .estimateGas({ from: accounts[0], value: fareInWei });

      await contract.methods
        .BookARide(passengerID, id, sourceValue, destinationValue)
        .send({
          from: accounts[0],
          value: fareInWei,
          gas: gasAmount
        });

      console.log(`Ride Booked Successfully! ${fareInEth} Sepolia ETH held until leaving`);
      setShowRideBookedModal(true);

      setSelectedRides(prev =>
        prev.map(r =>
          r.RideID === id
            ? { ...r, PeersID: [...r.PeersID, passengerID], RideSeatsAvailable: r.RideSeatsAvailable - 1 }
            : r
        )
      );
    } catch (error) {
      console.error("Error booking ride:", error);
      alert("Error booking ride: " + error.message);
    }
  };

  const handleLogin = (rideid) => {
    history.push(`/viewselectedupcomingride/${passengerID}/${rideid}`);
  };

  const handleSearchRides = (event) => {
    event.preventDefault();
    setisSearchStarted(true);
    const filteredRides = rides.filter((ride) => {
      let flag = false;
      if (sourceValue === ride.RideSourceLocation) {
        if (destinationValue === ride.RideDestinationLocation) flag = true;
        else if (ride.Stops.includes(destinationValue)) flag = true;
      } else if (ride.Stops.includes(sourceValue)) {
        if (destinationValue === ride.RideDestinationLocation) flag = true;
        else if (ride.Stops.includes(destinationValue) && (ride.Stops.indexOf(sourceValue) < ride.Stops.indexOf(destinationValue))) flag = true;
      }
      return flag && !ride.isRideStarted && !ride.isRideEnded && ride.RideSeatsAvailable > 0;
    });
    setSelectedRides(filteredRides);
    setIsSelectedRidesLoading(false);
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
                      color: item.text === 'Check Rides' ? '#667eea' : '#4a5568',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: item.text === 'Check Rides' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (item.text !== 'Check Rides') {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.text !== 'Check Rides') {
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

          {/* Search Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px'
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
                <FaSearch />
              </div>
              <div>
                <h2 style={{
                  color: '#2d3748',
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: '0 0 10px 0',
                   display: 'flex'
             
                }}>
                  Find Your Ride
                </h2>
                <div style={{
                  color: '#718096',
                  fontSize: '1.1rem',
                  margin:0
                }}>
                  Search for available rides matching your route
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '20px',
              alignItems: 'end'
            }}>
              {/* Source Input */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  color: '#2d3748',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                  From Location
                </label>
                <input
                  value={sourceValue}
                  onChange={handleSourceInputChange}
                  placeholder='Enter source location...'
                  type='text'
                  name='sourceLocation'
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f7fafc';
                  }}
                />
                {filteredSourceLocations.length > 0 && sourceValue.length > 0 && soucedropdownOpen && (
                  <div style={dropdownMenuStyle}>
                    {filteredSourceLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleSourceLocationSelect(location)}
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          color: '#2d3748',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  color: '#2d3748',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}>
                  <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                  To Location
                </label>
                <input
                  value={destinationValue}
                  onChange={handleDestinationInputChange}
                  placeholder='Enter destination location...'
                  type='text'
                  name='destinationLocation'
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    background: '#f7fafc',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f7fafc';
                  }}
                />
                {filteredDestinationLocations.length > 0 && destinationValue.length > 0 && destinationdropdownOpen && (
                  <div style={DestinationdropdownMenuStyle}>
                    {filteredDestinationLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleDestinationLocationSelect(location)}
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          color: '#2d3748',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearchRides}
                style={{
                  background: 'linear-gradient(45deg, #48bb78, #38a169)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(72, 187, 120, 0.4)',
                  height: 'fit-content'
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
                Search Rides
              </button>
            </div>
          </div>

          {/* Rides Results Section */}
          {!isSelectedRidesLoading && isSearchStarted && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flex: 1
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'white'
                }}>
                  <FaCar />
                </div>
                <div>
                  <h3 style={{
                    color: '#2d3748',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '0 0 5px 0'
                  }}>
                    Available Rides
                  </h3>
                  <div style={{
                    background: 'linear-gradient(45deg, #48bb78, #38a169)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    {selectedRides.length} {selectedRides.length === 1 ? 'Ride' : 'Rides'} Found
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {selectedRides.map((ride) => (
                  <div key={ride.RideID} style={{
                    background: '#f7fafc',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '2px solid #e2e8f0',
                    transition: 'all 0.3s ease'
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
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '20px',
                      alignItems: 'start'
                    }}>
                      {/* Ride Info */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
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
                            background: ride.HostID == passengerID ? '#ed8936' : '#48bb78',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            {ride.HostID == passengerID ? 'Host' : 'Passenger'}
                          </div>
                          <div style={{
                            background: ride.isRideStarted ? '#e53e3e' : '#48bb78',
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

                        <div style={{
                          display: 'flex',
                          gap: '20px',
                          flexWrap: 'wrap'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaDollarSign style={{ color: '#667eea' }} />
                            <strong>Fare:</strong> {ride.RideFare} ETH
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <FaUsers style={{ color: '#667eea' }} />
                            <strong>Seats:</strong> {ride.RideSeatsAvailable}
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
                        {!(ride.HostID == passengerID) && (
                          <button
                            onClick={() => handleBookRide(ride.RideID)}
                            disabled={ride.PeersID.includes(passengerID)}
                            style={{
                              background: ride.PeersID.includes(passengerID) 
                                ? 'linear-gradient(45deg, #cccccc, #999999)' 
                                : 'linear-gradient(45deg, #48bb78, #38a169)',
                              color: 'white',
                              border: 'none',
                              padding: '12px 20px',
                              borderRadius: '10px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: ride.PeersID.includes(passengerID) ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: ride.PeersID.includes(passengerID) 
                                ? 'none' 
                                : '0 4px 15px rgba(72, 187, 120, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              if (!ride.PeersID.includes(passengerID)) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!ride.PeersID.includes(passengerID)) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)';
                              }
                            }}
                          >
                            {ride.PeersID.includes(passengerID) ? 'Already Booked' : 'Book Ride'}
                          </button>
                        )}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isSearchStarted && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '60px 30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                marginBottom: '20px'
              }}>
                <FaSearch />
              </div>
              <h3 style={{
                color: '#2d3748',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                Find Your Perfect Ride
              </h3>
              <p style={{
                color: '#718096',
                fontSize: '1rem',
                maxWidth: '400px'
              }}>
                Select your source and destination locations to discover available rides that match your route.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading States */}
      {(isLoading || isRideStopsLoading || (isSelectedRidesLoading && isSearchStarted)) && (
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

      {/* Ride Booked Modal */}
      <Modal show={showRideBookedModal} onHide={handleRideBookedModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700", color:'white', margin: 0}}>Success!</h4>
        </Modal.Header>
        <Modal.Body style={{textAlign:"center", padding: '30px'}}>
          <div style={{alignSelf:"center", textAlign:"center"}}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(45deg, #48bb78, #38a169)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'white',
              margin: '0 auto 20px'
            }}>
              ✓
            </div>
            <h4 style={{alignSelf:"center", color:'#2d3748', fontWeight:"700", fontSize:"1.5rem", marginBottom: '10px'}}>Ride Booked Successfully!</h4>
            <p style={{alignSelf:"center", color:'#718096', fontSize:"1rem"}}>
              Check the status of this ride in the <b>Current Ride</b> section
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{border: 'none', justifyContent: 'center'}}>
          <button onClick={handleRideBookedModal} style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
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
    </div>
  );
}

export default ViewAllRides;