import { useState } from 'react';

interface SessionEndedProps {
  onCreateNewSession: () => Promise<void>;
  error?: string;
}

export default function SessionEnded({ onCreateNewSession, error: externalError }: SessionEndedProps) {
  const [creatingNewSession, setCreatingNewSession] = useState(false);
  const [error, setError] = useState('');

  const handleCreateNewSession = async () => {
    setCreatingNewSession(true);
    setError('');
    
    try {
      await onCreateNewSession();
    } catch (err) {
      setError('Failed to create new session');
      setCreatingNewSession(false);
      console.error(err);
    }
  };

  const displayError = error || externalError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Ended</h1>
        <p className="text-gray-600 mb-8">
          The session has been ended by the host. All participants have been disconnected.
        </p>
        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {displayError}
          </div>
        )}
        <button
          onClick={handleCreateNewSession}
          disabled={creatingNewSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingNewSession ? 'Creating...' : 'Create New Session'}
        </button>
      </div>
    </div>
  );
}

