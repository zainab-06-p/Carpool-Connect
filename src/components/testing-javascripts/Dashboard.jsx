import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../stylesheets/UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import CommuteIOABI from "../ABI/contracttestingABI.json";
import { FaStar, FaUser, FaListAlt, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaWallet, FaCarSide, FaIdCard, FaGift, FaLink } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function DashboardPage() {
  const { passengerID } = useParams();
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationDate, setRegistrationDate] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [previousRides, setPreviousRides] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [prevDates, setPrevDates] = useState([]);
  const [activeDay, setActiveDay] = useState(null);

  const handleDayHover = (dayIndex) => {
    setActiveDay(dayIndex);
  };

  const handleDayLeave = () => {
    setActiveDay(null);
  };

  function formatDate(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
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

          const numPassengers = await contract.methods.GetnumPassengers().call();
          let passengersList = [];
          for (let i = 0; i < numPassengers; i++) {
            const passengerDetails = await contract.methods.GetPassDetails((i + 1)).call();
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

          const requestDetails = await contract.methods.GetPassRequestDetails(parseInt(passengerID)).call();
          setUserDetails(requestDetails);

          const dt = await contract.methods.GetPassDateJoined(passengerID).call();
          const parsedDate = new Date(dt);
          const formattedDate = formatDate(parsedDate);
          setRegistrationDate(formattedDate);

          const cid = await contract.methods.getProfilePicture(passengerID).call();
          if (cid && cid !== "") {
            setImageSrc(`https://ipfs.io/ipfs/${cid}`);
          }

          const today = new Date();
          let dates = [formatDate(today)];
          for (let i = 1; i <= 6; i++) {
            const previousDate = new Date(today);
            previousDate.setDate(today.getDate() - i);
            dates.push(formatDate(previousDate));
          }
          setPrevDates(dates);

          let prevRides = [];
          const numRides = await contract.methods.GetnumRides().call();
          for (let i = 1; i <= numRides; i++) {
            const ride = await contract.methods.GetRideDetails(i).call();
            if ((ride[3] == passengerID || ride[4].includes(passengerID)) && dates.includes(ride[9][0])) {
              const details = [ride[9][0], ride[1], ride[2]];
              prevRides.push(details);
            }
          }
          setPreviousRides(prevRides);

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
                gap: '20px',
                alignItems: 'center'
              }}>
                {[
                  { to: `/dashboard/${passengerID}`, icon: <FaUser />, text: 'Profile' },
                  { to: `/myinprogressrides/${passengerID}`, icon: <FaCar />, text: 'Current Ride' },
                  { to: `/ridehistory/${passengerID}`, icon: <FaHistory />, text: 'History' },
                  { to: `/enterRideInbox/${passengerID}`, icon: <FaEnvelope />, text: 'Inbox' },
                  { to: `/viewallrides/${passengerID}`, icon: <FaCarSide />, text: 'Check Rides' },
                  { to: `/startaride/${passengerID}`, icon: <RiCaravanFill />, text: 'Start Ride' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#4a5568',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.color = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#4a5568';
                    }}
                  >
                    {item.icon}
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Welcome Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '10px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Welcome aboard, {passengers[passengerID - 1]?.PassName?.split(" ")[0]}!
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.2rem',
              margin: 0
            }}>
              Your journey to smarter commuting starts here
            </p>
          </div>

          {/* Main Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '40px',
            flex: 1
          }}>
            {/* Left Column - Profile Information */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px'
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
                  fontWeight: '600'
                }}>
                  {passengers[passengerID - 1]?.PassName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 style={{
                    color: '#2d3748',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    margin: '0 0 5px 0'
                  }}>
                    {passengers[passengerID - 1]?.PassName || " "}
                  </h3>
                  <p style={{
                    color: '#718096',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    Member since {registrationDate || " "}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {[
                  { icon: <FaStar />, label: 'Community Rating', value: `${passengers[passengerID - 1]?.PassReview || "0"}/5` },
                  { icon: <FaCar />, label: 'Rides Hosted', value: passengers[passengerID - 1]?.PassRidesHosted || "0" },
                  { icon: <FaUser />, label: 'Rides Taken', value: passengers[passengerID - 1]?.PassRidesTaken || "0" },
                  { icon: <FaMapMarkerAlt />, label: 'Location', value: passengers[passengerID - 1]?.PassHomeAddress || " " },
                  { icon: <FaWallet />, label: 'Wallet Address', value: passengers[passengerID - 1]?.PassWalletAddress?.slice(0, 10) + '...' + passengers[passengerID - 1]?.PassWalletAddress?.slice(-8) || " " },
                  { icon: <FaCarSide />, label: 'Registered Vehicle', value: passengers[passengerID - 1]?.PassVehicleName === " " ? "N/A" : `${passengers[passengerID - 1]?.PassVehicleName}, ${passengers[passengerID - 1]?.PassVehicleNumber}` }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    background: '#f7fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        color: '#667eea',
                        fontSize: '1.1rem'
                      }}>
                        {item.icon}
                      </div>
                      <span style={{
                        color: '#4a5568',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats and Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}>
              {/* Account Info Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{
                  color: '#2d3748',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaIdCard /> Account Information
                </h4>
                
                <div style={{
                  display: 'grid',
                  gap: '15px'
                }}>
                  {[
                    { icon: <FaIdCard />, label: 'Passenger ID', value: passengerID },
                    { icon: <FaGift />, label: 'Reward Points', value: '0' },
                    { icon: <FaLink />, label: 'Referral Link', value: 'Coming Soon...' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 15px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{ color: '#667eea' }}>
                          {item.icon}
                        </div>
                        <span style={{
                          color: '#4a5568',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {item.label}
                        </span>
                      </div>
                      <span style={{
                        color: '#2d3748',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Activity */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{
                  color: '#2d3748',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  📅 Weekly Activity
                </h4>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}>
                  {prevDates.length > 0 && [0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - dayIndex));
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateNumber = date.getDate();
                    const currentToastDate = prevDates[6 - dayIndex];
                    let associatedRides = [];
                    if (previousRides.length > 0) {
                      associatedRides = previousRides.filter(ride => ride[0] === currentToastDate);
                    }

                    return (
                      <div
                        key={dayIndex}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          background: activeDay === dayIndex 
                            ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                            : 'white',
                          color: activeDay === dayIndex ? 'white' : '#667eea',
                          padding: '15px 8px',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: activeDay === dayIndex ? 'translateY(-5px)' : 'none',
                          boxShadow: activeDay === dayIndex ? '0 10px 25px rgba(102, 126, 234, 0.3)' : 'none'
                        }}
                        onMouseEnter={() => handleDayHover(dayIndex)}
                        onMouseLeave={handleDayLeave}
                      >
                        <div style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '5px'
                        }}>
                          {day}
                        </div>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          marginBottom: '5px'
                        }}>
                          {dateNumber}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          background: associatedRides.length > 0 ? '#48bb78' : '#e2e8f0',
                          color: associatedRides.length > 0 ? 'white' : '#718096',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          display: 'inline-block'
                        }}>
                          {associatedRides.length} rides
                        </div>

                        {/* Toast for ride details */}
                        {activeDay === dayIndex && associatedRides.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: '10px',
                            zIndex: 1000,
                            minWidth: '300px'
                          }}>
                            <Toast style={{
                              background: 'white',
                              borderRadius: '12px',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                              border: 'none'
                            }}>
                              <Toast.Header style={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px 12px 0 0'
                              }}>
                                <strong className="me-auto">Ride Details</strong>
                                <small>{day}, {dateNumber}</small>
                              </Toast.Header>
                              <Toast.Body style={{ padding: '20px' }}>
                                {associatedRides.map((ride, index) => (
                                  <div key={index} style={{
                                    marginBottom: '15px',
                                    paddingBottom: '15px',
                                    borderBottom: index < associatedRides.length - 1 ? '1px solid #e2e8f0' : 'none'
                                  }}>
                                    <div style={{
                                      fontWeight: '600',
                                      color: '#2d3748',
                                      marginBottom: '5px'
                                    }}>
                                      Ride {index + 1}
                                    </div>
                                    <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                                      <div>From: {ride[1]}</div>
                                      <div>To: {ride[2]}</div>
                                    </div>
                                  </div>
                                ))}
                              </Toast.Body>
                            </Toast>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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

export default DashboardPage;