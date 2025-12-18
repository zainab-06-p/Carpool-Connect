import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaPaperPlane, FaSearch, FaUserFriends, FaUserCircle } from 'react-icons/fa'
import { BsChatDotsFill } from 'react-icons/bs';
import { API_URL, SOCKET_URL } from './config';

const socket = io(SOCKET_URL);

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([username]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      // Add message to local state immediately for the sender
      setMessageList((prevList) => [...prevList, messageData]);
      setCurrentMessage("");

      // Send to backend and other users
      await axios.post(`${API_URL}/messages`, messageData);
      socket.emit("send_message", messageData);
    }
  }

  const receiveMessageHandler = (data) => {
    setMessageList((prevList) => [...prevList, data]);
    console.log('event receive message init');
  };

  useEffect(() => {
    axios.get(`${API_URL}/messages/${room}`)
      .then((response) => {
        console.log('Chat history response:', response.data);
        console.log('Is array?', Array.isArray(response.data));
        // Ensure response.data is an array
        const messages = Array.isArray(response.data) ? response.data : [];
        setMessageList(messages);
      })
      .catch((error) => {
        console.error('Error retrieving chat history:', error);
        console.error('Error response:', error.response);
        // Set empty array on error to prevent map errors
        setMessageList([]);
      });

    socket.on("receive_message", receiveMessageHandler)

    socket.on('user_entered', (data) => {
      setUsersInRoom((users) => {
        if (!users.includes(data)) {
          return [...users, data];
        }
        return users;
      });
    });

    socket.on('users_in_room', (users) => {
      setUsersInRoom(users);
    });

    socket.emit('join_room', { room, username });

    return () => {
      socket.off('receive_message', receiveMessageHandler);
      socket.off("user_entered");
    };
  }, [room, username]);

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
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '10px 20px',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.2)'
            }}>
              <BsChatDotsFill style={{ color: '#667eea', fontSize: '1.5rem' }} />
              <div>
                <div style={{ color: '#2d3748', fontWeight: '600', fontSize: '1rem' }}>
                  Ride Chat
                </div>
                <div style={{ color: '#718096', fontSize: '0.8rem' }}>
                  Room: {room}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          flex: 1
        }}>
          {/* Left Panel - Users List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Users List Header */}
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
                <FaUserFriends />
              </div>
              <div>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 0 5px 0'
                }}>
                  Online Users
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
                  {usersInRoom.length} {usersInRoom.length === 1 ? 'User' : 'Users'}
                </div>
              </div>
            </div>

            {/* Users List */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {usersInRoom.map((user, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: username === user ? 'rgba(102, 126, 234, 0.1)' : '#f7fafc',
                  borderRadius: '12px',
                  border: username === user ? '2px solid rgba(102, 126, 234, 0.3)' : '2px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  if (username !== user) {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }
                }}
                >
                  <FaUserCircle style={{
                    fontSize: "32px",
                    color: username === user ? '#667eea' : '#718096'
                  }} />
                  <div style={{
                    flex: 1
                  }}>
                    <div style={{
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '0.95rem'
                    }}>
                      {user}
                      {username === user && (
                        <span style={{
                          background: 'linear-gradient(45deg, #48bb78, #38a169)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          marginLeft: '8px'
                        }}>
                          You
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: '#718096',
                      fontSize: '0.8rem'
                    }}>
                      Online now
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Online Status */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#2d3748',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                {usersInRoom.length > 1 ? (
                  `${usersInRoom.length - 1} Other User${usersInRoom.length - 1 > 1 ? 's' : ''} online`
                ) : (
                  'You are the only one online'
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Window */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Chat Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '25px',
              paddingBottom: '20px',
              borderBottom: '2px solid #e2e8f0'
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
                <BsChatDotsFill />
              </div>
              <div>
                <h3 style={{
                  color: '#2d3748',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 0 5px 0'
                }}>
                  Live Chat
                </h3>
                <div style={{
                  color: '#718096',
                  fontSize: '0.9rem'
                }}>
                  Real-time messaging with your ride companions
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              background: '#f7fafc',
              borderRadius: '15px',
              padding: '20px',
              border: '2px solid #e2e8f0',
              overflowY: 'auto',
              marginBottom: '25px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {messageList.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#718096',
                  textAlign: 'center'
                }}>
                  <BsChatDotsFill style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }} />
                  <h4 style={{ color: '#4a5568', marginBottom: '10px' }}>No messages yet</h4>
                  <p>Start the conversation by sending the first message!</p>
                </div>
              ) : (
                messageList.map((messageContent, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: username === messageContent.author ? 'flex-end' : 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: username === messageContent.author ? 'flex-end' : 'flex-start'
                    }}>
                      <div style={{
                        background: username === messageContent.author 
                          ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                          : 'white',
                        color: username === messageContent.author ? 'white' : '#2d3748',
                        padding: '15px 20px',
                        borderRadius: username === messageContent.author 
                          ? '20px 20px 5px 20px' 
                          : '20px 20px 20px 5px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        border: username === messageContent.author 
                          ? 'none' 
                          : '2px solid #e2e8f0',
                        wordWrap: 'break-word'
                      }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.95rem',
                          lineHeight: '1.4'
                        }}>
                          {messageContent.message}
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '5px',
                        fontSize: '0.8rem',
                        color: '#718096'
                      }}>
                        <span style={{ fontWeight: '600' }}>
                          {username === messageContent.author ? 'You' : messageContent.author}
                        </span>
                        <span>•</span>
                        <span>{messageContent.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              padding: '20px',
              background: '#f7fafc',
              borderRadius: '15px',
              border: '2px solid #e2e8f0'
            }}>
              <input
                type="text"
                value={currentMessage}
                placeholder='Type your message here...'
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  outline: 'none'
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
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                style={{
                  background: currentMessage.trim() 
                    ? 'linear-gradient(45deg, #48bb78, #38a169)' 
                    : 'linear-gradient(45deg, #cccccc, #999999)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 25px',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: currentMessage.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: currentMessage.trim() 
                    ? '0 8px 25px rgba(72, 187, 120, 0.4)' 
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (currentMessage.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 30px rgba(72, 187, 120, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMessage.trim()) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.4)';
                  }
                }}
              >
                <FaPaperPlane />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;