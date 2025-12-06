import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getSession, deleteSession } from '../utils/api';
import { getUserData, saveUserData, generateUserId, UserData } from '../utils/storage';
import UserList from '../components/UserList';
import VotingCards from '../components/VotingCards';
import Results from '../components/Results';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isJoiningRef = useRef<boolean>(false);

  useEffect(() => {
    const savedUserData = getUserData();
    if (savedUserData) {
      setName(savedUserData.name);
      setEmail(savedUserData.email);
    }
  }, []);

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
          navigate('/');
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
          navigate('/');
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-1">
            <UserList
              users={session.users}
              currentUserId={userData.userId}
              currentUserName={userData.name}
              currentUserEmail={userData.email}
              onUpdateUser={handleUpdateUser}
            />
          </div>

          {/* Main Voting Area */}
          <div className="lg:col-span-2">
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Session?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete the session. All users will be disconnected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
