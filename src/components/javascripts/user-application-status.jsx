import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import CommuteIOABI from '../ABI/contracttestingABI.json';
import "../stylesheets/administrator-dashboard-requests.css";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { style } from '@mui/system';
import { useRef } from 'react';
import { Web3Storage } from 'web3.storage';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import imageh from "../javascripts/mwhahahaha.png";

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5NTg0QzFjYjQ1QzczMTQwODQ3RjY2NjBkQ0Y5MzNjODNBM2NFMjAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODY1OTAxNDU4NzEsIm5hbWUiOiJjb21tdXRlLWlvLWZpbGUtdXBsb2FkIn0.1E8NnGBcSwApaWAm6mY6F4I1hZWQKhFDCkeOMYrSp7E';
const web3Storage = new Web3Storage({ token: apiKey });

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function AdministratorDashboardUserApplicationStatus() {
    const [clicked1, setClicked1] = useState(false);
    const [clicked2, setClicked2] = useState(false);
    const [clicked3, setClicked3] = useState(false);
    const [clicked4, setClicked4] = useState(false);
    const [web3, setWeb3] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [passengerRequests, setPassengerRequests] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [selectedRequestID, setSlectedRequestID] = useState(0);
    const [showRequestDetails, setShowRequestDetails] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);
    const [isChoosingVehicle, setIsChoosingVehicle] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isExistingApplication, setIsExistingApplication] = useState(false);
    const [isFreshApplication, setIsFreshApplication] = useState(false);
    const [isOriginalSection, setIsOriginalSection] = useState(true);
    const [userRequestID, setUserRequestID] = useState(0);
    const [userDetails, setUserDetails] = useState([]);
    const [revealedPassID, setRevealedPassID] = useState('');

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

    const handleSkipClick = () => {
        setShowModal(true);
    };

    const handleRevealPassID = () => {
        passengers.forEach((passenger) => {
            if (passenger.PassWalletAddress === accounts[0]) {
                setRevealedPassID(passenger.PassID);
                return;
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false)
    };

    const handleUserRequestIDChange = (event) => {
        setUserRequestID(event.target.value);
    };

    const handleExistingApplication = () => {
        setIsExistingApplication(true);
    }

    const handleHideExistingApplication = () => {
        setIsExistingApplication(false);
    }

    const handleHideOriginalSection = () => {
        setIsOriginalSection(false);
    }

    const handleOriginalSection = () => {
        setIsOriginalSection(true);
    }

    const handleUserDetails = async () => {
        console.log(userRequestID);
        const requestDetails = await contract.methods.GetPassRequestDetails(userRequestID).call();
        setUserDetails(requestDetails);
        console.log(userDetails);
    }

    const loadPassengers = async (contract) => {
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
    };

    const getVehicleURL = async (passreqid) => {
        const [CID, filename] = passengerRequests[passreqid - 1].PassVehicleDetailsHash.split(";");
        const baseWeb3StorageUrl = 'https://ipfs.io/ipfs/';
        const file = `/${filename}`;
        const URL = `${baseWeb3StorageUrl}${CID}${file}`;
        return URL;
    }

    const loadPassengerRequests = async (contract) => {
        const numPassRequests = await contract.methods.GetnumPassRequests().call();
        const passengerRequestsList = [];

        for (let i = 1; i <= numPassRequests; i++) {
            const requestDetails = await contract.methods.GetPassRequestDetails(i).call();
            passengerRequestsList.push({
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

        setPassengerRequests(passengerRequestsList);
    };

    return (
        <div style={{
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
                            📊
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
                            VERIFICATION PORTAL
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
                margin: "60px auto",
                padding: "0 40px",
                position: "relative",
                zIndex: 2
            }}>

                {/* Welcome Section */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "60px",
                    color: "white"
                }}>
                    <h2 style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        marginBottom: "15px",
                        textShadow: "0 4px 8px rgba(0,0,0,0.3)",
                        background: "linear-gradient(45deg, #38B6FF, #5677FC)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        Application Verification Portal
                    </h2>
                    <p style={{
                        fontSize: "1.3rem",
                        fontWeight: "500",
                        opacity: "0.9",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: "1.6"
                    }}>
                        Track your application status and manage your carpooling profile with our secure blockchain-powered system
                    </p>
                </div>

                {/* Main Options Section */}
                {isOriginalSection && !isExistingApplication && !isFreshApplication && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "40px",
                        marginBottom: "50px"
                    }}>
                        {/* Existing Application Card */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "25px",
                            padding: "50px 40px",
                            textAlign: "center",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden"
                        }} 
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.borderColor = "rgba(86, 119, 252, 0.3)";
                            e.currentTarget.style.boxShadow = "0 35px 60px rgba(86, 119, 252, 0.2)";
                        }} 
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.3)";
                        }} 
                        onClick={() => {
                            handleExistingApplication();
                            handleHideOriginalSection();
                        }}>
                            <div style={{
                                width: "100px",
                                height: "100px",
                                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 30px",
                                fontSize: "2.5rem",
                                boxShadow: "0 15px 35px rgba(86, 119, 252, 0.4)",
                                animation: "pulse 3s ease-in-out infinite"
                            }}>
                                📋
                            </div>
                            <h3 style={{
                                color: "white",
                                marginBottom: "20px",
                                fontSize: "1.8rem",
                                fontWeight: "700"
                            }}>
                                Track Existing Application
                            </h3>
                            <p style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "30px",
                                lineHeight: "1.6",
                                fontSize: "1.1rem",
                                fontWeight: "500"
                            }}>
                                Already have an application in progress? Check your status, view details, and track the verification process.
                            </p>
                            <div style={{
                                background: "rgba(86, 119, 252, 0.2)",
                                color: "#38B6FF",
                                padding: "18px 30px",
                                borderRadius: "15px",
                                fontSize: "1.1rem",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                border: "2px solid rgba(86, 119, 252, 0.3)",
                                backdropFilter: "blur(10px)"
                            }}>
                                View Application Status
                            </div>
                        </div>

                        {/* New Application Card */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "25px",
                            padding: "50px 40px",
                            textAlign: "center",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden"
                        }} 
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                            e.currentTarget.style.borderColor = "rgba(86, 119, 252, 0.3)";
                            e.currentTarget.style.boxShadow = "0 35px 60px rgba(86, 119, 252, 0.2)";
                        }} 
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)";
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.3)";
                        }}>
                            <div style={{
                                width: "100px",
                                height: "100px",
                                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 30px",
                                fontSize: "2.5rem",
                                boxShadow: "0 15px 35px rgba(86, 119, 252, 0.4)",
                                animation: "pulse 3s ease-in-out infinite"
                            }}>
                                🚀
                            </div>
                            <h3 style={{
                                color: "white",
                                marginBottom: "20px",
                                fontSize: "1.8rem",
                                fontWeight: "700"
                            }}>
                                Start New Application
                            </h3>
                            <p style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "30px",
                                lineHeight: "1.6",
                                fontSize: "1.1rem",
                                fontWeight: "500"
                            }}>
                                Begin your journey with our carpool community. Create a fresh application and join our eco-friendly network.
                            </p>
                            <Link to={`/new-application-for-passenger`} style={{
                                display: "block",
                                background: "rgba(86, 119, 252, 0.2)",
                                color: "#38B6FF",
                                padding: "18px 30px",
                                borderRadius: "15px",
                                fontSize: "1.1rem",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                border: "2px solid rgba(86, 119, 252, 0.3)",
                                backdropFilter: "blur(10px)"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = "rgba(86, 119, 252, 0.3)";
                                e.target.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = "rgba(86, 119, 252, 0.2)";
                                e.target.style.transform = "translateY(0)";
                            }}>
                                Initiate New Application
                            </Link>
                        </div>
                    </div>
                )}

                {/* Existing Application Section */}
                {isExistingApplication && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "30px",
                        padding: "50px 40px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                        animation: "slideInUp 0.6s ease-out"
                    }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.2fr",
                            gap: "50px",
                            alignItems: "center"
                        }}>
                            {/* Left Side - Visual */}
                            <div style={{
                                textAlign: "center",
                                position: "relative"
                            }}>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(86, 119, 252, 0.2), rgba(56, 182, 255, 0.2))",
                                    borderRadius: "25px",
                                    padding: "40px",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <img src={imageh} style={{
                                        width: "100%",
                                        borderRadius: "15px",
                                        transform: "scale(1.05)",
                                        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
                                    }} alt="Verification" />
                                    <div style={{
                                        position: "absolute",
                                        top: "20px",
                                        left: "20px",
                                        background: "rgba(86, 119, 252, 0.9)",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "25px",
                                        fontWeight: "700",
                                        fontSize: "0.9rem",
                                        backdropFilter: "blur(10px)"
                                    }}>
                                        🔒 Secure Verification
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div>
                                <h3 style={{
                                    color: "white",
                                    marginBottom: "15px",
                                    fontSize: "2rem",
                                    fontWeight: "700",
                                    textAlign: "center"
                                }}>
                                    Check Application Status
                                </h3>
                                <p style={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    textAlign: "center",
                                    marginBottom: "40px",
                                    fontSize: "1.1rem",
                                    fontWeight: "500"
                                }}>
                                    Enter your request ID to view your application details and current status
                                </p>

                                <div style={{
                                    display: "grid",
                                    gap: "25px"
                                }}>
                                    <div>
                                        <label style={{
                                            display: "block",
                                            marginBottom: "12px",
                                            fontWeight: "700",
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}>
                                            <span>🔢</span>
                                            Request ID
                                        </label>
                                        <input
                                            placeholder="Enter your Request ID"
                                            value={userRequestID}
                                            onChange={handleUserRequestIDChange}
                                            style={{
                                                width: "100%",
                                                padding: "18px 20px",
                                                border: "2px solid rgba(255, 255, 255, 0.1)",
                                                borderRadius: "15px",
                                                fontSize: "1rem",
                                                transition: "all 0.3s ease",
                                                background: "rgba(255, 255, 255, 0.05)",
                                                color: "white",
                                                fontWeight: "500"
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "#5677FC";
                                                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                                                e.target.style.boxShadow = "0 0 0 4px rgba(86, 119, 252, 0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                e.target.style.background = "rgba(255, 255, 255, 0.05)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: "block",
                                            marginBottom: "12px",
                                            fontWeight: "700",
                                            color: "rgba(255, 255, 255, 0.9)",
                                            fontSize: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}>
                                            <span>👛</span>
                                            Connected Wallet Address
                                        </label>
                                        <input
                                            value={accounts[0] || "Not connected"}
                                            readOnly
                                            style={{
                                                width: "100%",
                                                padding: "18px 20px",
                                                border: "2px solid rgba(255, 255, 255, 0.1)",
                                                borderRadius: "15px",
                                                fontSize: "0.9rem",
                                                background: "rgba(255, 255, 255, 0.03)",
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontWeight: "500"
                                            }}
                                        />
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        gap: "20px",
                                        marginTop: "15px"
                                    }}>
                                        <button
                                            onClick={() => {
                                                handleHideExistingApplication();
                                                handleOriginalSection();
                                            }}
                                            style={{
                                                flex: 1,
                                                background: "transparent",
                                                color: "#38B6FF",
                                                border: "2px solid rgba(86, 119, 252, 0.3)",
                                                padding: "18px",
                                                borderRadius: "12px",
                                                fontSize: "1rem",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                backdropFilter: "blur(10px)"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "rgba(86, 119, 252, 0.2)";
                                                e.target.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "transparent";
                                                e.target.style.transform = "translateY(0)";
                                            }}
                                        >
                                            ← Go Back
                                        </button>
                                        <button
                                            onClick={() => {
                                                loadPassengerRequests(contract);
                                                if (passengerRequests.length > 0 && passengerRequests[userRequestID - 1].PassWalletAddress != accounts[0]) {
                                                    alert("Your Request ID did not return the associated Metamask Wallet Address. Please switch to the correct account and try again.");
                                                }
                                                handleUserDetails();
                                                handleSkipClick();
                                            }}
                                            style={{
                                                flex: 2,
                                                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                                color: "white",
                                                border: "none",
                                                padding: "18px",
                                                borderRadius: "12px",
                                                fontSize: "1rem",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                                boxShadow: "0 10px 30px rgba(86, 119, 252, 0.4)"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "translateY(-3px) scale(1.02)";
                                                e.target.style.boxShadow = "0 15px 35px rgba(86, 119, 252, 0.5)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0) scale(1)";
                                                e.target.style.boxShadow = "0 10px 30px rgba(86, 119, 252, 0.4)";
                                            }}
                                        >
                                            🔍 View Application Status
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Application Details Modal */}
                <Modal show={showModal && passengerRequests.length > 0 && (accounts[0] == passengerRequests[userRequestID - 1].PassWalletAddress)} onHide={handleCloseModal} size="lg" centered backdrop="static">
                    <Modal.Header style={{
                        background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                        color: "white",
                        borderBottom: "none",
                        borderRadius: "20px 20px 0 0",
                        padding: "30px"
                    }}>
                        <Modal.Title style={{
                            fontWeight: "800",
                            fontSize: "1.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}>
                            📄 Application Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        padding: "40px",
                        background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)"
                    }}>
                        <div style={{
                            background: "white",
                            borderRadius: "20px",
                            padding: "35px",
                            marginBottom: "25px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                            border: "1px solid #e2e8f0"
                        }}>
                            <h4 style={{
                                color: "#2d3748",
                                marginBottom: "25px",
                                fontWeight: "800",
                                textAlign: "center",
                                fontSize: "1.5rem",
                                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text"
                            }}>
                                Request ID: <span style={{ color: "#5677FC" }}>{userRequestID}</span>
                            </h4>

                            {/* Personal Details */}
                            <div style={{ marginBottom: "30px" }}>
                                <h5 style={{
                                    color: "#2d3748",
                                    marginBottom: "20px",
                                    fontWeight: "700",
                                    borderBottom: "3px solid #e2e8f0",
                                    paddingBottom: "12px",
                                    fontSize: "1.3rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}>
                                    👤 Personal Information
                                </h5>
                                <div style={{
                                    display: "grid",
                                    gap: "15px"
                                }}>
                                    {[
                                        { label: "Full Name", value: userDetails[1], icon: "👤" },
                                        { label: "Email Address", value: userDetails[7], icon: "📧" },
                                        { label: "Wallet Address", value: userDetails[2], icon: "👛" },
                                        { label: "Home Address", value: userDetails[3], icon: "🏠" },
                                        { label: "Gender", value: userDetails[5], icon: "⚧️" }
                                    ].map((item, index) => (
                                        <div key={index} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "15px",
                                            background: "#f7fafc",
                                            borderRadius: "12px",
                                            border: "1px solid #e2e8f0",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#edf2f7";
                                            e.currentTarget.style.transform = "translateX(5px)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#f7fafc";
                                            e.currentTarget.style.transform = "translateX(0)";
                                        }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                                                <span style={{ fontWeight: "700", color: "#4a5568" }}>{item.label}:</span>
                                            </div>
                                            <span style={{ color: "#2d3748", fontWeight: "600", fontSize: "1rem" }}>{item.value || "Not provided"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            {!(userDetails[4] == " ") && (
                                <div style={{ marginBottom: "30px" }}>
                                    <h5 style={{
                                        color: "#2d3748",
                                        marginBottom: "20px",
                                        fontWeight: "700",
                                        borderBottom: "3px solid #e2e8f0",
                                        paddingBottom: "12px",
                                        fontSize: "1.3rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                    }}>
                                        🚗 Vehicle Information
                                    </h5>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: "20px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{
                                            padding: "20px",
                                            background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                            color: "white",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            boxShadow: "0 8px 20px rgba(86, 119, 252, 0.3)"
                                        }}>
                                            Vehicle Type
                                        </div>
                                        <div style={{
                                            padding: "20px",
                                            background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                            color: "white",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            boxShadow: "0 8px 20px rgba(86, 119, 252, 0.3)"
                                        }}>
                                            License Plate
                                        </div>
                                        <div style={{
                                            padding: "20px",
                                            background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                            color: "white",
                                            borderRadius: "12px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            boxShadow: "0 8px 20px rgba(86, 119, 252, 0.3)"
                                        }}>
                                            Documents
                                        </div>
                                        <div style={{ padding: "15px", fontWeight: "600", color: "#2d3748", fontSize: "1.1rem" }}>{userDetails[8]}</div>
                                        <div style={{ padding: "15px", fontWeight: "600", color: "#2d3748", fontSize: "1.1rem" }}>{userDetails[9]}</div>
                                        <div style={{ padding: "15px" }}>
                                            <button
                                                disabled={!(userDetails[4])}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    getVehicleURL(userRequestID)
                                                        .then((vehicleURL) => {
                                                            window.open(vehicleURL, "_blank");
                                                        })
                                                        .catch((error) => {
                                                            console.error("Error retrieving vehicle URL:", error);
                                                        });
                                                }}
                                                style={{
                                                    background: "transparent",
                                                    color: "#5677FC",
                                                    border: "2px solid #5677FC",
                                                    padding: "12px 20px",
                                                    borderRadius: "10px",
                                                    fontWeight: "700",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease",
                                                    fontSize: "0.95rem"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = "#5677FC";
                                                    e.target.style.color = "white";
                                                    e.target.style.transform = "translateY(-2px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = "transparent";
                                                    e.target.style.color = "#5677FC";
                                                    e.target.style.transform = "translateY(0)";
                                                }}
                                            >
                                                📄 View Papers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Application Status */}
                            <div style={{ marginBottom: "25px" }}>
                                <h5 style={{
                                    color: "#2d3748",
                                    marginBottom: "20px",
                                    fontWeight: "700",
                                    borderBottom: "3px solid #e2e8f0",
                                    paddingBottom: "12px",
                                    fontSize: "1.3rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}>
                                    📊 Application Status
                                </h5>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "25px"
                                }}>
                                    <span style={{ fontWeight: "700", color: "#4a5568", fontSize: "1.1rem" }}>Status:</span>
                                    {userDetails[6] == 1 && (
                                        <div style={{
                                            background: "linear-gradient(45deg, #48bb78, #38a169)",
                                            color: "white",
                                            padding: "15px 30px",
                                            borderRadius: "30px",
                                            fontWeight: "800",
                                            fontSize: "1.1rem",
                                            border: "none",
                                            boxShadow: "0 8px 20px rgba(72, 187, 120, 0.4)",
                                            animation: "pulse 2s infinite"
                                        }}>
                                            ✅ APPROVED
                                        </div>
                                    )}
                                    {userDetails[6] == 2 && (
                                        <div style={{
                                            background: "linear-gradient(45deg, #e53e3e, #c53030)",
                                            color: "white",
                                            padding: "15px 30px",
                                            borderRadius: "30px",
                                            fontWeight: "800",
                                            fontSize: "1.1rem",
                                            border: "none",
                                            boxShadow: "0 8px 20px rgba(229, 62, 62, 0.4)"
                                        }}>
                                            ❌ REJECTED
                                        </div>
                                    )}
                                    {userDetails[6] == 0 && (
                                        <div style={{
                                            background: "linear-gradient(45deg, #a0aec0, #718096)",
                                            color: "white",
                                            padding: "15px 30px",
                                            borderRadius: "30px",
                                            fontWeight: "800",
                                            fontSize: "1.1rem",
                                            border: "none",
                                            boxShadow: "0 8px 20px rgba(160, 174, 192, 0.4)"
                                        }}>
                                            ⏳ PENDING REVIEW
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Passenger ID Section */}
                            {userDetails[6] == 1 && (
                                <div style={{
                                    background: "linear-gradient(135deg, #c6f6d5, #9ae6b4)",
                                    padding: "30px",
                                    borderRadius: "20px",
                                    textAlign: "center",
                                    marginTop: "25px",
                                    border: "2px solid #68d391",
                                    boxShadow: "0 10px 30px rgba(104, 211, 145, 0.3)"
                                }}>
                                    <h6 style={{
                                        color: "#22543d",
                                        marginBottom: "20px",
                                        fontWeight: "800",
                                        fontSize: "1.4rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px"
                                    }}>
                                        🎉 Congratulations!
                                    </h6>
                                    <p style={{
                                        color: "#22543d",
                                        marginBottom: "20px",
                                        fontSize: "1.1rem",
                                        fontWeight: "600",
                                        lineHeight: "1.6"
                                    }}>
                                        Your application has been approved. Welcome to our carpooling community!
                                    </p>
                                    {revealedPassID == "" && (
                                        <button
                                            onClick={handleRevealPassID}
                                            style={{
                                                background: "#22543d",
                                                color: "white",
                                                border: "none",
                                                padding: "15px 35px",
                                                borderRadius: "12px",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                fontSize: "1.1rem",
                                                boxShadow: "0 8px 20px rgba(34, 84, 61, 0.4)"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "translateY(-3px)";
                                                e.target.style.boxShadow = "0 12px 25px rgba(34, 84, 61, 0.5)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "0 8px 20px rgba(34, 84, 61, 0.4)";
                                            }}
                                        >
                                            🔓 Reveal Passenger ID
                                        </button>
                                    )}
                                    {!(revealedPassID == "") && (
                                        <div style={{
                                            background: "white",
                                            padding: "25px",
                                            borderRadius: "15px",
                                            marginTop: "15px",
                                            border: "2px solid #48bb78",
                                            boxShadow: "0 8px 20px rgba(72, 187, 120, 0.3)"
                                        }}>
                                            <h5 style={{
                                                color: "#22543d",
                                                fontSize: "1.5rem",
                                                fontWeight: "800",
                                                margin: "0 0 10px 0"
                                            }}>
                                                Passenger ID: <span style={{ color: "#5677FC" }}>{revealedPassID}</span>
                                            </h5>
                                            <p style={{
                                                color: "#4a5568",
                                                fontSize: "1rem",
                                                margin: "15px 0 0 0",
                                                fontWeight: "600"
                                            }}>
                                                🎯 Save this ID for future identification on our platform
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{
                        borderTop: "none",
                        background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
                        borderRadius: "0 0 20px 20px",
                        justifyContent: "center",
                        padding: "30px"
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{
                                background: "linear-gradient(45deg, #5677FC, #38B6FF)",
                                color: "white",
                                border: "none",
                                padding: "15px 35px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                fontSize: "1.1rem",
                                boxShadow: "0 8px 20px rgba(86, 119, 252, 0.4)"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 12px 25px rgba(86, 119, 252, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 8px 20px rgba(86, 119, 252, 0.4)";
                            }}
                        >
                            Close Panel
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>

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
                
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default AdministratorDashboardUserApplicationStatus;