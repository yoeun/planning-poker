import type { Meta, StoryObj } from '@storybook/react';
import UserList from './UserList';
import { User } from '../types';

const meta = {
  title: 'Components/UserList',
  component: UserList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserList>;

export default meta;
type Story = StoryObj<typeof meta>;

const createMockUser = (name: string, email: string, userId: string, color?: string): User => ({
  name,
  email,
  color,
  joinedAt: Date.now(),
});

export const Default: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: false,
    onToggleCollapse: undefined,
    choices: {},
    allChosen: false,
    revealed: false,
  },
};

export const WithVoting: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: false,
    onToggleCollapse: undefined,
    choices: {
      'user-1': '2',
      'user-2': '1.5',
    },
    allChosen: false,
    revealed: false,
  },
};

export const AllChosen: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: false,
    onToggleCollapse: undefined,
    choices: {
      'user-1': '2',
      'user-2': '1.5',
      'user-3': '2',
    },
    allChosen: true,
    revealed: false,
  },
};

export const Revealed: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: false,
    onToggleCollapse: undefined,
    choices: {
      'user-1': '2',
      'user-2': '1.5',
      'user-3': '2',
    },
    allChosen: true,
    revealed: true,
  },
};

export const Collapsed: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: true,
    onToggleCollapse: undefined,
    choices: {},
    allChosen: false,
    revealed: false,
  },
};

export const ManyUsers: Story = {
  args: {
    users: {
      'user-1': createMockUser('John Doe', 'john@example.com', 'user-1', '#3B82F6'),
      'user-2': createMockUser('Jane Smith', 'jane@example.com', 'user-2', '#EF4444'),
      'user-3': createMockUser('Bob Wilson', 'bob@example.com', 'user-3', '#10B981'),
      'user-4': createMockUser('Alice Johnson', 'alice@example.com', 'user-4', '#F59E0B'),
      'user-5': createMockUser('Charlie Brown', 'charlie@example.com', 'user-5', '#8B5CF6'),
      'user-6': createMockUser('Diana Prince', 'diana@example.com', 'user-6', '#EC4899'),
    },
    currentUserId: 'user-1',
    onEditProfile: () => {
      alert('Edit profile clicked');
    },
    isCollapsed: false,
    onToggleCollapse: undefined,
    choices: {},
    allChosen: false,
    revealed: false,
  },
};

