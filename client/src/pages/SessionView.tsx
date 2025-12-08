import { SessionData } from '../types';
import { UserData } from '../utils/storage';
import UserList from '../components/UserList';
import VotingCards from '../components/VotingCards';
import ConfirmationModal from '../components/ConfirmationModal';
import CreateNewSessionModal from '../components/CreateNewSessionModal';
import EditProfileModal from '../components/EditProfileModal';
import JoinSessionForm from '../components/JoinSessionForm';
import SessionEnded from '../components/SessionEnded';
import SessionHeader from '../components/SessionHeader';
import Toast from '../components/Toast';

const POINT_OPTIONS = ['0.5', '1', '1.5', '2', '2.5', '3+', '?'];

export interface SessionViewProps {
  // Data
  session: SessionData | null;
  userData: UserData | null;
  sessionId: string;
  
  // State
  loading: boolean;
  error: string;
  showJoinForm: boolean;
  sessionEnded: boolean;
  showDeleteConfirm: boolean;
  showEndSessionConfirm: boolean;
  showEditProfileModal: boolean;
  isParticipantsCollapsed: boolean;
  showToast: boolean;
  
  // Callbacks
  onJoinSession: (name: string, email: string) => void;
  onEditProfileClick: () => void;
  onSaveProfile: (name: string, email: string, color?: string) => void;
  onMakeChoice: (choice: string) => void;
  onReveal: () => void;
  onReset: () => void;
  onShare: () => void;
  onDelete: () => void;
  onNewSession: (e: React.MouseEvent<HTMLElement>) => void;
  onEndSession: () => void;
  onEndSessionAndCreateNew: () => void;
  onKeepSessionAndCreateNew: () => void;
  onCreateNewSessionAfterEnd: () => void;
  onToggleParticipantsCollapse: () => void;
  onCloseDeleteConfirm: () => void;
  onCloseEndSessionConfirm: () => void;
  onCloseEditProfileModal: () => void;
  onCloseToast: () => void;
  onGoHome: () => void;
  
  // Initial values for join form
  initialName?: string;
  initialEmail?: string;
}

export default function SessionView({
  session,
  userData,
  sessionId,
  loading,
  error,
  showJoinForm,
  sessionEnded,
  showDeleteConfirm,
  showEndSessionConfirm,
  showEditProfileModal,
  isParticipantsCollapsed,
  showToast,
  onJoinSession,
  onEditProfileClick,
  onSaveProfile,
  onMakeChoice,
  onReveal,
  onReset,
  onShare,
  onDelete,
  onNewSession,
  onEndSession,
  onEndSessionAndCreateNew,
  onKeepSessionAndCreateNew,
  onCreateNewSessionAfterEnd,
  onToggleParticipantsCollapse,
  onCloseDeleteConfirm,
  onCloseEndSessionConfirm,
  onCloseEditProfileModal,
  onCloseToast,
  onGoHome,
  initialName = '',
  initialEmail = '',
}: SessionViewProps) {
  // Show join form
  if (showJoinForm) {
    return (
      <JoinSessionForm
        onJoin={onJoinSession}
        error={error}
        loading={loading}
        initialName={initialName}
        initialEmail={initialEmail}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading session...</div>
      </div>
    );
  }

  // Show error state
  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Return null if no session or user data
  if (!session || !userData) return null;

  // Show session ended message if session was deleted
  if (sessionEnded) {
    return (
      <SessionEnded
        onCreateNewSession={onCreateNewSessionAfterEnd}
        error={error}
      />
    );
  }

  const currentUserChoice = session.choices[userData.userId];
  const allUsers = Object.keys(session.users);
  const allChosen = allUsers.every(uid => session.choices[uid] !== undefined);

  return (
    <div className="min-h-screen p-4 pb-8">
      <div className="max-w-6xl mx-auto">
        <SessionHeader
          sessionId={sessionId}
          onReset={onReset}
          onShare={onShare}
          onNewSession={onNewSession}
          onEndSession={onEndSession}
        />

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Voting Area */}
          <div className="flex-1">
            <VotingCards
              choices={session.choices}
              currentUserId={userData.userId}
              currentUserChoice={currentUserChoice}
              allChosen={allChosen}
              totalUsers={allUsers.length}
              onMakeChoice={onMakeChoice}
              onReveal={onReveal}
              onReset={onReset}
              pointOptions={POINT_OPTIONS}
              users={session.users}
              revealed={session.revealed}
            />
          </div>

          {/* Participants */}
          <div className={`md:flex-shrink-0 transition-all ${isParticipantsCollapsed ? 'md:w-auto' : 'md:w-80'}`}>
            <UserList
              users={session.users}
              currentUserId={userData.userId}
              onEditProfile={onEditProfileClick}
              isCollapsed={isParticipantsCollapsed}
              onToggleCollapse={onToggleParticipantsCollapse}
              choices={session.choices}
              allChosen={allChosen}
              revealed={session.revealed}
            />
          </div>
        </div>
      </div>

      {/* End Session Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={onCloseDeleteConfirm}
        onConfirm={onDelete}
        title="End Session?"
        message="This will permanently delete the session. All users will be disconnected."
        confirmText="End"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />

      {/* End Session and Create New Confirmation Modal */}
      <CreateNewSessionModal
        isOpen={showEndSessionConfirm}
        onClose={onCloseEndSessionConfirm}
        onEndSessionAndCreateNew={onEndSessionAndCreateNew}
        onKeepSessionAndCreateNew={onKeepSessionAndCreateNew}
      />

      {/* Edit Profile Modal */}
      {userData && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={onCloseEditProfileModal}
          initialName={userData.name}
          initialEmail={userData.email}
          initialColor={userData.color}
          onSave={onSaveProfile}
          error={error}
        />
      )}

      {/* Toast Notification */}
      <Toast
        message="URL copied to clipboard!"
        isVisible={showToast}
        onClose={onCloseToast}
      />
    </div>
  );
}

