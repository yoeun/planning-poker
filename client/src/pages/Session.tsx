import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getSession, deleteSession, createSession } from '../utils/api';
import { getUserData, saveUserData, generateUserId, UserData } from '../utils/storage';
import UserList from '../components/UserList';
import VotingCards from '../components/VotingCards';
import Results from '../components/Results';
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
  const socketRef = useRef<Socket | null>(null);
  const isJoiningRef = useRef<boolean>(false);

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

  const handleNewSession = async (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    const savedUserData = getUserData();
    if (!savedUserData || !savedUserData.name.trim()) {
      navigate('/');
      return;
    }

    try {
      const { sessionId: newSessionId } = await createSession();
      navigate(`/session/${newSessionId}`);
    } catch (err) {
      setError('Failed to create new session');
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
          <button
            onClick={handleCreateNewSessionAfterEnd}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition"
          >
            Create New Session
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Planning Session</h1>
              <p className="text-gray-600 text-sm">
                Session ID: <span className="font-mono font-semibold">{sessionId}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                onClick={handleNewSession}
                onAuxClick={(e) => {
                  // Handle middle-click (button 1) - let it open in new tab
                  if (e.button === 1) {
                    // Don't prevent default, let the browser handle it
                    return;
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
              >
                New Session
              </a>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg shadow-sm transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-lg shadow-sm transition"
              >
                Delete Session
              </button>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-6">
          <UserList
            users={session.users}
            currentUserId={userData.userId}
            onEditProfile={handleEditProfileClick}
          />
        </div>

        {/* Main Voting Area */}
        <div>
          {session.revealed ? (
            <Results
              users={session.users}
              choices={session.choices}
              currentUserId={userData.userId}
              onMakeChoice={handleMakeChoice}
              pointOptions={POINT_OPTIONS}
            />
          ) : (
            <VotingCards
              choices={session.choices}
              currentUserId={userData.userId}
              currentUserChoice={currentUserChoice}
              allChosen={allChosen}
              totalUsers={allUsers.length}
              onMakeChoice={handleMakeChoice}
              onReveal={handleReveal}
              pointOptions={POINT_OPTIONS}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Session?"
        message="This will permanently delete the session. All users will be disconnected."
        confirmText="Delete"
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
