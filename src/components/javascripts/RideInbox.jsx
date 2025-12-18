import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { FaStar, FaUser, FaListAlt, FaCar, FaHistory, FaEnvelope, FaMapMarkerAlt, FaWallet, FaCarSide, FaIdCard, FaGift, FaLink } from 'react-icons/fa';
import { RiCaravanFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Chat from './Chat';
import Web3 from 'web3';
import CommuteIOABI from '../ABI/contracttestingABI.json';

const socket = io.connect("http://localhost:4000");

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function Inbox() {
  const { passengerID } = useParams();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
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
  }, []);

  const joinRoom = async () => {
    if (username !== "" && room !== "") {
      console.log(passengerID);
      const rideDetails = await contract.methods.GetRideDetails(room).call();
      if (rideDetails[3] == passengerID || rideDetails[4].includes(passengerID)) {
        socket.emit("join_room", room);
        setShowChat(true);
      } else {
        alert("Incorrect RideID");
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {!isLoading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          {/* Header Navigation - Matching the reference style */}
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
                      color: item.text === 'Inbox' ? '#667eea' : '#4a5568',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: item.text === 'Inbox' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (item.text !== 'Inbox') {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.text !== 'Inbox') {
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

          {/* Main Chat Interface */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {!showChat ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                alignItems: "center"
              }}>
                {/* Left Panel - Welcome Section */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "25px",
                  padding: "50px 40px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  textAlign: "center",
                  height: "fit-content"
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                  }}>
                    <span style={{ 
                      color: 'white', 
                      fontSize: '50px',
                      fontWeight: 'bold'
                    }}>
                      ✉️
                    </span>
                  </div>
                  
                  <h2 style={{ 
                    color: "#2d3748", 
                    fontWeight: "700",
                    fontSize: '32px',
                    margin: '0 0 15px 0',
                    lineHeight: '1.2'
                  }}>Ride Conversation Portal</h2>
                  
                  <p style={{
                    color: "#718096",
                    fontSize: '17px',
                    marginBottom: '30px',
                    lineHeight: '1.6'
                  }}>
                    Connect with your fellow travelers and coordinate your journey seamlessly through our secure chat platform.
                  </p>

                  {/* Features List */}
                  <div style={{
                    display: 'grid',
                    gap: '15px',
                    textAlign: 'left',
                    marginTop: '40px'
                  }}>
                    {[
                      { icon: "🔒", text: "Secure & Encrypted Conversations" },
                      { icon: "🚗", text: "Real-time Ride Coordination" },
                      { icon: "👥", text: "Direct Communication with Co-travelers" },
                      { icon: "📱", text: "Instant Notifications & Updates" }
                    ].map((feature, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '12px',
                        background: '#f7fafc',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0'
                      }}>
                        <span style={{ fontSize: '20px' }}>{feature.icon}</span>
                        <span style={{
                          color: '#4a5568',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel - Login Form */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "25px",
                  padding: "50px 40px",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  height: "fit-content"
                }}>
                  <h3 style={{
                    color: "#2d3748",
                    fontWeight: "700",
                    fontSize: '24px',
                    marginBottom: '30px',
                    textAlign: 'center'
                  }}>
                    Join Ride Conversation
                  </h3>

                  {/* Input Fields */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '25px',
                    marginBottom: '35px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '14px'
                      }}>
                        Display Name *
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                        placeholder="Enter your preferred name"
                        style={{ 
                          width: "100%", 
                          padding: "16px 20px", 
                          border: '2px solid #e2e8f0', 
                          borderRadius: '12px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: 'white'
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

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '14px'
                      }}>
                        Ride Identification Code *
                      </label>
                      <input
                        type="text"
                        value={room}
                        onChange={(e) => { setRoom(e.target.value) }}
                        placeholder="Enter your unique ride code"
                        style={{ 
                          width: "100%", 
                          padding: "16px 20px", 
                          border: '2px solid #e2e8f0', 
                          borderRadius: '12px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: 'white'
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
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={joinRoom}
                    disabled={!username || !room}
                    style={{
                      width: "100%",
                      padding: "18px",
                      background: !username || !room 
                        ? '#cbd5e0' 
                        : 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: !username || !room ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: !username || !room 
                        ? 'none' 
                        : '0 8px 25px rgba(102, 126, 234, 0.4)',
                      opacity: !username || !room ? 0.6 : 1
                    }}
                    onMouseOver={(e) => {
                      if (username && room) {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (username && room) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                      }
                    }}
                  >
                    🚀 Access Ride Conversation
                  </button>

                  {/* Help Section */}
                  <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <h4 style={{
                      color: '#2d3748',
                      marginBottom: '12px',
                      fontWeight: '600',
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>💡</span> Need Help Finding Your Ride ID?
                    </h4>
                    <p style={{
                      color: '#718096',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      Your Ride ID can be found in:
                      <br/>• Ride confirmation email
                      <br/>• My Rides section in your profile
                      <br/>• Ride details page
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Chat socket={socket} username={username} room={room} />
            )}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
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

export default Inbox;