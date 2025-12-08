import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, deleteSession, createSession } from '../utils/api';
import { getUserData, saveUserData, generateUserId, UserData } from '../utils/storage';
import { SessionData } from '../types';
import { useSessionSocket } from '../hooks/useSessionSocket';
import SessionView from './SessionView';

export default function Session() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isParticipantsCollapsed, setIsParticipantsCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isJoiningRef = useRef<boolean>(false);

  // WebSocket hook
  const {
    emitUpdateUser,
    emitMakeChoice,
    emitRevealChoices,
    emitResetSession,
    disconnect: disconnectSocket,
  } = useSessionSocket({
    sessionId,
    userData,
    onSessionUpdate: setSession,
    onSessionEnded: () => setSessionEnded(true),
    onError: setError,
    enabled: !showJoinForm && !!userData,
  });



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
        setLoading(false);
      } catch (err) {
        setError('Session not found');
        setLoading(false);
        console.error(err);
      }
    };

    loadSession();
  }, [sessionId]);



  const handleJoinSession = (name: string, email: string) => {
    // Prevent concurrent executions using ref (synchronous check)
    if (isJoiningRef.current || loading) {
      return;
    }

    if (!sessionId) {
      setError('Invalid session ID');
      return;
    }

    // Mark as joining immediately (synchronous)
    isJoiningRef.current = true;

    const userId = getUserData()?.userId || generateUserId();
    const existingColor = getUserData()?.color;
    const userData: UserData = { name, email, userId, color: existingColor };
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

  const handleUpdateUser = (name: string, email: string, color?: string) => {
    if (!userData) return;

    const updatedUserData: UserData = { ...userData, name, email, color };
    saveUserData(updatedUserData);
    setUserData(updatedUserData);

    emitUpdateUser(name, email, color);

    setShowEditProfileModal(false);
  };

  const handleEditProfileClick = () => {
    if (userData) {
      setError('');
      setShowEditProfileModal(true);
    }
  };

  const handleSaveProfile = (name: string, email: string, color?: string) => {
    handleUpdateUser(name, email, color);
  };

  const handleMakeChoice = (choice: string) => {
    emitMakeChoice(choice);
  };

  const handleReveal = () => {
    emitRevealChoices();
  };

  const handleReset = () => {
    emitResetSession();
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowToast(true);
      } catch (fallbackErr) {
        console.error('Failed to copy URL:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
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

  const handleEndSession = () => {
    setShowDeleteConfirm(true);
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
    disconnectSocket();

    const savedUserData = getUserData();
    if (!savedUserData || !savedUserData.name.trim()) {
      window.location.href = '/';
      return;
    }

    setError('');

    const { sessionId: newSessionId } = await createSession();
    // Use window.location.href to force a full page reload and reset all state
    window.location.href = `/session/${newSessionId}`;
  };

  const savedUserData = getUserData();
  
  return (
    <SessionView
      session={session}
      userData={userData}
      sessionId={sessionId || ''}
      loading={loading}
      error={error}
      showJoinForm={showJoinForm}
      sessionEnded={sessionEnded}
      showDeleteConfirm={showDeleteConfirm}
      showEndSessionConfirm={showEndSessionConfirm}
      showEditProfileModal={showEditProfileModal}
      isParticipantsCollapsed={isParticipantsCollapsed}
      showToast={showToast}
      onJoinSession={handleJoinSession}
      onEditProfileClick={handleEditProfileClick}
      onSaveProfile={handleSaveProfile}
      onMakeChoice={handleMakeChoice}
      onReveal={handleReveal}
      onReset={handleReset}
      onShare={handleShare}
      onDelete={handleDelete}
      onNewSession={handleNewSession}
      onEndSession={handleEndSession}
      onEndSessionAndCreateNew={handleEndSessionAndCreateNew}
      onKeepSessionAndCreateNew={handleKeepSessionAndCreateNew}
      onCreateNewSessionAfterEnd={handleCreateNewSessionAfterEnd}
      onToggleParticipantsCollapse={() => setIsParticipantsCollapsed(!isParticipantsCollapsed)}
      onCloseDeleteConfirm={() => setShowDeleteConfirm(false)}
      onCloseEndSessionConfirm={() => setShowEndSessionConfirm(false)}
      onCloseEditProfileModal={() => {
        setShowEditProfileModal(false);
        setError('');
      }}
      onCloseToast={() => setShowToast(false)}
      onGoHome={() => navigate('/')}
      initialName={savedUserData?.name || ''}
      initialEmail={savedUserData?.email || ''}
    />
  );
}
