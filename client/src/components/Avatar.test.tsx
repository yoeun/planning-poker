import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

// Mock the gravatar utility
vi.mock('../utils/gravatar', () => ({
  getGravatarUrl: vi.fn(() => 'https://example.com/gravatar.jpg'),
}));

// Mock the initials utility
vi.mock('../utils/initials', () => ({
  getInitials: vi.fn((name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }),
}));

describe('Avatar', () => {
  it('should render initials when no email is provided', () => {
    render(
      <Avatar
        name="John Doe"
        email=""
        userId="user123"
      />
    );
    
    const avatar = screen.getByTitle('John Doe');
    expect(avatar).toBeInTheDocument();
    expect(avatar.textContent).toBe('JD');
  });

  it('should render initials when email is invalid', () => {
    render(
      <Avatar
        name="Jane Smith"
        email="   "
        userId="user456"
      />
    );
    
    const avatar = screen.getByTitle('Jane Smith');
    expect(avatar.textContent).toBe('JS');
  });

  it('should use custom color when provided', () => {
    const { container } = render(
      <Avatar
        name="Test User"
        email=""
        userId="user789"
        color="#FF5733"
      />
    );
    
    const avatar = container.querySelector('div[style*="background-color"]');
    expect(avatar).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('should generate color from userId when no custom color is provided', () => {
    const { container } = render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
      />
    );
    
    const avatar = container.querySelector('div[style*="background-color"]');
    expect(avatar).toHaveStyle({ backgroundColor: expect.stringMatching(/^hsl\(/) });
  });

  it('should apply custom size', () => {
    const { container } = render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
        size={60}
      />
    );
    
    const avatar = container.querySelector('div[style*="width"]');
    expect(avatar).toHaveStyle({ width: '60px', height: '60px' });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
        className="custom-class"
      />
    );
    
    const avatar = container.querySelector('.custom-class');
    expect(avatar).toBeInTheDocument();
  });

  it('should apply border class', () => {
    const { container } = render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
        borderClass="border-blue-500"
      />
    );
    
    const avatar = container.querySelector('.border-blue-500');
    expect(avatar).toBeInTheDocument();
  });

  it('should use custom title when provided', () => {
    render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
        title="Custom Title"
      />
    );
    
    expect(screen.getByTitle('Custom Title')).toBeInTheDocument();
  });

  it('should fall back to name as title when no title is provided', () => {
    render(
      <Avatar
        name="Test User"
        email=""
        userId="user123"
      />
    );
    
    expect(screen.getByTitle('Test User')).toBeInTheDocument();
  });

  it('should handle single name correctly', () => {
    render(
      <Avatar
        name="John"
        email=""
        userId="user123"
      />
    );
    
    const avatar = screen.getByTitle('John');
    expect(avatar.textContent).toBe('J');
  });
});

