import type { Meta, StoryObj } from '@storybook/react';
import Avatar from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'number', min: 20, max: 200, step: 10 },
    },
    color: {
      control: 'color',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    userId: 'user-123',
    size: 40,
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Jane Smith',
    email: '',
    userId: 'user-456',
    size: 40,
  },
};

export const Large: Story = {
  args: {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    userId: 'user-789',
    size: 80,
  },
};

export const Small: Story = {
  args: {
    name: 'Bob Wilson',
    email: 'bob@example.com',
    userId: 'user-101',
    size: 24,
  },
};

export const CustomColor: Story = {
  args: {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    userId: 'user-202',
    size: 50,
    color: '#FF5733',
  },
};

export const WithBorder: Story = {
  args: {
    name: 'Diana Prince',
    email: 'diana@example.com',
    userId: 'user-303',
    size: 50,
    borderClass: 'border-blue-500',
    ringClass: 'ring-2 ring-blue-200',
  },
};

