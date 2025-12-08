export interface HomeViewProps {
  // Form state
  name: string;
  email: string;
  sessionId: string;
  
  // UI state
  loading: boolean;
  error: string;
  
  // Callbacks
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onSessionIdChange: (sessionId: string) => void;
  onCreateSession: () => void;
  onJoinSession: () => void;
}

export default function HomeView({
  name,
  email,
  sessionId,
  loading,
  error,
  onNameChange,
  onEmailChange,
  onSessionIdChange,
  onCreateSession,
  onJoinSession,
}: HomeViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planning Poker</h1>
        <p className="text-gray-600 mb-8">Estimate stories together with your team</p>

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
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Used for Gravatar avatar</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onCreateSession}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create New Session'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => onSessionIdChange(e.target.value)}
              placeholder="Enter session ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={onJoinSession}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg shadow-sm transition"
            >
              Join Existing Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

