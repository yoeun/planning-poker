import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeView from './HomeView';

describe('HomeView', () => {
  const mockHandlers = {
    onNameChange: vi.fn(),
    onEmailChange: vi.fn(),
    onSessionIdChange: vi.fn(),
    onCreateSession: vi.fn(),
    onJoinSession: vi.fn(),
  };

  it('should render the form with all fields', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Planning Poker')).toBeInTheDocument();
    expect(screen.getByText('Estimate stories together with your team')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter session ID')).toBeInTheDocument();
    expect(screen.getByText('Create New Session')).toBeInTheDocument();
    expect(screen.getByText('Join Existing Session')).toBeInTheDocument();
  });

  it('should display name value', () => {
    render(
      <HomeView
        name="John Doe"
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    const nameInput = screen.getByLabelText(/Your Name/) as HTMLInputElement;
    expect(nameInput.value).toBe('John Doe');
  });

  it('should display email value', () => {
    render(
      <HomeView
        name=""
        email="john@example.com"
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    const emailInput = screen.getByLabelText(/Email/) as HTMLInputElement;
    expect(emailInput.value).toBe('john@example.com');
  });

  it('should display session ID value', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId="session-123"
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    const sessionIdInput = screen.getByPlaceholderText('Enter session ID') as HTMLInputElement;
    expect(sessionIdInput.value).toBe('session-123');
  });

  it('should call onNameChange when name input changes', async () => {
    const user = userEvent.setup();
    const onNameChange = vi.fn();

    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
        onNameChange={onNameChange}
      />
    );

    const nameInput = screen.getByLabelText(/Your Name/);
    await user.type(nameInput, 'John');

    expect(onNameChange).toHaveBeenCalledWith('J');
    expect(onNameChange).toHaveBeenCalledWith('Jo');
    expect(onNameChange).toHaveBeenCalledWith('Joh');
    expect(onNameChange).toHaveBeenCalledWith('John');
  });

  it('should call onEmailChange when email input changes', async () => {
    const user = userEvent.setup();
    const onEmailChange = vi.fn();

    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
        onEmailChange={onEmailChange}
      />
    );

    const emailInput = screen.getByLabelText(/Email/);
    await user.type(emailInput, 'john@example.com');

    expect(onEmailChange).toHaveBeenCalled();
  });

  it('should call onSessionIdChange when session ID input changes', async () => {
    const user = userEvent.setup();
    const onSessionIdChange = vi.fn();

    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
        onSessionIdChange={onSessionIdChange}
      />
    );

    const sessionIdInput = screen.getByPlaceholderText('Enter session ID');
    await user.type(sessionIdInput, 'session-123');

    expect(onSessionIdChange).toHaveBeenCalled();
  });

  it('should call onCreateSession when Create New Session button is clicked', async () => {
    const user = userEvent.setup();
    const onCreateSession = vi.fn();

    render(
      <HomeView
        name="John Doe"
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
        onCreateSession={onCreateSession}
      />
    );

    const createButton = screen.getByText('Create New Session');
    await user.click(createButton);

    expect(onCreateSession).toHaveBeenCalledTimes(1);
  });

  it('should call onJoinSession when Join Existing Session button is clicked', async () => {
    const user = userEvent.setup();
    const onJoinSession = vi.fn();

    render(
      <HomeView
        name="John Doe"
        email=""
        sessionId="session-123"
        loading={false}
        error=""
        {...mockHandlers}
        onJoinSession={onJoinSession}
      />
    );

    const joinButton = screen.getByText('Join Existing Session');
    await user.click(joinButton);

    expect(onJoinSession).toHaveBeenCalledTimes(1);
  });

  it('should disable Create New Session button when loading', () => {
    render(
      <HomeView
        name="John Doe"
        email=""
        sessionId=""
        loading={true}
        error=""
        {...mockHandlers}
      />
    );

    const createButton = screen.getByText('Creating...') as HTMLButtonElement;
    expect(createButton.disabled).toBe(true);
  });

  it('should show loading text on Create New Session button when loading', () => {
    render(
      <HomeView
        name="John Doe"
        email=""
        sessionId=""
        loading={true}
        error=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(screen.queryByText('Create New Session')).not.toBeInTheDocument();
  });

  it('should display error message when error is provided', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error="Failed to create session. Please try again."
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Failed to create session. Please try again.')).toBeInTheDocument();
  });

  it('should not display error message when error is empty', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show required indicator for name field', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    const nameLabel = screen.getByText(/Your Name/);
    expect(nameLabel).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should show email helper text', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Used for Gravatar avatar')).toBeInTheDocument();
  });

  it('should show divider between create and join sections', () => {
    render(
      <HomeView
        name=""
        email=""
        sessionId=""
        loading={false}
        error=""
        {...mockHandlers}
      />
    );

    expect(screen.getByText('or')).toBeInTheDocument();
  });
});

