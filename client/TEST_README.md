# Testing Guide

This project uses [Vitest](https://vitest.dev/) with React Testing Library for testing. Vitest provides a Jest-compatible API, so if you're familiar with Jest, you'll feel right at home.

## Setup

First, install the testing dependencies:

```bash
cd client
npm install
```

## Running Tests

Run all tests once:
```bash
npm test
```

Run tests in watch mode (automatically re-runs on file changes):
```bash
npm run test:watch
```

Run tests with UI (interactive test runner):
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

Tests are located alongside their source files with the `.test.ts` or `.test.tsx` extension:

- `src/utils/storage.test.ts` - Tests for storage utilities
- `src/utils/initials.test.ts` - Tests for initials generation
- `src/components/Avatar.test.tsx` - Tests for Avatar component (including color support)
- `src/components/Modal.test.tsx` - Tests for Modal component
- `src/components/UserList.test.tsx` - Tests for UserList component
- `src/pages/Session.test.tsx` - Tests for Session page (including color selection)

## Writing Tests

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

## Test Coverage

The test suite covers:

- ✅ Storage utilities (getUserData, saveUserData, generateUserId)
- ✅ Avatar component with color support
- ✅ Modal component interactions
- ✅ UserList component with color display
- ✅ Initials generation (including non-Latin characters)
- ✅ Color validation and normalization

## Mocking

The tests use mocks for:
- Socket.io client
- API functions
- LocalStorage
- Utility functions (gravatar, initials)

## Best Practices

1. **Test user behavior, not implementation details** - Use React Testing Library's queries that mirror how users interact with your app
2. **Use `screen` queries** - Prefer `screen.getBy*` over `container.querySelector`
3. **Test accessibility** - Use `getByRole`, `getByLabelText`, etc.
4. **Clean up** - The setup file automatically cleans up after each test
5. **Mock external dependencies** - Mock socket.io, API calls, and browser APIs

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

