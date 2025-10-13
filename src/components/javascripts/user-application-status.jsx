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
                        CARPOOL VERIFICATION
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
                maxWidth: "1200px",
                margin: "0 auto"
            }}>

                {/* Welcome Section */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "40px",
                    color: "white"
                }}>
                    <h2 style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        marginBottom: "10px",
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}>
                        Application Verification Portal
                    </h2>
                    <p style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                        opacity: "0.9"
                    }}>
                        Track your application status and manage your profile
                    </p>
                </div>

                {/* Main Options Section */}
                {isOriginalSection && !isExistingApplication && !isFreshApplication && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "30px",
                        marginBottom: "40px"
                    }}>
                        {/* Existing Application Card */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "20px",
                            padding: "40px",
                            textAlign: "center",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            border: "3px solid transparent"
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.borderColor = "#667eea";
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "transparent";
                        }} onClick={() => {
                            handleExistingApplication();
                            handleHideOriginalSection();
                        }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: "2rem"
                            }}>
                                📋
                            </div>
                            <h3 style={{
                                color: "#2d3748",
                                marginBottom: "15px",
                                fontSize: "1.5rem",
                                fontWeight: "600"
                            }}>
                                Track Existing Application
                            </h3>
                            <p style={{
                                color: "#718096",
                                marginBottom: "25px",
                                lineHeight: "1.6"
                            }}>
                                Already have an application in progress? Check your status and view details.
                            </p>
                            <button style={{
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                color: "white",
                                border: "none",
                                padding: "15px 30px",
                                borderRadius: "10px",
                                fontSize: "1rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                width: "100%"
                            }}>
                                View Application Status
                            </button>
                        </div>

                        {/* New Application Card */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "20px",
                            padding: "40px",
                            textAlign: "center",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            border: "3px solid transparent"
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.borderColor = "#667eea";
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "transparent";
                        }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                                fontSize: "2rem"
                            }}>
                                🚀
                            </div>
                            <h3 style={{
                                color: "#2d3748",
                                marginBottom: "15px",
                                fontSize: "1.5rem",
                                fontWeight: "600"
                            }}>
                                Start New Application
                            </h3>
                            <p style={{
                                color: "#718096",
                                marginBottom: "25px",
                                lineHeight: "1.6"
                            }}>
                                Begin your journey with our carpool community. Create a fresh application.
                            </p>
                            <Link to={`/new-application-for-passenger`} style={{
                                display: "block",
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                color: "white",
                                border: "none",
                                padding: "15px 30px",
                                borderRadius: "10px",
                                fontSize: "1rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                width: "100%"
                            }}>
                                Initiate New Application
                            </Link>
                        </div>
                    </div>
                )}

                {/* Existing Application Section */}
                {isExistingApplication && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "20px",
                        padding: "40px",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "40px",
                            alignItems: "center"
                        }}>
                            {/* Left Side - Image */}
                            <div style={{
                                textAlign: "center"
                            }}>
                                <div style={{
                                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                                    borderRadius: "20px",
                                    padding: "30px",
                                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                                }}>
                                    <img src={imageh} style={{
                                        width: "100%",
                                        borderRadius: "15px",
                                        transform: "scale(1.05)"
                                    }} alt="Verification" />
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div>
                                <h3 style={{
                                    color: "#2d3748",
                                    marginBottom: "10px",
                                    fontSize: "1.8rem",
                                    fontWeight: "600",
                                    textAlign: "center"
                                }}>
                                    Check Application Status
                                </h3>
                                <p style={{
                                    color: "#718096",
                                    textAlign: "center",
                                    marginBottom: "30px"
                                }}>
                                    Enter your request ID to view your application details
                                </p>

                                <div style={{
                                    display: "grid",
                                    gap: "20px"
                                }}>
                                    <div>
                                        <label style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontWeight: "600",
                                            color: "#4a5568",
                                            fontSize: "0.95rem"
                                        }}>
                                            Request ID
                                        </label>
                                        <input
                                            placeholder="Enter your Request ID"
                                            value={userRequestID}
                                            onChange={handleUserRequestIDChange}
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

                                    <div>
                                        <label style={{
                                            display: "block",
                                            marginBottom: "8px",
                                            fontWeight: "600",
                                            color: "#4a5568",
                                            fontSize: "0.95rem"
                                        }}>
                                            Connected Wallet Address
                                        </label>
                                        <input
                                            value={accounts[0] || "Not connected"}
                                            readOnly
                                            style={{
                                                width: "100%",
                                                padding: "15px 20px",
                                                border: "2px solid #e2e8f0",
                                                borderRadius: "12px",
                                                fontSize: "0.9rem",
                                                background: "#f7fafc",
                                                color: "#718096"
                                            }}
                                        />
                                    </div>

                                    <div style={{
                                        display: "flex",
                                        gap: "15px",
                                        marginTop: "10px"
                                    }}>
                                        <button
                                            onClick={() => {
                                                handleHideExistingApplication();
                                                handleOriginalSection();
                                            }}
                                            style={{
                                                flex: 1,
                                                background: "transparent",
                                                color: "#667eea",
                                                border: "2px solid #667eea",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#667eea";
                                                e.target.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "transparent";
                                                e.target.style.color = "#667eea";
                                            }}
                                        >
                                            Go Back
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
                                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                                color: "white",
                                                border: "none",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "translateY(-2px)";
                                                e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        >
                                            View Application Status
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
                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                        color: "white",
                        borderBottom: "none",
                        borderRadius: "15px 15px 0 0"
                    }}>
                        <Modal.Title style={{
                            fontWeight: "700",
                            fontSize: "1.5rem"
                        }}>
                            📄 Application Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        padding: "30px",
                        background: "#f7fafc"
                    }}>
                        <div style={{
                            background: "white",
                            borderRadius: "15px",
                            padding: "25px",
                            marginBottom: "20px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                        }}>
                            <h4 style={{
                                color: "#2d3748",
                                marginBottom: "20px",
                                fontWeight: "600",
                                textAlign: "center",
                                fontSize: "1.3rem"
                            }}>
                                Request ID: <span style={{ color: "#667eea" }}>{userRequestID}</span>
                            </h4>

                            {/* Personal Details */}
                            <div style={{ marginBottom: "25px" }}>
                                <h5 style={{
                                    color: "#2d3748",
                                    marginBottom: "15px",
                                    fontWeight: "600",
                                    borderBottom: "2px solid #e2e8f0",
                                    paddingBottom: "8px"
                                }}>
                                    👤 Personal Information
                                </h5>
                                <div style={{
                                    display: "grid",
                                    gap: "12px"
                                }}>
                                    {[
                                        { label: "Full Name", value: userDetails[1] },
                                        { label: "Email Address", value: userDetails[7] },
                                        { label: "Wallet Address", value: userDetails[2] },
                                        { label: "Home Address", value: userDetails[3] },
                                        { label: "Gender", value: userDetails[5] }
                                    ].map((item, index) => (
                                        <div key={index} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "10px",
                                            background: "#f7fafc",
                                            borderRadius: "8px"
                                        }}>
                                            <span style={{ fontWeight: "600", color: "#4a5568" }}>{item.label}:</span>
                                            <span style={{ color: "#2d3748", fontWeight: "500" }}>{item.value || "Not provided"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            {!(userDetails[4] == " ") && (
                                <div style={{ marginBottom: "25px" }}>
                                    <h5 style={{
                                        color: "#2d3748",
                                        marginBottom: "15px",
                                        fontWeight: "600",
                                        borderBottom: "2px solid #e2e8f0",
                                        paddingBottom: "8px"
                                    }}>
                                        🚗 Vehicle Information
                                    </h5>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: "15px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{
                                            padding: "15px",
                                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                                            color: "white",
                                            borderRadius: "10px",
                                            fontWeight: "600"
                                        }}>
                                            Vehicle Type
                                        </div>
                                        <div style={{
                                            padding: "15px",
                                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                                            color: "white",
                                            borderRadius: "10px",
                                            fontWeight: "600"
                                        }}>
                                            License Plate
                                        </div>
                                        <div style={{
                                            padding: "15px",
                                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                                            color: "white",
                                            borderRadius: "10px",
                                            fontWeight: "600"
                                        }}>
                                            Documents
                                        </div>
                                        <div style={{ padding: "10px" }}>{userDetails[8]}</div>
                                        <div style={{ padding: "10px" }}>{userDetails[9]}</div>
                                        <div style={{ padding: "10px" }}>
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
                                                    color: "#667eea",
                                                    border: "2px solid #667eea",
                                                    padding: "8px 15px",
                                                    borderRadius: "6px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = "#667eea";
                                                    e.target.style.color = "white";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = "transparent";
                                                    e.target.style.color = "#667eea";
                                                }}
                                            >
                                                View Papers
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Application Status */}
                            <div style={{ marginBottom: "25px" }}>
                                <h5 style={{
                                    color: "#2d3748",
                                    marginBottom: "15px",
                                    fontWeight: "600",
                                    borderBottom: "2px solid #e2e8f0",
                                    paddingBottom: "8px"
                                }}>
                                    📊 Application Status
                                </h5>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "20px"
                                }}>
                                    <span style={{ fontWeight: "600", color: "#4a5568" }}>Status:</span>
                                    {userDetails[6] == 1 && (
                                        <div style={{
                                            background: "#c6f6d5",
                                            color: "#22543d",
                                            padding: "10px 20px",
                                            borderRadius: "25px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            border: "2px solid #48bb78"
                                        }}>
                                            ✅ APPROVED
                                        </div>
                                    )}
                                    {userDetails[6] == 2 && (
                                        <div style={{
                                            background: "#fed7d7",
                                            color: "#742a2a",
                                            padding: "10px 20px",
                                            borderRadius: "25px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            border: "2px solid #f56565"
                                        }}>
                                            ❌ REJECTED
                                        </div>
                                    )}
                                    {userDetails[6] == 0 && (
                                        <div style={{
                                            background: "#e2e8f0",
                                            color: "#2d3748",
                                            padding: "10px 20px",
                                            borderRadius: "25px",
                                            fontWeight: "700",
                                            fontSize: "1rem",
                                            border: "2px solid #a0aec0"
                                        }}>
                                            ⏳ PENDING
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Passenger ID Section */}
                            {userDetails[6] == 1 && (
                                <div style={{
                                    background: "linear-gradient(45deg, #c6f6d5, #48bb78)",
                                    padding: "20px",
                                    borderRadius: "15px",
                                    textAlign: "center",
                                    marginTop: "20px"
                                }}>
                                    <h6 style={{
                                        color: "#22543d",
                                        marginBottom: "15px",
                                        fontWeight: "600",
                                        fontSize: "1.1rem"
                                    }}>
                                        🎉 Congratulations! Your application has been approved.
                                    </h6>
                                    <p style={{
                                        color: "#22543d",
                                        marginBottom: "15px",
                                        fontSize: "0.95rem"
                                    }}>
                                        Click below to reveal your Passenger ID for CARPOOLING DAPP
                                    </p>
                                    {revealedPassID == "" && (
                                        <button
                                            onClick={handleRevealPassID}
                                            style={{
                                                background: "#22543d",
                                                color: "white",
                                                border: "none",
                                                padding: "12px 25px",
                                                borderRadius: "8px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "translateY(-2px)";
                                                e.target.style.boxShadow = "0 5px 15px rgba(34, 84, 61, 0.4)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "translateY(0)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        >
                                            Reveal Passenger ID
                                        </button>
                                    )}
                                    {!(revealedPassID == "") && (
                                        <div style={{
                                            background: "white",
                                            padding: "15px",
                                            borderRadius: "10px",
                                            marginTop: "10px"
                                        }}>
                                            <h5 style={{
                                                color: "#22543d",
                                                fontSize: "1.3rem",
                                                fontWeight: "700",
                                                margin: 0
                                            }}>
                                                Passenger ID: {revealedPassID}
                                            </h5>
                                            <p style={{
                                                color: "#4a5568",
                                                fontSize: "0.9rem",
                                                margin: "10px 0 0 0"
                                            }}>
                                                Save this ID for future identification on our platform
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{
                        borderTop: "none",
                        background: "#f7fafc",
                        borderRadius: "0 0 15px 15px",
                        justifyContent: "center"
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{
                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                color: "white",
                                border: "none",
                                padding: "12px 30px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "none";
                            }}
                        >
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default AdministratorDashboardUserApplicationStatus;