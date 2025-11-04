import React, { useState, useEffect, useMemo, useContext} from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import Modal from 'react-bootstrap/Modal';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L,{icon} from "leaflet";
import LeafletGeocoder from './LeafletGeocoder.jsx';
import { useMap } from "react-leaflet";
import { useHistory } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';

import { RiCaravanFill } from 'react-icons/ri';
import { Link, useRouteMatch } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import appendAllarray from './actions/allarrayActions.js';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaUser, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaUsers, FaDollarSign, FaClock, FaCalendarAlt } from 'react-icons/fa';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function StartARide() {
    const  {passengerID}  = useParams();
    const dispatch = useDispatch();

    const sourceAddress = useSelector((state) => state.sourceAddress); 
    const destinationAddress = useSelector((state) =>state.destinationAddress);
    const listStops = useSelector((state=>state.stops));
     
    const position = [20.5, 78.9];
      
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [passengerRequests, setPassengerRequests] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [rides, setRides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [stops, setStops] = useState([]);
    const [host, setHost] = useState('');
    const [fare, setFare] = useState('');
    const [seats, setSeats] = useState('');
    const [allStopsAvailable, setAllStopsAvailable] = useState([]);
    const [showRideCreatedModal, setShowRideCreatedModal] = useState(false);

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
                PassRidesTaken: passengerDetails[8]
              });
            }
        
            setPassengers(passengersList);

            const numRides = await contract.methods.GetnumRides().call();
            let ridesList = [];

            for (let i = 1; i <= numRides; i++) {
              const rideDetails = await contract.methods.GetRideDetails((i)).call();
              ridesList.push({
                 RideID:rideDetails[0],
                 RideSourceLocation:rideDetails[1],
                 RideDestinationLocation:rideDetails[2],
                 HostID:rideDetails[3],
                 PeersID:rideDetails[4],
                 Stops:rideDetails[5],
                 RideFare:rideDetails[6],
                 RideSeatsAvailable:rideDetails[7],
                 RideUpdates:rideDetails[8],
                 RideDateandTime:rideDetails[9],
                 rideStartTime: rideDetails[12],
                 rideEndTime: rideDetails[13]  
              });
            }
  
            setRides(ridesList); 
            const allstopsList = await contract.methods.getAllStopsAvailable().call();
            setAllStopsAvailable(allstopsList);
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

    const handleRideCreatedModal = () => {
      setShowRideCreatedModal(false);
    };

    const handleCreateRide = async () => {
      const selectedDate = new Date(date);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();

      const dateString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      const date2 = new Date(dateString);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = date2.toLocaleString('en-US', options);
      const dateAndTime = [formattedDate, time];
      let stopsArray = [];
    
      if (listStops.length > 0) {
        stopsArray = listStops.split(';');
      }
    
      let rideData = [sourceAddress, destinationAddress];
    
      if (stopsArray.length > 0) {
        stopsArray.forEach(stop => {
          rideData.push(stop);
        });
      }
      await contract.methods.CreateARide(dateAndTime, sourceAddress, destinationAddress, stopsArray, passengerID, fare, seats).send({ from: accounts[0] });
      await contract.methods.UpdateAllStopsAvailable(rideData).send({ from: accounts[0] });
      console.log("Data sent successfully.");
      
      setDate('');
      setTime('');
      setSource('');
      setDestination('');
      setStops('');
      setHost('');
      setFare('');
      setSeats('');
    
      console.log('Ride created successfully.');
      setShowRideCreatedModal(true);
    };
    
    const getVehicleURL = async (passreqid) =>{
      const [CID,filename] = passengerRequests[passreqid-1].PassVehicleDetailsHash.split(";");
      const baseWeb3StorageUrl = 'https://ipfs.io/ipfs/';
      const file = `/${filename}`;
      const URL = `${baseWeb3StorageUrl}${CID}${file}`; 
      return URL;
    }

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
                        color: item.text === 'Start Ride' ? '#667eea' : '#4a5568',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        background: item.text === 'Start Ride' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (item.text !== 'Start Ride') {
                          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          e.target.style.color = '#667eea';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (item.text !== 'Start Ride') {
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
              {/* Left Panel - Ride Creation Form */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                      Start Your Ride
                    </h2>
                    <div style={{
                      color: '#718096',
                      fontSize: '1rem'
                    }}>
                      Customize your voyage effortlessly
                    </div>
                  </div>
                </div>

                {/* Form Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  {/* Date Input */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaCalendarAlt style={{ color: '#667eea' }} />
                      Date <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="date" 
                      value={date} 
                      required 
                      onChange={(e) => setDate(e.target.value)}
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Time Input */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaClock style={{ color: '#667eea' }} />
                      Time <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Source Location */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaMapMarkerAlt style={{ color: '#48bb78' }} />
                      Source <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      value={sourceAddress} 
                      onChange={(e) => setSource(e.target.value)}
                      required
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Destination Location */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaMapMarkerAlt style={{ color: '#e53e3e' }} />
                      Destination <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      value={destinationAddress} 
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Host ID */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaUser style={{ color: '#667eea' }} />
                      Host ID <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      value={passengerID} 
                      readOnly 
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#edf2f7',
                        color: '#718096'
                      }}
                    />
                  </div>

                  {/* Ride Fare */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaDollarSign style={{ color: '#667eea' }} />
                      Fare (ETH) <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="number" 
                      value={fare} 
                      onChange={(e) => setFare(e.target.value)}
                      required
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Stops */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    gridColumn: 'span 1'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      Stops (semicolon separated)
                    </label>
                    <input 
                      type="text" 
                      value={listStops} 
                      onChange={(e) => setStops(e.target.value)}
                      placeholder="Stop1;Stop2;Stop3"
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>

                  {/* Seats Available */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    gridColumn: 'span 1'
                  }}>
                    <label style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FaUsers style={{ color: '#667eea' }} />
                      Seats Available <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <input 
                      type="number" 
                      value={seats} 
                      onChange={(e) => setSeats(e.target.value)}
                      required
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        background: '#f7fafc'
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
                  </div>
                </div>

                {/* Create Ride Button */}
                <button
                  onClick={handleCreateRide}
                  style={{
                    background: 'linear-gradient(45deg, #48bb78, #38a169)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(72, 187, 120, 0.4)',
                    width: '100%',
                    marginTop: '10px'
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
                  🚀 Create Ride
                </button>
              </div>

              {/* Right Panel - Map Placeholder */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '20px'
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
                  color: 'white'
                }}>
                  🗺️
                </div>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  Route Map
                </h3>
                <p style={{
                  color: '#718096',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  Map integration area for visualizing your route
                </p>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px dashed #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a0aec0'
                }}>
                  Map Container
                </div>
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

        {/* Ride Created Modal */}
        <Modal show={showRideCreatedModal} onHide={handleRideCreatedModal} size="lg" centered>
          <Modal.Header style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            border: 'none'
          }}>
            <h4 style={{fontWeight:"700", color:'white', margin: 0}}>Success!</h4>
          </Modal.Header>
          <Modal.Body style={{
            textAlign: "center",
            padding: '30px'
          }}>
            <div style={{
              alignSelf: "center",
              textAlign: "center"
            }}>
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
              <h4 style={{
                color:'#2d3748',
                fontWeight:"700",
                fontSize:"1.5rem",
                marginBottom: '10px'
              }}>
                Ride Created Successfully!
              </h4>
              <p style={{
                color:'#718096',
                fontSize:"1rem",
                lineHeight: '1.5'
              }}>
                Check and update the status of this ride in the <b>Current Ride</b> section.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{
            border: 'none',
            justifyContent: 'center'
          }}>
            <button 
              onClick={handleRideCreatedModal}
              style={{
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

let DefaultIcon = L.icon({
  iconUrl: "public/images/blueIcon.png",
  iconSize: [50, 50],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default StartARide;