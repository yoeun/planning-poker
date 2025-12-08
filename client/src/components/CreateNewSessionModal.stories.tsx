import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import CreateNewSessionModal from './CreateNewSessionModal';

const meta = {
  title: 'Components/CreateNewSessionModal',
  component: CreateNewSessionModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '400px',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateNewSessionModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const CreateNewSessionModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Open Modal
      </button>
      <CreateNewSessionModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEndSessionAndCreateNew={() => {
          alert('Ending session and creating new one...');
          setIsOpen(false);
        }}
        onKeepSessionAndCreateNew={() => {
          alert('Keeping current session and creating new one...');
          setIsOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <CreateNewSessionModalWrapper {...args} />,
  args: {
    isOpen: true,
    onClose: () => {},
    onEndSessionAndCreateNew: () => {},
    onKeepSessionAndCreateNew: () => {},
  },
};

