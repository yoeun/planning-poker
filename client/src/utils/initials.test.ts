import { describe, it, expect } from 'vitest';
import { getInitials } from './initials';

describe('getInitials', () => {
  it('should return "?" for empty string', () => {
    expect(getInitials('')).toBe('?');
  });

  it('should return "?" for whitespace-only string', () => {
    expect(getInitials('   ')).toBe('?');
  });

  it('should return first letter for single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('should return first and last initial for two names', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('should return first and last initial for multiple names', () => {
    expect(getInitials('John Michael Doe')).toBe('JD');
  });

  it('should handle names with extra spaces', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });

  it('should return uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('should handle non-Latin characters (single character)', () => {
    expect(getInitials('张')).toBe('张');
    expect(getInitials('山田')).toBe('山');
  });

  it('should handle mixed Latin and non-Latin names', () => {
    // First character is non-Latin, so it should return just that
    expect(getInitials('张John')).toBe('张');
  });
});

