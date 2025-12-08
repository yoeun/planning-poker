import type { Meta, StoryObj } from '@storybook/react';
import JoinSessionForm from './JoinSessionForm';

const meta = {
  title: 'Components/JoinSessionForm',
  component: JoinSessionForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof JoinSessionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onJoin: (name, email) => {
      alert(`Joining session as ${name} (${email})`);
    },
    error: undefined,
    loading: false,
    initialName: '',
    initialEmail: '',
  },
};

export const WithInitialValues: Story = {
  args: {
    onJoin: (name, email) => {
      alert(`Joining session as ${name} (${email})`);
    },
    error: undefined,
    loading: false,
    initialName: 'John Doe',
    initialEmail: 'john.doe@example.com',
  },
};

export const Loading: Story = {
  args: {
    onJoin: (name, email) => {
      alert(`Joining session as ${name} (${email})`);
    },
    error: undefined,
    loading: true,
    initialName: 'John Doe',
    initialEmail: 'john.doe@example.com',
  },
};

export const WithError: Story = {
  args: {
    onJoin: (name, email) => {
      alert(`Joining session as ${name} (${email})`);
    },
    error: 'Session not found. Please check the session ID and try again.',
    loading: false,
    initialName: 'John Doe',
    initialEmail: 'john.doe@example.com',
  },
};

