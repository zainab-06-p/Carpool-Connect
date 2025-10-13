import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import CommuteIOABI from '../ABI/contracttestingABI.json';
import "../stylesheets/administrator-dashboard-requests.css";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { style } from '@mui/system';

const contractAddress = '0x7B4c81ea9461f5A016359ACE651690768C87795E';

function AdministratorDashboardPassengers() {
    const [clicked1, setClicked1] = useState(false);
    const [clicked2, setClicked2] = useState(false);
    const [clicked3, setClicked3] = useState(false);
    const [clicked4, setClicked4] = useState(false);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [passengerRequests, setPassengerRequests] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [selectedPassID, setSlectedPassID] = useState(0);
    const [showPassengerDetails, setShowPassengerDetails] = useState(false);
    const [roleAdmin, setRoleAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

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
                    if (accounts[0] == '0x7613787893518461Bc6C007ccd97A5F7F877E2C4') {
                        setRoleAdmin(true);
                    }
                    await loadPassengerRequests(contract);
                    await loadPassengers(contract);
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

    const getVehicleURL = async (passreqid) => {
        const [CID, filename] = passengers[passreqid - 1].PassVehicleDetailsHash.split(";");
        const baseWeb3StorageUrl = 'https://ipfs.io/ipfs/';
        const file = `/${filename}`;
        const URL = `${baseWeb3StorageUrl}${CID}${file}`;
        return URL;
    }

    const loadPassengerRequests = async (contract) => {
        const numPassRequests = await contract.methods.GetnumPassRequests().call();
        const passengerRequests = [];

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
    };

    const handleClick1 = () => {
        setClicked1(!clicked1);
        setClicked4(false);
        setClicked2(false);
        setClicked3(false);
        history.push(`/passenger-requests`);
    };

    const handleClick2 = () => {
        setClicked2(!clicked2);
        setClicked1(false);
        setClicked4(false);
        setClicked3(false);
        history.push(`/enrolled-passengers`)
    };

    const handleClick3 = () => {
        setClicked3(!clicked3);
        setClicked1(false);
        setClicked2(false);
        setClicked4(false);
    };

    const handleClick4 = () => {
        setClicked4(!clicked4);
        setClicked1(false);
        setClicked2(false);
        setClicked3(false);
    };

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

    const handleViewPassengerDetails = () => {
        setShowPassengerDetails(true);
    }

    const handleHidePassengerDetails = () => {
        setShowPassengerDetails(false);
    }

    return (
        <div>
            {roleAdmin && !isLoading && (
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
                                fontSize: "2.2rem",
                                fontWeight: "800"
                            }}>
                                PASSENGER MANAGEMENT
                            </h1>
                            <nav style={{
                                display: "flex",
                                gap: "20px",
                                alignItems: "center"
                            }}>
                                <Link
                                    to={`/passenger-requests`}
                                    style={{
                                        textDecoration: "none",
                                        color: clicked1 ? "#667eea" : "#718096",
                                        fontWeight: "600",
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        transition: "all 0.3s ease",
                                        background: clicked1 ? "rgba(102, 126, 234, 0.1)" : "transparent",
                                        border: clicked1 ? "2px solid #667eea" : "2px solid transparent"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!clicked1) {
                                            e.target.style.color = "#667eea";
                                            e.target.style.borderColor = "#667eea";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!clicked1) {
                                            e.target.style.color = "#718096";
                                            e.target.style.borderColor = "transparent";
                                        }
                                    }}
                                >
                                    📋 Request Records
                                </Link>
                                <Link
                                    to={`/enrolled-passengers`}
                                    style={{
                                        textDecoration: "none",
                                        color: clicked2 ? "#667eea" : "#718096",
                                        fontWeight: "600",
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        transition: "all 0.3s ease",
                                        background: clicked2 ? "rgba(102, 126, 234, 0.1)" : "transparent",
                                        border: clicked2 ? "2px solid #667eea" : "2px solid transparent"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!clicked2) {
                                            e.target.style.color = "#667eea";
                                            e.target.style.borderColor = "#667eea";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!clicked2) {
                                            e.target.style.color = "#718096";
                                            e.target.style.borderColor = "transparent";
                                        }
                                    }}
                                >
                                    👥 Enrolled Passengers
                                </Link>
                                <Link
                                    to={`/`}
                                    style={{
                                        textDecoration: "none",
                                        color: "#e53e3e",
                                        fontWeight: "600",
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        transition: "all 0.3s ease",
                                        border: "2px solid #e53e3e"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#e53e3e";
                                        e.target.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.color = "#e53e3e";
                                    }}
                                >
                                    🚪 Logout
                                </Link>
                            </nav>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "30px",
                        maxWidth: "1400px",
                        margin: "0 auto"
                    }}>
                        {/* Left Panel - Passenger List */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(10px)",
                            maxHeight: "75vh",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "25px"
                            }}>
                                <h2 style={{
                                    color: "#2d3748",
                                    fontSize: "1.8rem",
                                    fontWeight: "700",
                                    margin: 0
                                }}>
                                    👥 Enrolled Passengers
                                </h2>
                                <div style={{
                                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    fontSize: "0.9rem",
                                    fontWeight: "600"
                                }}>
                                    Total: {passengers.length}
                                </div>
                            </div>

                            <div style={{
                                height: "60vh",
                                overflowY: "auto",
                                paddingRight: "10px"
                            }}>
                                <div style={{
                                    display: "grid",
                                    gap: "15px"
                                }}>
                                    {passengers.map((passenger) => (
                                        <div
                                            key={passenger.PassID}
                                            style={{
                                                background: "white",
                                                borderRadius: "15px",
                                                padding: "20px",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                border: "2px solid transparent",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                                                e.currentTarget.style.borderColor = "#667eea";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                                                e.currentTarget.style.borderColor = "transparent";
                                            }}
                                        >
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "10px"
                                            }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px"
                                                }}>
                                                    <div style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontWeight: "600",
                                                        fontSize: "0.9rem"
                                                    }}>
                                                        {passenger.PassID}
                                                    </div>
                                                    <div>
                                                        <h4 style={{
                                                            color: "#2d3748",
                                                            fontSize: "1.1rem",
                                                            fontWeight: "600",
                                                            margin: "0 0 4px 0"
                                                        }}>
                                                            {passenger.PassName}
                                                        </h4>
                                                        <p style={{
                                                            color: "#718096",
                                                            fontSize: "0.8rem",
                                                            margin: 0
                                                        }}>
                                                            📧 {passenger.PassEMail}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end",
                                                    gap: "4px"
                                                }}>
                                                    <div style={{
                                                        padding: "4px 8px",
                                                        background: "#e6fffa",
                                                        color: "#234e52",
                                                        borderRadius: "12px",
                                                        fontSize: "0.7rem",
                                                        fontWeight: "600"
                                                    }}>
                                                        Rides: {passenger.PassRidesTaken}
                                                    </div>
                                                    <div style={{
                                                        padding: "4px 8px",
                                                        background: "#ebf8ff",
                                                        color: "#2c5282",
                                                        borderRadius: "12px",
                                                        fontSize: "0.7rem",
                                                        fontWeight: "600"
                                                    }}>
                                                        Hosted: {passenger.PassRidesHosted}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr auto",
                                                gap: "15px",
                                                alignItems: "center"
                                            }}>
                                                <div>
                                                    <p style={{
                                                        color: "#718096",
                                                        fontSize: "0.8rem",
                                                        margin: "2px 0"
                                                    }}>
                                                        🏠 {passenger.PassHomeAddress}
                                                    </p>
                                                    <p style={{
                                                        color: "#718096",
                                                        fontSize: "0.7rem",
                                                        margin: "2px 0",
                                                        fontFamily: "monospace"
                                                    }}>
                                                        {passenger.PassWalletAddress.slice(0, 10)}...{passenger.PassWalletAddress.slice(-8)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSlectedPassID(passenger.PassID);
                                                        handleViewPassengerDetails();
                                                    }}
                                                    style={{
                                                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "8px 16px",
                                                        borderRadius: "8px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = "translateY(-2px)";
                                                        e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = "translateY(0)";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Passenger Details */}
                        <div style={{
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "20px",
                            padding: "30px",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                            backdropFilter: "blur(10px)",
                            maxHeight: "75vh",
                            overflow: "auto"
                        }}>
                            {showPassengerDetails ? (
                                <div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "25px"
                                    }}>
                                        <h2 style={{
                                            color: "#2d3748",
                                            fontSize: "1.8rem",
                                            fontWeight: "700",
                                            margin: 0
                                        }}>
                                            👤 Passenger Profile
                                        </h2>
                                        <button
                                            onClick={handleHidePassengerDetails}
                                            style={{
                                                background: "transparent",
                                                color: "#718096",
                                                border: "2px solid #718096",
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                fontSize: "0.9rem",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#718096";
                                                e.target.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "transparent";
                                                e.target.style.color = "#718096";
                                            }}
                                        >
                                            ✕ Close
                                        </button>
                                    </div>

                                    {/* Passenger ID Header */}
                                    <div style={{
                                        background: "linear-gradient(45deg, #667eea, #764ba2)",
                                        color: "white",
                                        padding: "15px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                        marginBottom: "25px"
                                    }}>
                                        <h3 style={{
                                            fontSize: "1.3rem",
                                            fontWeight: "700",
                                            margin: 0
                                        }}>
                                            Passenger ID: {selectedPassID}
                                        </h3>
                                    </div>

                                    {/* Personal Details */}
                                    <div style={{ marginBottom: "25px" }}>
                                        <h4 style={{
                                            color: "#2d3748",
                                            marginBottom: "15px",
                                            fontWeight: "600",
                                            borderBottom: "2px solid #e2e8f0",
                                            paddingBottom: "8px"
                                        }}>
                                            📝 Personal Information
                                        </h4>
                                        <div style={{
                                            display: "grid",
                                            gap: "12px"
                                        }}>
                                            {[
                                                { label: "Full Name", value: passengers[selectedPassID - 1]?.PassName },
                                                { label: "Email Address", value: passengers[selectedPassID - 1]?.PassEMail },
                                                { label: "Wallet Address", value: passengers[selectedPassID - 1]?.PassWalletAddress },
                                                { label: "Home Address", value: passengers[selectedPassID - 1]?.PassHomeAddress },
                                                { label: "Gender", value: passengers[selectedPassID - 1]?.PassGender }
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
                                                    <span style={{
                                                        color: "#2d3748",
                                                        fontWeight: "500",
                                                        textAlign: "right",
                                                        maxWidth: "200px",
                                                        wordBreak: "break-word"
                                                    }}>
                                                        {item.value || "Not provided"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ride Statistics */}
                                    <div style={{ marginBottom: "25px" }}>
                                        <h4 style={{
                                            color: "#2d3748",
                                            marginBottom: "15px",
                                            fontWeight: "600",
                                            borderBottom: "2px solid #e2e8f0",
                                            paddingBottom: "8px"
                                        }}>
                                            📊 Ride Statistics
                                        </h4>
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "15px"
                                        }}>
                                            <div style={{
                                                background: "linear-gradient(45deg, #48bb78, #38a169)",
                                                color: "white",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                textAlign: "center"
                                            }}>
                                                <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                                                    {passengers[selectedPassID - 1]?.PassRidesTaken}
                                                </div>
                                                <div style={{ fontSize: "0.8rem", opacity: "0.9" }}>
                                                    Rides Taken
                                                </div>
                                            </div>
                                            <div style={{
                                                background: "linear-gradient(45deg, #667eea, #764ba2)",
                                                color: "white",
                                                padding: "15px",
                                                borderRadius: "10px",
                                                textAlign: "center"
                                            }}>
                                                <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                                                    {passengers[selectedPassID - 1]?.PassRidesHosted}
                                                </div>
                                                <div style={{ fontSize: "0.8rem", opacity: "0.9" }}>
                                                    Rides Hosted
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vehicle Details */}
                                    {!(passengers[selectedPassID - 1]?.PassVehicleDetailsHash == " ") && (
                                        <div style={{ marginBottom: "25px" }}>
                                            <h4 style={{
                                                color: "#2d3748",
                                                marginBottom: "15px",
                                                fontWeight: "600",
                                                borderBottom: "2px solid #e2e8f0",
                                                paddingBottom: "8px"
                                            }}>
                                                🚗 Vehicle Information
                                            </h4>
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
                                                <div style={{
                                                    padding: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    {passengers[selectedPassID - 1]?.PassVehicleName}
                                                </div>
                                                <div style={{
                                                    padding: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    {passengers[selectedPassID - 1]?.PassVehicleNumber}
                                                </div>
                                                <div style={{
                                                    padding: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <button
                                                        disabled={!(passengers[selectedPassID - 1]?.PassVehicleDetailsHash)}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            getVehicleURL(selectedPassID)
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

                                    {/* Review Section */}
                                    <div>
                                        <h4 style={{
                                            color: "#2d3748",
                                            marginBottom: "15px",
                                            fontWeight: "600",
                                            borderBottom: "2px solid #e2e8f0",
                                            paddingBottom: "8px"
                                        }}>
                                            ⭐ Passenger Review
                                        </h4>
                                        <div style={{
                                            background: "#fffaf0",
                                            padding: "15px",
                                            borderRadius: "10px",
                                            border: "2px solid #ed8936"
                                        }}>
                                            <div style={{
                                                fontSize: "2rem",
                                                textAlign: "center",
                                                marginBottom: "10px"
                                            }}>
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <span
                                                        key={i}
                                                        style={{
                                                            color: i < (passengers[selectedPassID - 1]?.PassReview || 0) ? "#f6ad55" : "#e2e8f0",
                                                            margin: "0 2px"
                                                        }}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p style={{
                                                textAlign: "center",
                                                color: "#744210",
                                                fontWeight: "500",
                                                margin: 0
                                            }}>
                                                {passengers[selectedPassID - 1]?.PassReview || 0} out of 5 stars
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: "center",
                                    padding: "60px 20px",
                                    color: "#718096"
                                }}>
                                    <div style={{
                                        fontSize: "4rem",
                                        marginBottom: "20px",
                                        opacity: "0.5"
                                    }}>
                                        👥
                                    </div>
                                    <h3 style={{
                                        color: "#4a5568",
                                        marginBottom: "10px",
                                        fontWeight: "600"
                                    }}>
                                        No Passenger Selected
                                    </h3>
                                    <p style={{
                                        fontSize: "1rem",
                                        margin: 0
                                    }}>
                                        Select a passenger from the list to view their profile details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Access Restricted Modal */}
            <Modal show={!roleAdmin} centered>
                <Modal.Header style={{
                    background: "linear-gradient(45deg, #f56565, #e53e3e)",
                    color: "white",
                    borderBottom: "none",
                    borderRadius: "15px 15px 0 0"
                }}>
                    <Modal.Title style={{
                        fontWeight: "700",
                        fontSize: "1.3rem"
                    }}>
                        ⚠️ Access Restricted
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                    padding: "30px",
                    textAlign: "center"
                }}>
                    <div style={{
                        fontSize: "3rem",
                        marginBottom: "20px"
                    }}>
                        🚫
                    </div>
                    <h5 style={{
                        color: "#2d3748",
                        marginBottom: "15px",
                        fontWeight: "600"
                    }}>
                        Administrator Access Required
                    </h5>
                    <p style={{
                        color: "#718096",
                        lineHeight: "1.6",
                        margin: 0
                    }}>
                        You do not have access to this page. Please switch to an administrator account to view and manage passenger records.
                    </p>
                </Modal.Body>
            </Modal>

            {/* Loading Spinner */}
            {(isLoading) && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }}>
                    <div style={{
                        width: "50px",
                        height: "50px",
                        border: "4px solid rgba(255, 255, 255, 0.3)",
                        borderTop: "4px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></div>
                </div>
            )}
        </div>
    );
}

export default AdministratorDashboardPassengers;