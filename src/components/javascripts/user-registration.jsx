import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CommuteIOABI from '../ABI/contracttestingABI.json';
import "../stylesheets/administrator-dashboard-requests.css";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CgProfile } from "react-icons/cg"; 
import { GiCartwheel } from "react-icons/gi";
import { IoShieldHalf } from "react-icons/io5";
import Carousel from 'react-bootstrap/Carousel';
import { useHistory } from 'react-router-dom';
import imageh from "./image-removebg-preview (14).png";

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function AdministratorDashboardUserRegistration() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [passengerRequests, setPassengerRequests] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [name, setName] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [email, setEMail] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [gender, setGender] = useState("");
  const [isChoosingVehicle, setIsChoosingVehicle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRequestMadeModal, setShowRequestMadeModal] = useState(false);
  const [showDuplicateEntriesModal, setShowDuplicateEntriesModal] = useState(false);
  const [showRegistrationCompletionModal, setShowRegistrationCompletionModal] = useState(false);
  const [flag, setFlag] = useState(true);
  const [index, setIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);
  const handleNavigationClick = (selectedIndex) => setIndex(selectedIndex);
  const handleSkipClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseRequestMadeModal = () => setShowRequestMadeModal(false);
  const handleDuplicateEntriesModal = () => setShowDuplicateEntriesModal(false);
  const handleCheckboxChange = (event) => setIsChecked(event.target.checked);

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
          await loadPassengerRequests(contract);
          await loadPassengers(contract);
          contract.events.PassengerRequestCreated()
            .on('data', handlePassengerRequestCreated)
            .on('error', (error) => console.error('Error listening to PassengerRequestCreated event:', error));
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

  const loadPassengerRequests = async (contract) => {
    try {
      const numPassRequests = await contract.methods.GetnumPassRequests().call();
      console.log('Number of passenger requests:', numPassRequests);
      let passengerRequests = [];
      for (let i = 1; i <= numPassRequests; i++) {
        const requestDetails = await contract.methods.GetPassRequestDetails(i).call();
        passengerRequests.push({
          PassRequestID: requestDetails[0],
          PassName: requestDetails[1],
          PassWalletAddress: requestDetails[2],
          PassHomeAddress: requestDetails[3],
          PassEMail: requestDetails[7],
          PassVehicleName: requestDetails[8],
          PassVehicleNumber: requestDetails[9],
          PassVehicleDetailsHash: requestDetails[4],
          PassGender: requestDetails[5],
          PassRequestStatus: requestDetails[6],
        });
      }
      setPassengerRequests(passengerRequests);
    } catch (error) {
      console.error('Error loading passenger requests:', error);
    }
  };

  const loadPassengers = async (contract) => {
    try {
      const numPassengers = await contract.methods.GetnumPassengers().call();
      const passengersList = [];
      for (let i = 1; i <= numPassengers; i++) {
        const passengerDetails = await contract.methods.GetPassDetails(i).call();
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
    } catch (error) {
      console.error('Error loading passengers:', error);
    }
  };

  const walletAddressVerification = () => {
    const isUnique = !passengerRequests.some(request => 
      request.PassWalletAddress.toLowerCase() === accounts[0]?.toLowerCase()
    );
    console.log('Wallet address verification:', isUnique);
    return isUnique;
  };

  const emailVerification = () => {
    const isUnique = !passengerRequests.some(request => 
      request.PassEMail.toLowerCase() === email.toLowerCase()
    );
    console.log('Email verification:', isUnique);
    return isUnique;
  };

  const handleRegistrationModal = async () => {
    setShowRegistrationCompletionModal(false);
    history.push(`/verification-portal`);
  };

  function handlePassengerRequestCreated(event) {
    const requestId = event.returnValues.ID;
    console.log('New passenger request created:', requestId);
  }

  const createPassengerRequest = async () => {
    if (!contract || !accounts[0]) {
      console.error('Contract or account not initialized');
      alert('Please make sure MetaMask is connected and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Creating passenger request with data:', {
        name,
        homeAddress,
        email,
        gender,
        vehicleName: isChoosingVehicle ? vehicleName : " ",
        vehicleNumber: isChoosingVehicle ? vehicleNumber : " ",
        from: accounts[0]
      });

      const result = await contract.methods
        .CreatePassengerRequest(
          name, 
          homeAddress, 
          " ", 
          gender, 
          email, 
          isChoosingVehicle ? vehicleName : " ", 
          isChoosingVehicle ? vehicleNumber : " "
        )
        .send({ from: accounts[0] });
      
      console.log('Transaction successful:', result);
      
      await loadPassengerRequests(contract);
      setShowRequestMadeModal(true);
      
      if (flag) {
        setShowRegistrationCompletionModal(true);
      }
    } catch (error) {
      console.error('Error creating passenger request:', error);
      if (error.code === 4001) {
        alert('Transaction was denied by the user.');
        setFlag(false);
      } else {
        alert(`An error occurred while creating the passenger request: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    console.log('Submit button clicked');
    
    if (!name || !homeAddress || !email || !gender) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    if (!isChecked) {
      alert('Please agree to the declaration before submitting.');
      return;
    }

    try {
      await handleNameUpdate();
      const isWalletDifferent = walletAddressVerification();
      const isEmailDifferent = emailVerification();
      
      console.log('Verification results:', { isWalletDifferent, isEmailDifferent });
      
      if (isWalletDifferent && isEmailDifferent) {
        await createPassengerRequest();
      } else {
        setShowDuplicateEntriesModal(true);
      }
    } catch (error) {
      console.error('Error in submit application:', error);
      alert('An error occurred while submitting your application. Please try again.');
    }
  };

  const handleNameUpdate = async () => {
    console.log('Name updated:', name);
    return Promise.resolve();
  };

  return (
    <div className="signup-container" style={{ 
      background: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 50%, #0f0c29 100%)",
      minHeight: "100vh",
      padding: "0",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(86, 119, 252, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite",
        filter: "blur(40px)"
      }}></div>
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite reverse",
        filter: "blur(30px)"
      }}></div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          background: "rgba(86, 119, 252, 0.6)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `floatParticle ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `${Math.random() * 5}s`,
          filter: 'blur(1px)'
        }}></div>
      ))}

      {/* Header */}
      <header style={{
        background: "rgba(10, 10, 42, 0.8)",
        backdropFilter: "blur(15px)",
        padding: "20px 0",
        borderBottom: "1px solid rgba(86, 119, 252, 0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(45deg, #5677FC, #38B6FF)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 8px 25px rgba(86, 119, 252, 0.4)"
            }}>
              🚗
            </div>
            <h1 style={{
              margin: 0,
              background: "linear-gradient(45deg, #38B6FF, #5677FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "2.2rem",
              fontWeight: "800"
            }}>
              CARPOOL CONNECT
            </h1>
          </div>
          
          <a href="/" style={{
            textDecoration: "none",
            color: "#38B6FF",
            fontWeight: "700",
            padding: "12px 25px",
            border: "2px solid rgba(86, 119, 252, 0.3)",
            borderRadius: "12px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(86, 119, 252, 0.2)";
            e.target.style.borderColor = "#5677FC";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.05)";
            e.target.style.borderColor = "rgba(86, 119, 252, 0.3)";
            e.target.style.transform = "translateY(0)";
          }}
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: "1400px",
        margin: "40px auto",
        padding: "0 40px",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        gap: "40px",
        alignItems: "start"
      }}>
        
        {/* Left Side - Visual & Info */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: "30px",
          padding: "50px 40px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
          height: "fit-content",
          position: "sticky",
          top: "120px"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "50px"
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              background: "linear-gradient(45deg, #5677FC, #38B6FF)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 30px",
              fontSize: "3.5rem",
              boxShadow: "0 15px 35px rgba(86, 119, 252, 0.4)",
              animation: "pulse 3s ease-in-out infinite"
            }}>
              {index === 0 ? "👤" : index === 1 ? "🚗" : "✅"}
            </div>
            
            <h2 style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(45deg, #38B6FF, #5677FC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "15px"
            }}>
              {index === 0 ? "Create Profile" : index === 1 ? "Vehicle Setup" : "Final Review"}
            </h2>
            
            <p style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              fontWeight: "500"
            }}>
              {index === 0 
                ? "Tell us about yourself to create your personalized carpooling profile."
                : index === 1
                ? "Add your vehicle or join as a passenger for flexible commuting."
                : "Review your details and complete your registration process."
              }
            </p>
          </div>

          {/* Progress Indicator */}
          <div style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "20px",
            padding: "30px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "40px"
          }}>
            <h4 style={{
              color: "white",
              marginBottom: "20px",
              fontWeight: "700",
              fontSize: "1.2rem"
            }}>
              📊 Registration Progress
            </h4>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                right: "20px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.1)",
                transform: "translateY(-50%)",
                zIndex: 1
              }}></div>
              
              <div style={{
                position: "absolute",
                top: "50%",
                left: "20px",
                width: `${(index / 2) * 100}%`,
                height: "4px",
                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                transform: "translateY(-50%)",
                zIndex: 2,
                transition: "width 0.5s ease",
                borderRadius: "2px"
              }}></div>
              
              {[1, 2, 3].map((step) => (
                <div key={step} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 3
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: index >= step - 1 
                      ? "linear-gradient(45deg, #5677FC, #38B6FF)" 
                      : "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    marginBottom: "10px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: index >= step - 1 ? "0 8px 20px rgba(86, 119, 252, 0.4)" : "none"
                  }} onClick={() => handleNavigationClick(step - 1)}>
                    {step}
                  </div>
                  <span style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: index >= step - 1 ? "#38B6FF" : "rgba(255, 255, 255, 0.6)"
                  }}>
                    {step === 1 ? "Profile" : step === 2 ? "Vehicle" : "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div>
            <h4 style={{
              color: "white",
              marginBottom: "25px",
              fontWeight: "700",
              fontSize: "1.3rem",
              textAlign: "center"
            }}>
              🎯 Why Join Carpool Connect?
            </h4>
            
            <div style={{
              display: "grid",
              gap: "15px"
            }}>
              {[
                { icon: "🌱", text: "Reduce Carbon Footprint", desc: "Eco-friendly commuting" },
                { icon: "💰", text: "Save 30% on Commuting", desc: "Share travel costs" },
                { icon: "🔒", text: "Blockchain Security", desc: "Your data is protected" },
                { icon: "⚡", text: "Quick Matching", desc: "Find rides instantly" },
                { icon: "⭐", text: "Verified Community", desc: "Trusted members only" },
                { icon: "🕒", text: "Flexible Scheduling", desc: "Ride on your terms" }
              ].map((benefit, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(86, 119, 252, 0.1)";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
                >
                  <div style={{
                    fontSize: "1.8rem",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                  }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <div style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      marginBottom: "4px"
                    }}>
                      {benefit.text}
                    </div>
                    <div style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}>
                      {benefit.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "30px",
          padding: "50px 40px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "40px"
          }}>
            <h2 style={{
              fontSize: "2.2rem",
              fontWeight: "800",
              color: "#1a202c",
              marginBottom: "10px",
              background: "linear-gradient(45deg, #5677FC, #38B6FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Join Our Community
            </h2>
            <p style={{
              color: "#718096",
              fontSize: "1.1rem",
              fontWeight: "500"
            }}>
              Complete your registration in 3 simple steps
            </p>
          </div>

          {/* Carousel Content */}
          <div style={{ position: "relative", minHeight: "550px" }}>
            <Carousel 
              activeIndex={index} 
              onSelect={handleNavigationClick} 
              interval={null}
              controls={false}
              indicators={false}
            >
              {/* Step 1: Profile Information */}
              <Carousel.Item>
                <div style={{ padding: "10px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "35px",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    textAlign: "center"
                  }}>
                    👤 Personal Information
                  </h3>
                  
                  <div style={{
                    display: "grid",
                    gap: "28px",
                    maxWidth: "500px",
                    margin: "0 auto"
                  }}>
                    {[
                      {
                        label: "Full Name *",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "Enter your full name",
                        type: "text",
                        icon: "👤"
                      },
                      {
                        label: "Home Address *",
                        value: homeAddress,
                        onChange: (e) => setHomeAddress(e.target.value),
                        placeholder: "Where do you stay?",
                        type: "text",
                        icon: "🏠"
                      },
                      {
                        label: "Email Address *",
                        value: email,
                        onChange: (e) => setEMail(e.target.value),
                        placeholder: "your.email@example.com",
                        type: "email",
                        icon: "📧"
                      },
                      {
                        label: "Gender *",
                        value: gender,
                        onChange: (e) => setGender(e.target.value),
                        placeholder: "Your gender",
                        type: "text",
                        icon: "⚧️"
                      }
                    ].map((field, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <label style={{
                          display: "block",
                          marginBottom: "10px",
                          fontWeight: "700",
                          color: "#4a5568",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}>
                          <span>{field.icon}</span>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={field.placeholder}
                          style={{
                            width: "100%",
                            padding: "16px 20px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "15px",
                            fontSize: "1rem",
                            transition: "all 0.3s ease",
                            background: "white",
                            fontWeight: "500"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#5677FC";
                            e.target.style.boxShadow = "0 0 0 4px rgba(86, 119, 252, 0.1)";
                            e.target.style.transform = "translateY(-2px)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                            e.target.style.transform = "translateY(0)";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Carousel.Item>

              {/* Step 2: Vehicle Information */}
              <Carousel.Item>
                <div style={{ padding: "10px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "15px",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    textAlign: "center"
                  }}>
                    🚗 Vehicle Details
                  </h3>
                  <p style={{
                    color: "#718096",
                    textAlign: "center",
                    marginBottom: "35px",
                    fontSize: "1rem",
                    fontWeight: "500"
                  }}>
                    Optional - Skip if you don't have a vehicle
                  </p>

                  {!isChoosingVehicle ? (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "25px",
                      marginTop: "40px"
                    }}>
                      <button 
                        onClick={() => setIsChoosingVehicle(true)}
                        style={{
                          background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                          color: "white",
                          border: "none",
                          padding: "20px 45px",
                          borderRadius: "15px",
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          minWidth: "280px",
                          boxShadow: "0 10px 30px rgba(86, 119, 252, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-5px) scale(1.02)";
                          e.target.style.boxShadow = "0 15px 35px rgba(86, 119, 252, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0) scale(1)";
                          e.target.style.boxShadow = "0 10px 30px rgba(86, 119, 252, 0.4)";
                        }}
                      >
                        <span style={{ fontSize: "1.4rem" }}>🚗</span>
                        I Have a Vehicle
                      </button>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "25px", margin: "25px 0" }}>
                        <div style={{ height: "2px", background: "#e2e8f0", width: "120px" }}></div>
                        <span style={{ color: "#718096", fontWeight: "700", fontSize: "1rem" }}>OR</span>
                        <div style={{ height: "2px", background: "#e2e8f0", width: "120px" }}></div>
                      </div>

                      <button 
                        onClick={() => { setIsChoosingVehicle(false); handleSkipClick(); }}
                        style={{
                          background: "transparent",
                          color: "#e53e3e",
                          border: "2px solid #e53e3e",
                          padding: "20px 45px",
                          borderRadius: "15px",
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          minWidth: "280px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#e53e3e";
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#e53e3e";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <span style={{ fontSize: "1.4rem" }}>⏭️</span>
                        Skip This Step
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: "grid",
                      gap: "28px",
                      maxWidth: "500px",
                      margin: "30px auto 0"
                    }}>
                      {[
                        {
                          label: "Vehicle Model & Type",
                          value: vehicleName,
                          onChange: (e) => setVehicleName(e.target.value),
                          placeholder: "e.g., Toyota Camry Sedan",
                          icon: "🚙"
                        },
                        {
                          label: "License Plate Number",
                          value: vehicleNumber,
                          onChange: (e) => setVehicleNumber(e.target.value),
                          placeholder: "e.g., ABC 123",
                          icon: "🔢"
                        }
                      ].map((field, i) => (
                        <div key={i}>
                          <label style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "700",
                            color: "#4a5568",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            <span>{field.icon}</span>
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            style={{
                              width: "100%",
                              padding: "16px 20px",
                              border: "2px solid #e2e8f0",
                              borderRadius: "15px",
                              fontSize: "1rem",
                              transition: "all 0.3s ease",
                              fontWeight: "500"
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#5677FC";
                              e.target.style.boxShadow = "0 0 0 4px rgba(86, 119, 252, 0.1)";
                              e.target.style.transform = "translateY(-2px)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "#e2e8f0";
                              e.target.style.boxShadow = "none";
                              e.target.style.transform = "translateY(0)";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header style={{
                      borderBottom: "2px solid #e2e8f0",
                      background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                      color: "white"
                    }}>
                      <Modal.Title style={{ fontWeight: "800", fontSize: "1.3rem" }}>
                        🎉 Welcome as a Passenger!
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "35px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "4rem",
                        marginBottom: "25px",
                        animation: "bounce 2s infinite"
                      }}>
                        🚶
                      </div>
                      <h5 style={{ fontWeight: "700", color: "#2d3748", fontSize: "1.3rem", marginBottom: "15px" }}>
                        Great Choice!
                      </h5>
                      <p style={{ color: "#718096", lineHeight: "1.7", fontSize: "1rem" }}>
                        You've chosen to join our platform as a passenger. You can always add a vehicle later in your profile settings to become a driver.
                      </p>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
                      <button 
                        onClick={handleCloseModal}
                        style={{
                          background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                          color: "white",
                          border: "none",
                          padding: "14px 35px",
                          borderRadius: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          fontSize: "1rem",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        Continue to Next Step
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Carousel.Item>

              {/* Step 3: Review and Submit */}
              <Carousel.Item>
                <div style={{ padding: "10px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "35px",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                    textAlign: "center"
                  }}>
                    ✅ Final Review & Agreement
                  </h3>

                  <div style={{
                    background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                    padding: "35px",
                    borderRadius: "20px",
                    marginBottom: "35px",
                    border: "2px solid #e2e8f0"
                  }}>
                    <h4 style={{
                      color: "#2d3748",
                      marginBottom: "25px",
                      fontWeight: "700",
                      fontSize: "1.3rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      📋 Application Summary
                    </h4>
                    
                    <div style={{
                      display: "grid",
                      gap: "18px",
                      color: "#4a5568"
                    }}>
                      {[
                        { label: "Name", value: name },
                        { label: "Email", value: email },
                        { label: "Location", value: homeAddress },
                        { label: "Gender", value: gender },
                        ...(isChoosingVehicle ? [
                          { label: "Vehicle", value: vehicleName },
                          { label: "License Plate", value: vehicleNumber }
                        ] : [])
                      ].map((field, i) => (
                        <div key={i} style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 0",
                          borderBottom: "1px solid #e2e8f0"
                        }}>
                          <span style={{ fontWeight: "600", color: "#4a5568" }}>{field.label}:</span>
                          <strong style={{ 
                            color: field.value ? "#2d3748" : "#e53e3e",
                            fontSize: "1rem"
                          }}>
                            {field.value || "Not provided"}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "18px",
                    marginBottom: "35px",
                    padding: "25px",
                    background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)",
                    borderRadius: "15px",
                    border: "2px solid #fc8181"
                  }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{
                        transform: "scale(1.4)",
                        marginTop: "5px",
                        accentColor: "#5677FC"
                      }}
                    />
                    <div>
                      <h5 style={{
                        color: "#2d3748",
                        marginBottom: "12px",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        📝 Declaration of Accuracy
                      </h5>
                      <p style={{
                        color: "#718096",
                        lineHeight: "1.7",
                        fontSize: "0.95rem",
                        margin: 0
                      }}>
                        I solemnly affirm that all information provided in this application is true, 
                        complete, and accurate to the best of my knowledge. I understand that providing 
                        false information may result in termination of platform access.
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!isChecked || isSubmitting}
                    onClick={handleSubmitApplication}
                    style={{
                      width: "100%",
                      background: isChecked && !isSubmitting
                        ? "linear-gradient(45deg, #5677FC, #38B6FF)" 
                        : "#cbd5e0",
                      color: "white",
                      border: "none",
                      padding: "20px",
                      borderRadius: "15px",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      cursor: isChecked && !isSubmitting ? "pointer" : "not-allowed",
                      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      opacity: isChecked ? 1 : 0.6,
                      boxShadow: isChecked && !isSubmitting ? "0 10px 30px rgba(86, 119, 252, 0.4)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                    onMouseEnter={(e) => {
                      if (isChecked && !isSubmitting) {
                        e.target.style.transform = "translateY(-3px) scale(1.02)";
                        e.target.style.boxShadow = "0 15px 35px rgba(86, 119, 252, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isChecked && !isSubmitting) {
                        e.target.style.transform = "translateY(0) scale(1)";
                        e.target.style.boxShadow = "0 10px 30px rgba(86, 119, 252, 0.4)";
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid transparent",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }}></div>
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        🚀 Submit Application
                      </>
                    )}
                  </button>
                </div>
              </Carousel.Item>
            </Carousel>

            {/* Navigation Buttons */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "50px",
              padding: "0 10px"
            }}>
              <button
                onClick={() => handleNavigationClick(index - 1)}
                disabled={index === 0}
                style={{
                  background: index === 0 ? "#e2e8f0" : "linear-gradient(45deg, #5677FC, #38B6FF)",
                  color: index === 0 ? "#a0aec0" : "white",
                  border: "none",
                  padding: "14px 30px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: index === 0 ? "not-allowed" : "pointer",
                  opacity: index === 0 ? 0.5 : 1,
                  transition: "all 0.3s ease",
                  fontSize: "1rem"
                }}
                onMouseEnter={(e) => {
                  if (index !== 0) {
                    e.target.style.transform = "translateX(-5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 0) {
                    e.target.style.transform = "translateX(0)";
                  }
                }}
              >
                ← Previous Step
              </button>
              
              <button
                onClick={() => handleNavigationClick(index + 1)}
                disabled={index === 2}
                style={{
                  background: index === 2 ? "#e2e8f0" : "linear-gradient(45deg, #5677FC, #38B6FF)",
                  color: index === 2 ? "#a0aec0" : "white",
                  border: "none",
                  padding: "14px 30px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: index === 2 ? "not-allowed" : "pointer",
                  opacity: index === 2 ? 0.5 : 1,
                  transition: "all 0.3s ease",
                  fontSize: "1rem"
                }}
                onMouseEnter={(e) => {
                  if (index !== 2) {
                    e.target.style.transform = "translateX(5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 2) {
                    e.target.style.transform = "translateX(0)";
                  }
                }}
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal show={showDuplicateEntriesModal} onHide={handleDuplicateEntriesModal} centered>
        <Modal.Header style={{
          background: "linear-gradient(45deg, #e53e3e, #c53030)",
          color: "white"
        }}>
          <Modal.Title style={{ fontWeight: "800", fontSize: "1.3rem" }}>
            ⚠️ Registration Issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "35px", textAlign: "center" }}>
          <div style={{ 
            fontSize: "4rem", 
            marginBottom: "25px",
            animation: "shake 0.5s ease-in-out"
          }}>❌</div>
          <h5 style={{ fontWeight: "700", color: "#2d3748", marginBottom: "15px", fontSize: "1.3rem" }}>
            Account Already Exists
          </h5>
          <p style={{ color: "#718096", lineHeight: "1.7", fontSize: "1rem" }}>
            The provided wallet address or email is already associated with an existing account. 
            Please use different credentials to create a new application.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
          <button 
            onClick={handleDuplicateEntriesModal}
            style={{
              background: "linear-gradient(45deg, #e53e3e, #c53030)",
              color: "white",
              border: "none",
              padding: "14px 35px",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Understand
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRegistrationCompletionModal} onHide={handleRegistrationModal} centered>
        <Modal.Header style={{
          background: "linear-gradient(45deg, #38a169, #2f855a)",
          color: "white"
        }}>
          <Modal.Title style={{ fontWeight: "800", fontSize: "1.3rem" }}>
            🎉 Registration Successful!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "35px", textAlign: "center" }}>
          <div style={{ 
            fontSize: "4rem", 
            marginBottom: "25px",
            animation: "bounce 2s infinite"
          }}>✅</div>
          <h5 style={{ fontWeight: "700", color: "#2d3748", marginBottom: "15px", fontSize: "1.3rem" }}>
            Welcome to Our Community!
          </h5>
          <p style={{ color: "#718096", lineHeight: "1.7", marginBottom: "25px", fontSize: "1rem" }}>
            Your application has been successfully submitted and is now under review.
          </p>
          <div style={{
            background: "linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)",
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid #68d391",
            marginBottom: "20px"
          }}>
            <strong style={{ color: "#2d3748", fontSize: "1.1rem" }}>Application ID: </strong>
            <span style={{ color: "#2c7a7b", fontWeight: "800", fontSize: "1.2rem" }}>
              {passengerRequests.length}
            </span>
          </div>
          <p style={{ color: "#718096", fontSize: "0.9rem", fontStyle: "italic" }}>
            Please save this ID for future reference when checking your application status.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
          <button 
            onClick={handleRegistrationModal}
            style={{
              background: "linear-gradient(45deg, #38a169, #2f855a)",
              color: "white",
              border: "none",
              padding: "14px 35px",
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Start Exploring
          </button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default AdministratorDashboardUserRegistration;