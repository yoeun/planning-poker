import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionView from './SessionView';
import { SessionData } from '../types';
import { UserData } from '../utils/storage';

// Mock child components
vi.mock('../components/UserList', () => ({
  default: ({ users, currentUserId, onEditProfile }: any) => (
    <div data-testid="user-list">
      <div>Current User: {currentUserId}</div>
      <button onClick={onEditProfile}>Edit Profile</button>
      {Object.entries(users).map(([id, user]: [string, any]) => (
        <div key={id}>{user.name}</div>
      ))}
    </div>
  ),
}));

vi.mock('../components/VotingCards', () => ({
  default: ({ onMakeChoice, onReveal, onReset }: any) => (
    <div data-testid="voting-cards">
      <button onClick={() => onMakeChoice('2')}>Choose 2</button>
      <button onClick={onReveal}>Reveal</button>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

vi.mock('../components/SessionHeader', () => ({
  default: ({ onShare, onNewSession, onEndSession }: any) => (
    <div data-testid="session-header">
      <button onClick={onShare}>Share</button>
      <button onClick={onNewSession}>New Session</button>
      <button onClick={onEndSession}>End Session</button>
    </div>
  ),
}));

vi.mock('../components/JoinSessionForm', () => ({
  default: ({ onJoin, error, loading }: any) => (
    <div data-testid="join-form">
      <button onClick={() => onJoin('John', 'john@example.com')}>Join</button>
      {error && <div>{error}</div>}
      {loading && <div>Loading...</div>}
    </div>
  ),
}));

vi.mock('../components/SessionEnded', () => ({
  default: ({ onCreateNewSession }: any) => (
    <div data-testid="session-ended">
      <button onClick={onCreateNewSession}>Create New Session</button>
    </div>
  ),
}));

vi.mock('../components/ConfirmationModal', () => ({
  default: ({ isOpen, onClose, onConfirm, title }: any) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <div>{title}</div>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

vi.mock('../components/CreateNewSessionModal', () => ({
  default: ({ isOpen, onClose, onEndSessionAndCreateNew, onKeepSessionAndCreateNew }: any) =>
    isOpen ? (
      <div data-testid="create-session-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onEndSessionAndCreateNew}>End and Create</button>
        <button onClick={onKeepSessionAndCreateNew}>Keep and Create</button>
      </div>
    ) : null,
}));

vi.mock('../components/EditProfileModal', () => ({
  default: ({ isOpen, onClose, onSave, initialName }: any) =>
    isOpen ? (
      <div data-testid="edit-profile-modal">
        <div>Editing: {initialName}</div>
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSave('New Name', 'new@example.com', '#FF0000')}>Save</button>
      </div>
    ) : null,
}));

vi.mock('../components/Toast', () => ({
  default: ({ isVisible, message, onClose }: any) =>
    isVisible ? (
      <div data-testid="toast">
        <div>{message}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('SessionView', () => {
  const mockSession: SessionData = {
    id: 'session-123',
    users: {
      'user-1': {
        name: 'John Doe',
        email: 'john@example.com',
        color: '#3B82F6',
        joinedAt: Date.now(),
      },
      'user-2': {
        name: 'Jane Smith',
        email: 'jane@example.com',
        color: '#10B981',
        joinedAt: Date.now() - 10000,
      },
    },
    choices: {
      'user-1': '2',
      'user-2': '3',
    },
    revealed: false,
    createdAt: Date.now(),
  };

  const mockUserData: UserData = {
    name: 'John Doe',
    email: 'john@example.com',
    userId: 'user-1',
    color: '#3B82F6',
  };

  const mockHandlers = {
    onJoinSession: vi.fn(),
    onEditProfileClick: vi.fn(),
    onSaveProfile: vi.fn(),
    onMakeChoice: vi.fn(),
    onReveal: vi.fn(),
    onReset: vi.fn(),
    onShare: vi.fn(),
    onDelete: vi.fn(),
    onNewSession: vi.fn(),
    onEndSession: vi.fn(),
    onEndSessionAndCreateNew: vi.fn(),
    onKeepSessionAndCreateNew: vi.fn(),
    onCreateNewSessionAfterEnd: vi.fn(),
    onToggleParticipantsCollapse: vi.fn(),
    onCloseDeleteConfirm: vi.fn(),
    onCloseEndSessionConfirm: vi.fn(),
    onCloseEditProfileModal: vi.fn(),
    onCloseToast: vi.fn(),
    onGoHome: vi.fn(),
  };

  it('should render join form when showJoinForm is true', () => {
    render(
      <SessionView
        session={null}
        userData={null}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={true}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('join-form')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(
      <SessionView
        session={null}
        userData={null}
        sessionId="session-123"
        loading={true}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(
      <SessionView
        session={null}
        userData={null}
        sessionId="session-123"
        loading={false}
        error="Session not found"
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Session not found')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('should render session ended state', () => {
    render(
      <SessionView
        session={mockSession}
        userData={mockUserData}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={true}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('session-ended')).toBeInTheDocument();
  });

  it('should render full session view', () => {
    render(
      <SessionView
        session={mockSession}
        userData={mockUserData}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('session-header')).toBeInTheDocument();
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
    expect(screen.getByTestId('voting-cards')).toBeInTheDocument();
  });

  it('should call onGoHome when Go Home button is clicked', async () => {
    const user = userEvent.setup();
    const onGoHome = vi.fn();

    render(
      <SessionView
        session={null}
        userData={null}
        sessionId="session-123"
        loading={false}
        error="Session not found"
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
        onGoHome={onGoHome}
      />
    );

    const goHomeButton = screen.getByText('Go Home');
    await user.click(goHomeButton);

    expect(onGoHome).toHaveBeenCalledTimes(1);
  });

  it('should call handlers when buttons are clicked', async () => {
    const user = userEvent.setup();

    render(
      <SessionView
        session={mockSession}
        userData={mockUserData}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    await user.click(screen.getByText('Edit Profile'));
    expect(mockHandlers.onEditProfileClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Choose 2'));
    expect(mockHandlers.onMakeChoice).toHaveBeenCalledWith('2');

    await user.click(screen.getByText('Reveal'));
    expect(mockHandlers.onReveal).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Reset'));
    expect(mockHandlers.onReset).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Share'));
    expect(mockHandlers.onShare).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('End Session'));
    expect(mockHandlers.onEndSession).toHaveBeenCalledTimes(1);
  });

  it('should show modals when flags are true', () => {
    render(
      <SessionView
        session={mockSession}
        userData={mockUserData}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={true}
        showEndSessionConfirm={true}
        showEditProfileModal={true}
        isParticipantsCollapsed={false}
        showToast={true}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    expect(screen.getByTestId('create-session-modal')).toBeInTheDocument();
    expect(screen.getByTestId('edit-profile-modal')).toBeInTheDocument();
    expect(screen.getByTestId('toast')).toBeInTheDocument();
  });

  it('should call modal handlers', async () => {
    const user = userEvent.setup();

    render(
      <SessionView
        session={mockSession}
        userData={mockUserData}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={true}
        showEndSessionConfirm={true}
        showEditProfileModal={true}
        isParticipantsCollapsed={false}
        showToast={true}
        initialName="John"
        initialEmail=""
        {...mockHandlers}
      />
    );

    await user.click(screen.getByText('Confirm'));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Cancel'));
    expect(mockHandlers.onCloseDeleteConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('End and Create'));
    expect(mockHandlers.onEndSessionAndCreateNew).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Keep and Create'));
    expect(mockHandlers.onKeepSessionAndCreateNew).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Save'));
    expect(mockHandlers.onSaveProfile).toHaveBeenCalledWith('New Name', 'new@example.com', '#FF0000');

    await user.click(screen.getByText('Close'));
    expect(mockHandlers.onCloseToast).toHaveBeenCalledTimes(1);
  });

  it('should return null when session and userData are not provided', () => {
    const { container } = render(
      <SessionView
        session={null}
        userData={null}
        sessionId="session-123"
        loading={false}
        error=""
        showJoinForm={false}
        sessionEnded={false}
        showDeleteConfirm={false}
        showEndSessionConfirm={false}
        showEditProfileModal={false}
        isParticipantsCollapsed={false}
        showToast={false}
        initialName=""
        initialEmail=""
        {...mockHandlers}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

