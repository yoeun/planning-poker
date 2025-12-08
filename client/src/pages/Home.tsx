import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../utils/api';
import { getUserData, saveUserData, generateUserId, UserData } from '../utils/storage';
import HomeView from './HomeView';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved user data
  useEffect(() => {
    const saved = getUserData();
    if (saved) {
      setName(saved.name);
      setEmail(saved.email);
    }
  }, []);

  const handleCreateSession = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = getUserData()?.userId || generateUserId();
      const userData: UserData = { name: name.trim(), email: email.trim(), userId };
      saveUserData(userData);

      const { sessionId: newSessionId } = await createSession();
      navigate(`/session/${newSessionId}`);
    } catch (err) {
      setError('Failed to create session. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    const userId = getUserData()?.userId || generateUserId();
    const userData: UserData = { name: name.trim(), email: email.trim(), userId };
    saveUserData(userData);

    navigate(`/session/${sessionId.trim()}`);
  };

  return (
    <HomeView
      name={name}
      email={email}
      sessionId={sessionId}
      loading={loading}
      error={error}
      onNameChange={setName}
      onEmailChange={setEmail}
      onSessionIdChange={setSessionId}
      onCreateSession={handleCreateSession}
      onJoinSession={handleJoinSession}
    />
  );
}

