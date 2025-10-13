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

      // Call the contract method
      const result = await contract.methods
        .CreatePassengerRequest(
          name, 
          homeAddress, 
          " ", // vehicleDetailsHash (empty for now)
          gender, 
          email, 
          isChoosingVehicle ? vehicleName : " ", 
          isChoosingVehicle ? vehicleNumber : " "
        )
        .send({ from: accounts[0] });
      
      console.log('Transaction successful:', result);
      
      // Reload passenger requests to get the updated list
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
    
    // Validate required fields
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

  // Add this function to handle name updates properly
  const handleNameUpdate = async () => {
    // Since you're using a single name field now, this might not be needed
    // But keeping it for compatibility
    console.log('Name updated:', name);
    return Promise.resolve();
  };

  return (
    <div className="signup-container" style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "20px 40px",
        marginBottom: "30px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{
            margin: 0,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            fontWeight: "800"
          }}>
            CARPOOL CONNECT
          </h1>
          <a href="/" style={{
            textDecoration: "none",
            color: "#667eea",
            fontWeight: "600",
            padding: "10px 20px",
            border: "2px solid #667eea",
            borderRadius: "10px",
            transition: "all 0.3s ease"
          }}>
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "30px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        
        {/* Left Side - Form */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "25px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{
              fontSize: "2.2rem",
              fontWeight: "700",
              color: "#2d3748",
              marginBottom: "10px"
            }}>
              Join Our Carpool Community
            </h2>
            <p style={{
              color: "#718096",
              fontSize: "1.1rem",
              fontWeight: "500"
            }}>
              Let's get you set up in just a few steps
            </p>
          </div>

          {/* Progress Steps */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "50px",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50px",
              right: "50px",
              height: "3px",
              background: "#e2e8f0",
              transform: "translateY(-50%)",
              zIndex: 1
            }}></div>
            
            {[1, 2, 3].map((step) => (
              <div key={step} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2
              }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: index >= step - 1 ? "#667eea" : "#e2e8f0",
                  color: index >= step - 1 ? "white" : "#718096",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  marginBottom: "10px",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }} onClick={() => handleNavigationClick(step - 1)}>
                  {step}
                </div>
                <span style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: index >= step - 1 ? "#667eea" : "#718096"
                }}>
                  {step === 1 ? "Profile" : step === 2 ? "Vehicle" : "Review"}
                </span>
              </div>
            ))}
          </div>

          {/* Carousel Content */}
          <div style={{ position: "relative", minHeight: "500px" }}>
            <Carousel 
              activeIndex={index} 
              onSelect={handleNavigationClick} 
              interval={null}
              controls={false}
              indicators={false}
            >
              {/* Step 1: Profile Information */}
              <Carousel.Item>
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "30px",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    Tell Us About Yourself
                  </h3>
                  
                  <div style={{
                    display: "grid",
                    gap: "25px",
                    maxWidth: "500px",
                    margin: "0 auto"
                  }}>
                    {[
                      {
                        label: "Full Name *",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "Enter your full name",
                        type: "text"
                      },
                      {
                        label: "Home Address *",
                        value: homeAddress,
                        onChange: (e) => setHomeAddress(e.target.value),
                        placeholder: "Where do you stay?",
                        type: "text"
                      },
                      {
                        label: "Email Address *",
                        value: email,
                        onChange: (e) => setEMail(e.target.value),
                        placeholder: "your.email@example.com",
                        type: "email"
                      },
                      {
                        label: "Gender *",
                        value: gender,
                        onChange: (e) => setGender(e.target.value),
                        placeholder: "Your gender",
                        type: "text"
                      }
                    ].map((field, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <label style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "600",
                          color: "#4a5568",
                          fontSize: "0.95rem"
                        }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={field.placeholder}
                          style={{
                            width: "100%",
                            padding: "15px 20px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            transition: "all 0.3s ease",
                            background: "white"
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#667eea";
                            e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Carousel.Item>

              {/* Step 2: Vehicle Information */}
              <Carousel.Item>
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "10px",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    Vehicle Details
                  </h3>
                  <p style={{
                    color: "#718096",
                    textAlign: "center",
                    marginBottom: "30px"
                  }}>
                    Optional - You can skip if you don't have a vehicle
                  </p>

                  {!isChoosingVehicle ? (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                      marginTop: "50px"
                    }}>
                      <button 
                        onClick={() => setIsChoosingVehicle(true)}
                        style={{
                          background: "linear-gradient(45deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          padding: "18px 40px",
                          borderRadius: "12px",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          minWidth: "250px"
                        }}
                      >
                        🚗 I Have a Vehicle
                      </button>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "20px 0" }}>
                        <div style={{ height: "1px", background: "#e2e8f0", width: "100px" }}></div>
                        <span style={{ color: "#718096", fontWeight: "600" }}>OR</span>
                        <div style={{ height: "1px", background: "#e2e8f0", width: "100px" }}></div>
                      </div>

                      <button 
                        onClick={() => { setIsChoosingVehicle(false); handleSkipClick(); }}
                        style={{
                          background: "transparent",
                          color: "#e53e3e",
                          border: "2px solid #e53e3e",
                          padding: "18px 40px",
                          borderRadius: "12px",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          minWidth: "250px"
                        }}
                      >
                        ⏭️ Skip This Step
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: "grid",
                      gap: "25px",
                      maxWidth: "500px",
                      margin: "30px auto 0"
                    }}>
                      {[
                        {
                          label: "Vehicle Model & Type",
                          value: vehicleName,
                          onChange: (e) => setVehicleName(e.target.value),
                          placeholder: "e.g., Toyota Camry Sedan"
                        },
                        {
                          label: "License Plate Number",
                          value: vehicleNumber,
                          onChange: (e) => setVehicleNumber(e.target.value),
                          placeholder: "e.g., ABC 123"
                        }
                      ].map((field, i) => (
                        <div key={i}>
                          <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#4a5568",
                            fontSize: "0.95rem"
                          }}>
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            style={{
                              width: "100%",
                              padding: "15px 20px",
                              border: "2px solid #e2e8f0",
                              borderRadius: "12px",
                              fontSize: "1rem",
                              transition: "all 0.3s ease"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header style={{
                      borderBottom: "2px solid #e2e8f0",
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      color: "white"
                    }}>
                      <Modal.Title style={{ fontWeight: "700" }}>
                        🎉 Great Choice!
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: "30px", textAlign: "center" }}>
                      <div style={{
                        fontSize: "3rem",
                        marginBottom: "20px"
                      }}>
                        🚶
                      </div>
                      <h5 style={{ fontWeight: "600", color: "#2d3748" }}>
                        Welcome as a Passenger!
                      </h5>
                      <p style={{ color: "#718096", lineHeight: "1.6" }}>
                        You've chosen to join our platform as a passenger. You can always add a vehicle later in your profile settings.
                      </p>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
                      <button 
                        onClick={handleCloseModal}
                        style={{
                          background: "linear-gradient(45deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          padding: "12px 30px",
                          borderRadius: "10px",
                          fontWeight: "600",
                          cursor: "pointer"
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
                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    color: "#2d3748",
                    marginBottom: "30px",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    Final Review & Agreement
                  </h3>

                  <div style={{
                    background: "#f7fafc",
                    padding: "30px",
                    borderRadius: "15px",
                    marginBottom: "30px"
                  }}>
                    <h4 style={{
                      color: "#2d3748",
                      marginBottom: "20px",
                      fontWeight: "600"
                    }}>
                      📋 Application Summary
                    </h4>
                    
                    <div style={{
                      display: "grid",
                      gap: "15px",
                      color: "#4a5568"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Name:</span>
                        <strong>{name || "Not provided"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Email:</span>
                        <strong>{email || "Not provided"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Location:</span>
                        <strong>{homeAddress || "Not provided"}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Gender:</span>
                        <strong>{gender || "Not provided"}</strong>
                      </div>
                      {isChoosingVehicle && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Vehicle:</span>
                            <strong>{vehicleName || "Not provided"}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>License Plate:</span>
                            <strong>{vehicleNumber || "Not provided"}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                    marginBottom: "30px",
                    padding: "20px",
                    background: "#fff5f5",
                    borderRadius: "12px",
                    border: "2px solid #fed7d7"
                  }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      style={{
                        transform: "scale(1.3)",
                        marginTop: "5px"
                      }}
                    />
                    <div>
                      <h5 style={{
                        color: "#2d3748",
                        marginBottom: "10px",
                        fontWeight: "600"
                      }}>
                        📝 Declaration of Accuracy
                      </h5>
                      <p style={{
                        color: "#718096",
                        lineHeight: "1.6",
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
                        ? "linear-gradient(45deg, #667eea, #764ba2)" 
                        : "#cbd5e0",
                      color: "white",
                      border: "none",
                      padding: "18px",
                      borderRadius: "12px",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      cursor: isChecked && !isSubmitting ? "pointer" : "not-allowed",
                      transition: "all 0.3s ease",
                      opacity: isChecked ? 1 : 0.6
                    }}
                  >
                    {isSubmitting ? "⏳ Submitting..." : "🚀 Submit Application"}
                  </button>
                </div>
              </Carousel.Item>
            </Carousel>

            {/* Navigation Buttons */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
              padding: "0 20px"
            }}>
              <button
                onClick={() => handleNavigationClick(index - 1)}
                disabled={index === 0}
                style={{
                  background: index === 0 ? "#e2e8f0" : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: index === 0 ? "#a0aec0" : "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: index === 0 ? "not-allowed" : "pointer",
                  opacity: index === 0 ? 0.5 : 1
                }}
              >
                ← Previous
              </button>
              
              <button
                onClick={() => handleNavigationClick(index + 1)}
                disabled={index === 2}
                style={{
                  background: index === 2 ? "#e2e8f0" : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: index === 2 ? "#a0aec0" : "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: index === 2 ? "not-allowed" : "pointer",
                  opacity: index === 2 ? 0.5 : 1
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "25px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}>
          <div style={{
            width: "200px",
            height: "200px",
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px"
          }}>
            <span style={{ fontSize: "4rem" }}>
              {index === 0 ? "👤" : index === 1 ? "🚗" : "✅"}
            </span>
          </div>
          
          <h3 style={{
            color: "#2d3748",
            marginBottom: "15px",
            fontSize: "1.5rem",
            fontWeight: "600"
          }}>
            {index === 0 ? "Personal Profile" : index === 1 ? "Vehicle Setup" : "Final Review"}
          </h3>
          
          <p style={{
            color: "#718096",
            lineHeight: "1.6",
            fontSize: "1rem"
          }}>
            {index === 0 
              ? "Tell us about yourself to help us create your personalized carpooling experience."
              : index === 1
              ? "Add your vehicle details to become a driver, or skip to join as a passenger."
              : "Review your information and agree to our terms to complete your registration."
            }
          </p>

          <div style={{
            marginTop: "40px",
            padding: "20px",
            background: "#f7fafc",
            borderRadius: "15px",
            width: "100%"
          }}>
            <h4 style={{
              color: "#2d3748",
              marginBottom: "15px",
              fontWeight: "600",
              fontSize: "1.1rem"
            }}>
              💡 Why Join Us?
            </h4>
            <ul style={{
              color: "#718096",
              textAlign: "left",
              paddingLeft: "20px",
              lineHeight: "1.8",
              fontSize: "0.9rem"
            }}>
              <li>Reduce your carbon footprint</li>
              <li>Save on commuting costs</li>
              <li>Meet like-minded commuters</li>
              <li>Flexible scheduling</li>
              <li>Verified community members</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal show={showDuplicateEntriesModal} onHide={handleDuplicateEntriesModal} centered>
        <Modal.Header style={{
          background: "linear-gradient(45deg, #e53e3e, #c53030)",
          color: "white"
        }}>
          <Modal.Title style={{ fontWeight: "700" }}>
            ⚠️ Registration Issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>❌</div>
          <h5 style={{ fontWeight: "600", color: "#2d3748", marginBottom: "15px" }}>
            Account Already Exists
          </h5>
          <p style={{ color: "#718096", lineHeight: "1.6" }}>
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
              padding: "12px 30px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
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
          <Modal.Title style={{ fontWeight: "700" }}>
            🎉 Registration Successful!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "30px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
          <h5 style={{ fontWeight: "600", color: "#2d3748", marginBottom: "15px" }}>
            Welcome to Our Community!
          </h5>
          <p style={{ color: "#718096", lineHeight: "1.6", marginBottom: "20px" }}>
            Your application has been successfully submitted and is now under review.
          </p>
          <div style={{
            background: "#e6fffa",
            padding: "15px",
            borderRadius: "10px",
            border: "2px solid #81e6d9"
          }}>
            <strong style={{ color: "#2d3748" }}>Application ID: </strong>
            <span style={{ color: "#2c7a7b", fontWeight: "700" }}>
              {passengerRequests.length}
            </span>
          </div>
          <p style={{ color: "#718096", fontSize: "0.9rem", marginTop: "15px" }}>
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
              padding: "12px 30px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Start Exploring
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdministratorDashboardUserRegistration;