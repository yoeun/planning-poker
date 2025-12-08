import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';

const meta = {
  title: 'Components/EditProfileModal',
  component: EditProfileModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '700px',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditProfileModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const EditProfileModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Open Modal
      </button>
      <EditProfileModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(name, email, color) => {
          alert(`Saved: ${name}, ${email}, ${color || 'no color'}`);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <EditProfileModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    initialName: 'John Doe',
    initialEmail: 'john.doe@example.com',
    initialColor: '',
    error: undefined,
  },
};

export const WithColor: Story = {
  render: (args) => <EditProfileModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    initialName: 'Jane Smith',
    initialEmail: 'jane@example.com',
    initialColor: '#3B82F6',
    error: undefined,
  },
};

export const WithError: Story = {
  render: (args) => <EditProfileModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    initialName: 'Bob Wilson',
    initialEmail: 'bob@example.com',
    initialColor: '',
    error: 'Failed to save profile. Please try again.',
  },
};

export const Empty: Story = {
  render: (args) => <EditProfileModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    onSave: () => {},
    initialName: '',
    initialEmail: '',
    initialColor: '',
    error: undefined,
  },
};

