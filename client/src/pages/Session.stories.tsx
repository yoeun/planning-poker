import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Session from './Session';

const meta = {
  title: 'Pages/Session',
  component: Session,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Session>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithError: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/session/session-123']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {},
};

export const WithUserData: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/session/session-123']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {},
  render: () => {
    // Mock localStorage to simulate user data
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      userId: 'user-1',
      color: '#3B82F6',
    };
    localStorage.setItem('planningPokerUser', JSON.stringify(mockUserData));
    
    return <Session />;
  },
};

export const JoinForm: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/session/session-123']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {},
  render: () => {
    // Clear localStorage to trigger join form
    localStorage.removeItem('planningPokerUser');
    
    return <Session />;
  },
};

