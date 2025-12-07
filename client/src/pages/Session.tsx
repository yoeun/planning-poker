import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getSession, deleteSession, createSession } from '../utils/api';
import { getUserData, saveUserData, generateUserId, UserData } from '../utils/storage';
import UserList from '../components/UserList';
import VotingCards from '../components/VotingCards';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';

const POINT_OPTIONS = ['?', '0.5', '1', '1.5', '2', '2.5', '3+'];
const API_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

interface User {
  name: string;
  email: string;
  joinedAt: number;
}

interface SessionData {
  id: string;
  users: Record<string, User>;
  choices: Record<string, string>;
  revealed: boolean;
  createdAt: number;
}

export default function Session() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isParticipantsCollapsed, setIsParticipantsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [creatingNewSession, setCreatingNewSession] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isJoiningRef = useRef<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUserData = getUserData();
    if (savedUserData) {
      setName(savedUserData.name);
      setEmail(savedUserData.email);
      setEditName(savedUserData.name);
      setEditEmail(savedUserData.email);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setEditName(userData.name);
      setEditEmail(userData.email);
    }
  }, [userData]);

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        setError('Invalid session ID');
        setLoading(false);
        return;
      }

      const savedUserData = getUserData();
      if (!savedUserData || !savedUserData.name.trim()) {
        setShowJoinForm(true);
        setLoading(false);
        return;
      }

      setUserData(savedUserData);

      try {
        const sessionData = await getSession(sessionId);
        setSession(sessionData);

        // Connect to socket
        const newSocket = io(API_URL);
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
          newSocket.emit('joinSession', {
            sessionId,
            userId: savedUserData.userId,
            name: savedUserData.name,
            email: savedUserData.email,
          });
        });

        newSocket.on('sessionUpdate', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('userJoined', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('userUpdated', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('choiceMade', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('revealChoices', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('sessionReset', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('sessionDeleted', () => {
          setSessionEnded(true);
        });

        newSocket.on('error', (data: { message: string }) => {
          setError(data.message);
        });

        setLoading(false);
      } catch (err) {
        setError('Session not found');
        setLoading(false);
        console.error(err);
      }
    };

    loadSession();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId, navigate]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);


  const handleJoinSession = () => {
    // Prevent concurrent executions using ref (synchronous check)
    if (isJoiningRef.current || loading) {
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!sessionId) {
      setError('Invalid session ID');
      return;
    }

    // Mark as joining immediately (synchronous)
    isJoiningRef.current = true;

    // Clean up any existing socket connection before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const userId = getUserData()?.userId || generateUserId();
    const userData: UserData = { name: name.trim(), email: email.trim(), userId };
    saveUserData(userData);
    setUserData(userData);
    setShowJoinForm(false);
    setError('');
    setLoading(true);

    // Now load the session
    const loadSession = async () => {
      try {
        const sessionData = await getSession(sessionId);
        setSession(sessionData);

        // Connect to socket
        const newSocket = io(API_URL);
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
          newSocket.emit('joinSession', {
            sessionId,
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
          });
        });

        newSocket.on('sessionUpdate', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('userJoined', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('userUpdated', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('choiceMade', () => {
          // Session will be updated via sessionUpdate
        });

        newSocket.on('revealChoices', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('sessionReset', (data: SessionData) => {
          setSession(data);
        });

        newSocket.on('sessionDeleted', () => {
          setSessionEnded(true);
        });

        newSocket.on('error', (data: { message: string }) => {
          setError(data.message);
        });

        setLoading(false);
        isJoiningRef.current = false;
      } catch (err) {
        setError('Session not found');
        setLoading(false);
        isJoiningRef.current = false;
        console.error(err);
      }
    };

    loadSession();
  };

  const handleUpdateUser = (name: string, email: string) => {
    if (!socket || !sessionId || !userData) return;

    const updatedUserData: UserData = { ...userData, name, email };
    saveUserData(updatedUserData);
    setUserData(updatedUserData);

    socket.emit('updateUser', {
      sessionId,
      userId: userData.userId,
      name: name.trim(),
      email: email.trim(),
    });

    setShowEditProfileModal(false);
  };

  const handleEditProfileClick = () => {
    if (userData) {
      setEditName(userData.name);
      setEditEmail(userData.email);
      setError('');
      setShowEditProfileModal(true);
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      setError('Please enter your name');
      return;
    }
    handleUpdateUser(editName.trim(), editEmail.trim());
  };

  const handleMakeChoice = (choice: string) => {
    if (!socket || !sessionId || !userData) return;

    socket.emit('makeChoice', {
      sessionId,
      userId: userData.userId,
      choice,
    });
  };

  const handleReveal = () => {
    if (!socket || !sessionId) return;
    socket.emit('revealChoices', { sessionId });
  };

  const handleReset = () => {
    if (!socket || !sessionId) return;
    socket.emit('resetSession', { sessionId });
  };

  const handleDelete = async () => {
    if (!sessionId) return;
    try {
      await deleteSession(sessionId);
      navigate('/');
    } catch (err) {
      setError('Failed to delete session');
      console.error(err);
    }
  };

  const handleNewSession = async (e: React.MouseEvent<HTMLElement>) => {
    // Allow ctrl+click (Windows/Linux) or cmd+click (Mac) to open home page in new tab
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      // Don't prevent default - let browser handle opening in new tab
      return;
    }

    e.preventDefault();

    // Only create session if user data exists
    const savedUserData = getUserData();
    if (!savedUserData || !savedUserData.name.trim()) {
      // If no user data, just navigate to home
      navigate('/');
      return;
    }

    // Show confirmation dialog to end current session
    if (sessionId) {
      setShowEndSessionConfirm(true);
    } else {
      // No current session, just create a new one
      try {
        const { sessionId: newSessionId } = await createSession();
        navigate(`/session/${newSessionId}`);
      } catch (err) {
        setError('Failed to create new session');
        console.error(err);
      }
    }
  };

  const handleEndSessionAndCreateNew = async () => {
    if (!sessionId) return;

    setShowEndSessionConfirm(false);

    try {
      // Delete current session (this will notify other users via socket)
      await deleteSession(sessionId);

      // Create new session
      const { sessionId: newSessionId } = await createSession();
      navigate(`/session/${newSessionId}`);
    } catch (err) {
      setError('Failed to create new session');
      console.error(err);
    }
  };

  const handleKeepSessionAndCreateNew = async () => {
    setShowEndSessionConfirm(false);

    const savedUserData = getUserData();
    if (!savedUserData || !savedUserData.name.trim()) {
      navigate('/');
      return;
    }

    try {
      const { sessionId: newSessionId } = await createSession();
      // Open new session in a new tab/window
      window.open(`/session/${newSessionId}`, '_blank');
    } catch (err) {
      setError('Failed to create new session');
      console.error(err);
    }
  };

  const handleCreateNewSessionAfterEnd = async () => {
    // Clean up socket connection before navigating
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const savedUserData = getUserData();
    if (!savedUserData || !savedUserData.name.trim()) {
      window.location.href = '/';
      return;
    }

    setCreatingNewSession(true);
    setError('');

    try {
      const { sessionId: newSessionId } = await createSession();
      // Use window.location.href to force a full page reload and reset all state
      window.location.href = `/session/${newSessionId}`;
    } catch (err) {
      setError('Failed to create new session');
      setCreatingNewSession(false);
      console.error(err);
    }
  };

  if (showJoinForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Session</h1>
          <p className="text-gray-600 mb-8">Enter your details to join the planning session</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinSession();
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinSession();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Used for Gravatar avatar</p>
            </div>
          </div>

          <button
            onClick={handleJoinSession}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining...' : 'Join Session'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading session...</div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!session || !userData) return null;

  // Show session ended message if session was deleted
  if (sessionEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Ended</h1>
          <p className="text-gray-600 mb-8">
            The session has been ended by the host. All participants have been disconnected.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <button
            onClick={handleCreateNewSessionAfterEnd}
            disabled={creatingNewSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingNewSession ? 'Creating...' : 'Create New Session'}
          </button>
        </div>
      </div>
    );
  }

  const currentUserChoice = session.choices[userData.userId];
  const allUsers = Object.keys(session.users);
  const allChosen = allUsers.every(uid => session.choices[uid] !== undefined);

  return (
    <div className="min-h-screen p-4 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Planning Poker</h1>
              <p className="text-gray-600 text-sm">
                Session ID: <span className="font-mono font-semibold">{sessionId}</span>
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleReset}
                className="hidden md:flex px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Reset
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition flex items-center justify-center"
                  title="More options"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        handleReset();
                        setShowMenu(false);
                      }}
                      className="md:hidden w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Reset
                    </button>
                    <a
                      href="/"
                      onClick={(e) => {
                        handleNewSession(e);
                        setShowMenu(false);
                      }}
                      onAuxClick={(e) => {
                        // Handle middle-click (button 1) - let it open in new tab
                        if (e.button === 1) {
                          // Don't prevent default, let the browser handle it
                          return;
                        }
                        setShowMenu(false);
                      }}
                      className="px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      New Session
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      End Session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Participants */}
          <div className={`md:flex-shrink-0 transition-all ${isParticipantsCollapsed ? 'md:w-auto' : 'md:w-80'}`}>
            <UserList
              users={session.users}
              currentUserId={userData.userId}
              onEditProfile={handleEditProfileClick}
              isCollapsed={isParticipantsCollapsed}
              onToggleCollapse={() => setIsParticipantsCollapsed(!isParticipantsCollapsed)}
            />
          </div>

          {/* Main Voting Area */}
          <div className="flex-1">
            <VotingCards
              choices={session.choices}
              currentUserId={userData.userId}
              currentUserChoice={currentUserChoice}
              allChosen={allChosen}
              totalUsers={allUsers.length}
              onMakeChoice={handleMakeChoice}
              onReveal={handleReveal}
              onReset={handleReset}
              pointOptions={POINT_OPTIONS}
              users={session.users}
              revealed={session.revealed}
            />
          </div>
        </div>
      </div>

      {/* End Session Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="End Session?"
        message="This will permanently delete the session. All users will be disconnected."
        confirmText="End"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />

      {/* End Session and Create New Confirmation Modal */}
      <Modal
        isOpen={showEndSessionConfirm}
        onClose={() => setShowEndSessionConfirm(false)}
      >
        <Modal.Header showCloseButton={true} onClose={() => setShowEndSessionConfirm(false)}>
          <h3 className="text-xl font-bold text-gray-900">Create New Session</h3>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">
            Would you like to end the current session? Ending it will disconnect all other participants.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleEndSessionAndCreateNew}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Yes
            </button>
            <button
              onClick={handleKeepSessionAndCreateNew}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
            >
              No, keep current session
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => {
          setShowEditProfileModal(false);
          setError('');
        }}
      >
        <Modal.Header showCloseButton={true} onClose={() => setShowEditProfileModal(false)}>
          <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveProfile();
                  }
                }}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="your.email@example.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveProfile();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">Used for Gravatar avatar</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Save
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
