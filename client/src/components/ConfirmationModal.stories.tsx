import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const meta = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '300px',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfirmationModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Open Modal
      </button>
      <ConfirmationModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          alert('Confirmed!');
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ConfirmationModalWrapper {...args} />,
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonStyle: 'default',
    showCloseButton: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const Danger: Story = {
  render: (args) => <ConfirmationModalWrapper {...args} />,
  args: {
    title: 'Delete Item?',
    message: 'This action cannot be undone. Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmButtonStyle: 'danger',
    showCloseButton: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const WithCloseButton: Story = {
  render: (args) => <ConfirmationModalWrapper {...args} />,
  args: {
    title: 'Confirm Action',
    message: 'This modal has a close button in the header.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonStyle: 'default',
    showCloseButton: true,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

export const CustomText: Story = {
  render: (args) => <ConfirmationModalWrapper {...args} />,
  args: {
    title: 'Save Changes?',
    message: 'You have unsaved changes. Do you want to save them before leaving?',
    confirmText: 'Save',
    cancelText: 'Discard',
    confirmButtonStyle: 'default',
    showCloseButton: false,
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
};

