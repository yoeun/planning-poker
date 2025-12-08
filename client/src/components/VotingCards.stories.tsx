import type { Meta, StoryObj } from '@storybook/react';
import VotingCards from './VotingCards';
import { User } from '../types';

const meta = {
  title: 'Components/VotingCards',
  component: VotingCards,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof VotingCards>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockUser = (name: string, email: string, userId: string, color?: string): User => ({
  name,
  email,
  color,
  joinedAt: Date.now(),
});

const pointOptions = ['0.5', '1', '1.5', '2', '2.5', '3+', '?'];

export const Default: Story = {
  args: {
    choices: {},
    currentUserId: 'user-1',
    currentUserChoice: undefined,
    allChosen: false,
    totalUsers: 3,
    onMakeChoice: (choice) => {
      alert(`Selected: ${choice}`);
    },
    onReveal: () => {
      alert('Revealing choices...');
    },
    onReset: undefined,
    pointOptions,
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    revealed: false,
  },
};

export const WithChoice: Story = {
  args: {
    choices: {
      'user-1': '2',
    },
    currentUserId: 'user-1',
    currentUserChoice: '2',
    allChosen: false,
    totalUsers: 3,
    onMakeChoice: (choice) => {
      alert(`Selected: ${choice}`);
    },
    onReveal: () => {
      alert('Revealing choices...');
    },
    onReset: undefined,
    pointOptions,
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    revealed: false,
  },
};

export const AllChosen: Story = {
  args: {
    choices: {
      'user-1': '2',
      'user-2': '1.5',
      'user-3': '2',
    },
    currentUserId: 'user-1',
    currentUserChoice: '2',
    allChosen: true,
    totalUsers: 3,
    onMakeChoice: (choice) => {
      alert(`Selected: ${choice}`);
    },
    onReveal: () => {
      alert('Revealing choices...');
    },
    onReset: undefined,
    pointOptions,
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    revealed: false,
  },
};

export const Revealed: Story = {
  args: {
    choices: {
      'user-1': '2',
      'user-2': '2',
      'user-3': '1.5',
    },
    currentUserId: 'user-1',
    currentUserChoice: '2',
    allChosen: true,
    totalUsers: 3,
    onMakeChoice: (choice) => {
      alert(`Selected: ${choice}`);
    },
    onReveal: () => {
      alert('Revealing choices...');
    },
    onReset: () => {
      alert('Resetting session...');
    },
    pointOptions,
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    revealed: true,
  },
};

export const RevealedWithMajority: Story = {
  args: {
    choices: {
      'user-1': '2',
      'user-2': '2',
      'user-3': '2',
      'user-4': '1.5',
      'user-5': '1',
    },
    currentUserId: 'user-1',
    currentUserChoice: '2',
    allChosen: true,
    totalUsers: 5,
    onMakeChoice: (choice) => {
      alert(`Selected: ${choice}`);
    },
    onReveal: () => {
      alert('Revealing choices...');
    },
    onReset: () => {
      alert('Resetting session...');
    },
    pointOptions,
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
      'user-4': createMockUser('Alice Johnson', 'alice@example.com', 'user-4', '#F59E0B'),
      'user-5': createMockUser('Charlie Brown', 'charlie@example.com', 'user-5', '#8B5CF6'),
    },
    revealed: true,
  },
};

