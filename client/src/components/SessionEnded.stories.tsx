import type { Meta, StoryObj } from '@storybook/react';
import SessionEnded from './SessionEnded';

const meta = {
  title: 'Components/SessionEnded',
  component: SessionEnded,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SessionEnded>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreateNewSession: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('New session created!');
    },
    error: undefined,
  },
};

export const WithError: Story = {
  args: {
    onCreateNewSession: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error('Failed to create session');
    },
    error: undefined,
  },
};

export const WithExternalError: Story = {
  args: {
    onCreateNewSession: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('New session created!');
    },
    error: 'Failed to create new session. Please try again.',
  },
};

