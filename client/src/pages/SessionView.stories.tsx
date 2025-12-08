import type { Meta, StoryObj } from '@storybook/react';
import SessionView from './SessionView';
import { SessionData } from '../types';
import { UserData } from '../utils/storage';

const meta = {
  title: 'Pages/Session',
  component: SessionView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SessionView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock session data
const createMockSession = (sessionId: string, userId: string): SessionData => ({
  id: sessionId,
  users: {
    [userId]: {
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
    'user-3': {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      color: '#F59E0B',
      joinedAt: Date.now() - 20000,
    },
  },
  choices: {
    [userId]: '2',
    'user-2': '3',
  },
  revealed: false,
  createdAt: Date.now(),
});

const mockUserData: UserData = {
  name: 'John Doe',
  email: 'john@example.com',
  userId: 'user-1',
  color: '#3B82F6',
};

// Mock handlers
const mockHandlers = {
  onJoinSession: (name: string, email: string) => {
    console.log('Join session:', name, email);
  },
  onEditProfileClick: () => {
    console.log('Edit profile clicked');
  },
  onSaveProfile: (name: string, email: string, color?: string) => {
    console.log('Save profile:', name, email, color);
  },
  onMakeChoice: (choice: string) => {
    console.log('Make choice:', choice);
  },
  onReveal: () => {
    console.log('Reveal choices');
  },
  onReset: () => {
    console.log('Reset session');
  },
  onShare: () => {
    console.log('Share session');
  },
  onDelete: () => {
    console.log('Delete session');
  },
  onNewSession: () => {
    console.log('New session');
  },
  onEndSession: () => {
    console.log('End session');
  },
  onEndSessionAndCreateNew: () => {
    console.log('End session and create new');
  },
  onKeepSessionAndCreateNew: () => {
    console.log('Keep session and create new');
  },
  onCreateNewSessionAfterEnd: async () => {
    console.log('Create new session after end');
  },
  onToggleParticipantsCollapse: () => {
    console.log('Toggle participants collapse');
  },
  onCloseDeleteConfirm: () => {
    console.log('Close delete confirm');
  },
  onCloseEndSessionConfirm: () => {
    console.log('Close end session confirm');
  },
  onCloseEditProfileModal: () => {
    console.log('Close edit profile modal');
  },
  onCloseToast: () => {
    console.log('Close toast');
  },
  onGoHome: () => {
    console.log('Go home');
  },
};

export const Default: Story = {
  args: {
    session: createMockSession('session-123', 'user-1'),
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const WithError: Story = {
  args: {
    session: null,
    userData: null,
    sessionId: 'session-123',
    loading: false,
    error: 'Session not found',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const Loading: Story = {
  args: {
    session: null,
    userData: null,
    sessionId: 'session-123',
    loading: true,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const JoinForm: Story = {
  args: {
    session: null,
    userData: null,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: true,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    initialName: '',
    initialEmail: '',
    ...mockHandlers,
  },
};

export const WithChoices: Story = {
  args: {
    session: createMockSession('session-123', 'user-1'),
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const Revealed: Story = {
  args: {
    session: {
      ...createMockSession('session-123', 'user-1'),
      revealed: true,
    },
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const SessionEnded: Story = {
  args: {
    session: createMockSession('session-123', 'user-1'),
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: true,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: false,
    showToast: false,
    ...mockHandlers,
  },
};

export const WithModals: Story = {
  args: {
    session: createMockSession('session-123', 'user-1'),
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: true,
    showEndSessionConfirm: false,
    showEditProfileModal: true,
    isParticipantsCollapsed: false,
    showToast: true,
    ...mockHandlers,
  },
};

export const CollapsedParticipants: Story = {
  args: {
    session: createMockSession('session-123', 'user-1'),
    userData: mockUserData,
    sessionId: 'session-123',
    loading: false,
    error: '',
    showJoinForm: false,
    sessionEnded: false,
    showDeleteConfirm: false,
    showEndSessionConfirm: false,
    showEditProfileModal: false,
    isParticipantsCollapsed: true,
    showToast: false,
    ...mockHandlers,
  },
};
