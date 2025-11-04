import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Modal } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactStars from "react-rating-stars-component";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import LeafletGeocoder from "../testing-javascripts/LeafletGeocoder.jsx";
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
  const [passengers, setPassengers] = useState([]);
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkButtonDisabled, setIsMarkButtonDisabled] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [showRideEndModal, setShowRideEndModal] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState(0);
  const [showRideStartedModal, setShowRideStartedModal] = useState(false);
  const [showRideJoinedModal, setShowRideJoinedModal] = useState(false);
  const [showRideEndedModal, setShowRideEndedModal] = useState(false);
  const [showRideLeftModal, setShowRideLeftModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [ridePassengers, setRidePassengers] = useState({});
  const position = [20.5, 78.9];

  const currentRide = rides[rideID - 1];
  const currentPassenger = passengers[passengerID - 1];
  const hostDetails = passengers[currentRide?.HostID - 1];

  const handleRideStartedModal = () => setShowRideStartedModal(false);
  const handleRideJoinedModal = () => setShowRideJoinedModal(false);
  const handleRideEndedModal = () => setShowRideEndedModal(false);
  const handleRideLeftModal = () => setShowRideLeftModal(false);

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

          // Load passengers
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

          // Load rides
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
              RideFare: web3.utils.fromWei(rideDetails[6], 'ether'),
              RideSeatsAvailable: rideDetails[7],
              RideUpdates: rideDetails[8],
              RideDateandTime: rideDetails[9],
              isRideStarted: rideDetails[10],
              isRideEnded: rideDetails[11],
              HostStartLocation: rideDetails[12],
              HostEndLocation: rideDetails[13],
              rideStartTime: rideDetails[14],
              rideEndTime: rideDetails[15]
            });
          }
          setRides(ridesList);

          // Load ride passengers data
          const ridePassengersData = {};
          for (let i = 0; i < ridesList.length; i++) {
            const ride = ridesList[i];
            ridePassengersData[ride.RideID] = {};
            for (let j = 0; j < ride.PeersID.length; j++) {
              const peerId = ride.PeersID[j];
              const details = await contract.methods.GetRidePassengersDetails(ride.RideID, peerId).call();
              ridePassengersData[ride.RideID][peerId] = {
                PassSourceLocation: details[0],
                PassDestinationLocation: details[1],
                isOnRide: details[2],
                hasPaid: details[3]
              };
            }
          }
          setRidePassengers(ridePassengersData);

          setIsLoading(false);

        } catch (error) {
          console.error('Error initializing Web3:', error);
          alert('An error occurred while initializing Web3. Please make sure you have MetaMask installed and try again.');
          setIsLoading(false);
        }
      } else {
        console.log('Please install MetaMask!');
        setIsLoading(false);
      }
    };

    initialize();
  }, [rideID]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleLeaving = async () => {
    if (!currentRide) return;
    
    try {
      const ridePassengersData = await contract.methods.GetRidePassengersDetails(rideID, passengerID).call();
      
      if (passengerID == currentRide.HostID && currentRide.isRideEnded == false && currentRide.isRideStarted == true) {
        await contract.methods.endRide(rideID).send({ from: accounts[0] });
        setIsMarkButtonDisabled(true);
        setShowRideEndModal(false);
        setShowRideEndedModal(true);
      }
      else if (ridePassengersData[0] != "" && ridePassengersData[1] != "" && ridePassengersData[2] === true) {
        await contract.methods.MarkPassengerLeaving(
          passengerID, 
          rideID, 
          ridePassengersData[1]
        ).send({ from: accounts[0] });
        
        setShowRideEndModal(false);
        setShowRideLeftModal(true);

        // Update ridePassengers state after leaving
        setRidePassengers(prev => ({
          ...prev,
          [rideID]: {
            ...prev[rideID],
            [passengerID]: {
              ...prev[rideID][passengerID],
              isOnRide: false,
              hasPaid: true
            }
          }
        }));
      }
    } catch (error) {
      console.error("Error in handleLeaving:", error);
      alert("Error processing leaving: " + error.message);
    }
  };

  const handleCloseRideEndModal = () => {
    setShowRideEndModal(false);
  };

  const handleMarkMyJoiningandLeaving = async (event) => {
    event.preventDefault();
  
    if (!currentRide) return;

    if (!currentRide.isRideStarted && !(currentRide.HostID === passengerID)) {
      alert("Please wait for the host to start this ride.");
    } else if (currentRide.isRideEnded) {
      alert("The Host has ended this ride for everyone.");
    } else {
      try {
        const ridePassengersData = await contract.methods.GetRidePassengersDetails(rideID, passengerID).call();
        
        if(passengerID == currentRide.HostID && currentRide.isRideStarted == false){
          await contract.methods.startRide(rideID).send({ from: accounts[0] });
          setShowRideStartedModal(true);
        }
        else if (passengerID == currentRide.HostID && currentRide.isRideEnded == false && currentRide.isRideStarted == true){
          setShowRideEndModal(true);
        }
        else if (currentRide.PeersID.includes(passengerID) && ridePassengersData[0] != "" && ridePassengersData[1] != "" && ridePassengersData[2] === false) {
          await contract.methods.MarkPassengerJoining(passengerID, rideID, ridePassengersData[0]).send({ from: accounts[0] });
          setShowRideJoinedModal(true);
          
          // Update ridePassengers state after joining
          setRidePassengers(prev => ({
            ...prev,
            [rideID]: {
              ...prev[rideID],
              [passengerID]: {
                ...prev[rideID][passengerID],
                isOnRide: true
              }
            }
          }));
        } else if (currentRide.PeersID.includes(passengerID) && ridePassengersData[0] != "" && ridePassengersData[1] != "" && ridePassengersData[2] === true) {
          setShowRideEndModal(true);
        } 
        else {
          console.log("Passenger not found in ride passengers list");
        }
      } catch (error) {
        console.error('Error:', error);
        alert("Error: " + error.message);
      }
    }
  };

  const handleButtonClick = async (peerid) => {
    if (feedback.hasOwnProperty(peerid)) {
      console.log("Feedback already recorded for peer ID:", peerid);
      return;
    }
  
    try {
      await contract.methods.updatePassengerReview(peerid, rating).send({ from: accounts[0] });
      
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [peerid]: rating,
      }));
      
    } catch (error) {
      console.error(error);
      alert("Error submitting review: " + error.message);
    }
  };

  // Show loading state until data is available
  if (isLoading || !currentRide || !currentPassenger) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
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
                    {currentPassenger?.PassName?.split(" ")[0]}'s Active Ride
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
                    <strong>From:</strong> {currentRide?.RideSourceLocation}
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
                    <strong>To:</strong> {currentRide?.RideDestinationLocation}
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
                  {hostDetails?.PassName || 'Loading...'}
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
                Travel Companions ({currentRide?.PeersID?.length || 0})
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
                paddingRight: '10px'
              }}>
                {currentRide?.PeersID?.map((peerid) => {
                  const passengerDetails = passengers[peerid-1];
                  const ridePassengerDetails = ridePassengers[rideID]?.[peerid];
                  
                  return (
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
                        {passengerDetails?.PassName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div style={{
                          color: '#2d3748',
                          fontWeight: '600',
                          fontSize: '0.95rem'
                        }}>
                          {passengerDetails?.PassName || 'Unknown Passenger'}
                        </div>
                        <div style={{
                          color: '#718096',
                          fontSize: '0.8rem'
                        }}>
                          {ridePassengerDetails?.hasPaid ? 'Paid • Co-traveler' : 'Co-traveler'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Ride Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
          }}>
            {/* Map Section */}
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
                🗺️ Track Your Carpool
              </h3>
              <MapContainer 
                center={position} 
                zoom={13} 
                scrollWheelZoom={true} 
                style={{ width: "100%", height: "300px", borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}@2x.jpg?key=OnXJPBh7IkMHefqgKgQS"
                />
                {markers.length > 0 && markers.map((marker, index) => (
                  <Marker position={marker.position} key={index}>
                    <Popup>{marker.label}</Popup>
                  </Marker>
                ))}
                <LeafletGeocoder />
              </MapContainer>
            </div>

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
                {currentRide?.RideUpdates?.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {currentRide?.RideUpdates?.map((update, index) => (
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
                    Start Date:
                  </span>
                  <span style={{ color: '#2d3748', fontWeight: '500' }}>
                    {currentRide?.RideDateandTime?.[0] || 'Not specified'}
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
                    <FaClock style={{ color: '#667eea' }} />
                    Start Time:
                  </span>
                  <span style={{ color: '#2d3748', fontWeight: '500' }}>
                    {currentRide?.RideDateandTime?.[1] || 'Not specified'}
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
                    {currentRide?.RideFare} ETH
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
                🛑 Route Stops
              </h3>
              <div style={{
                background: '#f7fafc',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {currentRide?.Stops?.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {currentRide?.Stops?.map((stop, index) => (
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
              onClick={handleMarkMyJoiningandLeaving}
              disabled={isMarkButtonDisabled}
              style={{
                background: isMarkButtonDisabled ? 
                  'linear-gradient(45deg, #cccccc, #999999)' : 
                  'linear-gradient(45deg, #48bb78, #38a169)',
                color: 'white',
                border: 'none',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isMarkButtonDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isMarkButtonDisabled ? 
                  '0 4px 15px rgba(204, 204, 204, 0.3)' : 
                  '0 8px 25px rgba(72, 187, 120, 0.4)',
                opacity: isMarkButtonDisabled ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isMarkButtonDisabled) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(72, 187, 120, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMarkButtonDisabled) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.4)';
                }
              }}
            >
              {(currentRide?.HostID === passengerID && currentRide?.isRideStarted === false) ? "🚀 Start Ride" : 
               ((currentRide?.HostID === passengerID && currentRide?.isRideStarted === true) ? "🛑 End Ride" : 
               "✅ Mark my Joining/Leaving")}
            </button>
          </div>
        </div>
      </div>

      {/* All Modal Components (Keep original functionality) */}
      <Modal show={showRideEndModal} onHide={handleCloseRideEndModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700",color:"white", margin: 0}}>Alert! This ride will be marked as ended.</h4>
        </Modal.Header>
        <Modal.Body style={{textAlign:"center", padding: '30px'}}>
          <div style={{alignSelf:"center", textAlign:"center",display:'flex',flexDirection:'column',height:"50vh",overflow:'auto'}}>
            <h4 style={{alignSelf:"center",color:'#2d3748',fontWeight:"700", marginBottom: '10px'}}>Please spare a minute to rate your Peers.</h4>
            <h5 style={{alignSelf:"center",color:'#718096', marginBottom: '20px'}}>For each peer individually, please select the number of stars you wish to offer and then click on "<b>Provide Feedback</b>".</h5>
            <div style={{
              background: '#f7fafc',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <table style={{alignSelf:'center', width:"100%", borderCollapse: 'collapse'}}>
                <thead>
                  <tr>
                    <th style={{padding:"12px",border:'1px solid #e2e8f0', background: '#edf2f7'}}><h5 style={{color:"#2d3748",fontWeight:"700", margin: 0}}>Sr.No:</h5></th>
                    <th style={{padding:"12px",border:'1px solid #e2e8f0', background: '#edf2f7'}}><h5 style={{color:"#2d3748",fontWeight:"700", margin: 0}}>Peer Name</h5></th>
                    <th style={{padding:"12px",border:'1px solid #e2e8f0', background: '#edf2f7'}}><h5 style={{color:"#2d3748",fontWeight:"700", margin: 0}}>Feedback</h5></th>
                    <th style={{padding:"12px",border:'1px solid #e2e8f0', background: '#edf2f7'}}><h5 style={{color:"#2d3748",fontWeight:"700", margin: 0}}>Actions</h5></th>
                  </tr>
                </thead>
                <tbody style={{alignSelf:'center'}}>
                  <tr style={{border:'1px solid #e2e8f0'}}>
                    <td style={{padding:"12px",border:'1px solid #e2e8f0', textAlign: 'center'}}>{1}</td>
                    <td style={{padding:"12px",border:'1px solid #e2e8f0'}}>{hostDetails?.PassName}</td>
                    <td style={{padding:"12px",border:'1px solid #e2e8f0',textAlign:'center'}}>
                      {currentRide?.HostID == passengerID &&(<h6 style={{color:"#718096",textAlign:'center',fontWeight:'700'}}>Not Applicable</h6>)}
                      {!(currentRide?.HostID == passengerID) &&(<ReactStars
                        count={5}
                        onChange={handleRatingChange}
                        size={24}
                        isHalf={true}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        filledIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                      />)}
                    </td>
                    <td style={{padding:"12px",border:'1px solid #e2e8f0',textAlign:'center'}}>
                      {currentRide?.HostID == passengerID &&(<h6 style={{color:"#718096",textAlign:'center',fontWeight:'700'}}>Not Applicable</h6>)}
                      {!(currentRide?.HostID == passengerID) &&(<button
                        onClick={() => handleButtonClick(currentRide?.HostID)}
                        disabled={feedback.hasOwnProperty(currentRide?.HostID)}
                        style={{
                          background: feedback.hasOwnProperty(currentRide?.HostID) ? 
                            'linear-gradient(45deg, #48bb78, #38a169)' : 
                            'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: feedback.hasOwnProperty(currentRide?.HostID) ? 'default' : 'pointer'
                        }}
                      >
                        {feedback.hasOwnProperty(currentRide?.HostID) ? "Feedback Recorded" : "Record Feedback"}
                      </button>)}
                    </td>
                  </tr>
                  {currentRide?.PeersID?.map((peerid, index) => (
                    <tr key={peerid} style={{border:'1px solid #e2e8f0'}}>
                      <td style={{padding:"12px",border:'1px solid #e2e8f0', textAlign: 'center'}}>{index + 2}</td>
                      <td style={{padding:"12px",border:'1px solid #e2e8f0'}}>{passengers[peerid-1]?.PassName}</td>
                      <td style={{padding:"12px",border:'1px solid #e2e8f0',textAlign:'center'}}>
                        {passengerID == peerid &&(<h6 style={{color:"#718096",textAlign:'center',fontWeight:'700'}}>Not Applicable</h6>)}
                        {!(passengerID == peerid) && (
                          <ReactStars
                            count={5}
                            onChange={handleRatingChange}
                            size={24}
                            isHalf={true}
                            emptyIcon={<i className="far fa-star"></i>}
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            filledIcon={<i className="fa fa-star"></i>}
                            activeColor="#ffd700"
                          />
                        )}
                      </td>
                      <td style={{padding:"12px",border:'1px solid #e2e8f0',textAlign:'center'}}>
                        {passengerID == peerid &&(<h6 style={{color:"#718096",textAlign:'center',fontWeight:'700'}}>Not Applicable</h6>)}
                        {!(passengerID == peerid) && (<button
                          onClick={() => handleButtonClick(peerid)}
                          disabled={feedback.hasOwnProperty(peerid)}
                          style={{
                            background: feedback.hasOwnProperty(peerid) ? 
                              'linear-gradient(45deg, #48bb78, #38a169)' : 
                              'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: feedback.hasOwnProperty(peerid) ? 'default' : 'pointer'
                          }}
                        >
                          {feedback.hasOwnProperty(peerid) ? "Feedback Recorded" : "Record Feedback"}
                        </button>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{alignSelf:'center', border: 'none'}}>
          <button
            onClick={() => {
              setShowRideEndModal(false);
              handleLeaving();
            }}
            style={{
              background: 'linear-gradient(45deg, #48bb78, #38a169)',
              padding:'12px 24px',
              textAlign: "center",
              color:'white',
              border: 'none',
              borderRadius:'8px',
              fontWeight:'700',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Proceed to End Ride
          </button>
        </Modal.Footer>
      </Modal>

      {/* Other modals with proper null checks */}
      <Modal show={showRideStartedModal} onHide={handleRideStartedModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700",color:'white', margin: 0}}>Alert</h4>
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
              🚀
            </div>
            <h4 style={{alignSelf:"center",color:'#2d3748',fontWeight:"700",fontSize:"1.5rem", marginBottom: '10px'}}>You have started this ride!</h4>
            <p style={{alignSelf:"center",color:'#718096',fontSize:"1rem"}}>All the updates regarding this ride will be made available in this section.</p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{border: 'none', justifyContent: 'center'}}>
          <button onClick={handleRideStartedModal} style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Similar styling for other modals */}
      <Modal show={showRideJoinedModal} onHide={handleRideJoinedModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700",color:'white', margin: 0}}>Alert</h4>
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
              ✅
            </div>
            <h4 style={{alignSelf:"center",color:'#2d3748',fontWeight:"700",fontSize:"1.5rem", marginBottom: '10px'}}>You have joined this ride!</h4>
            <p style={{alignSelf:"center",color:'#718096',fontSize:"1rem"}}>All the updates regarding this ride will be made available in this section.</p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{border: 'none', justifyContent: 'center'}}>
          <button onClick={handleRideJoinedModal} style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRideEndedModal} onHide={handleRideEndedModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700",color:'white', margin: 0}}>Alert</h4>
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
              🛑
            </div>
            <h4 style={{alignSelf:"center",color:'#2d3748',fontWeight:"700",fontSize:"1.5rem", marginBottom: '10px'}}>You have ended this ride!</h4>
            <p style={{alignSelf:"center",color:'#718096',fontSize:"1rem"}}>Any further updates regarding this ride will be discontinued.</p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{border: 'none', justifyContent: 'center'}}>
          <button onClick={handleRideEndedModal} style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRideLeftModal} onHide={handleRideLeftModal} size="lg" centered>
        <Modal.Header style={{
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          border: 'none'
        }}>
          <h4 style={{fontWeight:"700",color:'white', margin: 0}}>Alert</h4>
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
              👋
            </div>
            <h4 style={{alignSelf:"center",color:'#2d3748',fontWeight:"700",fontSize:"1.5rem", marginBottom: '10px'}}>You have left this ride!</h4>
            <p style={{alignSelf:"center",color:'#718096',fontSize:"1rem"}}>Hope you had a good journey.</p>
          </div>
        </Modal.Body>
        <Modal.Footer style={{border: 'none', justifyContent: 'center'}}>
          <button onClick={handleRideLeftModal} style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CurrentRide;