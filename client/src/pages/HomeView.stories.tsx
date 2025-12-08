import type { Meta, StoryObj } from '@storybook/react';
import HomeView from './HomeView';

const meta = {
  title: 'Pages/Home',
  component: HomeView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock handlers
const mockHandlers = {
  onNameChange: (name: string) => {
    console.log('Name changed:', name);
  },
  onEmailChange: (email: string) => {
    console.log('Email changed:', email);
  },
  onSessionIdChange: (sessionId: string) => {
    console.log('Session ID changed:', sessionId);
  },
  onCreateSession: () => {
    console.log('Create session');
  },
  onJoinSession: () => {
    console.log('Join session');
  },
};

export const Default: Story = {
  args: {
    name: '',
    email: '',
    sessionId: '',
    loading: false,
    error: '',
    ...mockHandlers,
  },
};

export const WithName: Story = {
  args: {
    name: 'John Doe',
    email: '',
    sessionId: '',
    loading: false,
    error: '',
    ...mockHandlers,
  },
};

export const WithEmail: Story = {
  args: {
    name: 'John Doe',
    email: 'john@example.com',
    sessionId: '',
    loading: false,
    error: '',
    ...mockHandlers,
  },
};

export const WithSessionId: Story = {
  args: {
    name: 'John Doe',
    email: 'john@example.com',
    sessionId: 'session-123',
    loading: false,
    error: '',
    ...mockHandlers,
  },
};

export const Loading: Story = {
  args: {
    name: 'John Doe',
    email: 'john@example.com',
    sessionId: '',
    loading: true,
    error: '',
    ...mockHandlers,
  },
};

export const WithError: Story = {
  args: {
    name: 'John Doe',
    email: 'john@example.com',
    sessionId: '',
    loading: false,
    error: 'Failed to create session. Please try again.',
    ...mockHandlers,
  },
};

export const ValidationError: Story = {
  args: {
    name: '',
    email: '',
    sessionId: '',
    loading: false,
    error: 'Please enter your name',
    ...mockHandlers,
  },
};
