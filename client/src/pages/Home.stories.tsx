import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

const meta = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {},
  render: () => {
    // This story demonstrates the error state
    // In a real scenario, you'd need to mock the API to trigger errors
    return <Home />;
  },
};

