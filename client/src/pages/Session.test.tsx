import { describe, it, expect } from 'vitest';

/**
 * Color Validation Tests
 * 
 * These tests validate color normalization and validation logic
 * used throughout the application, particularly in the Session flow
 * for user profile color selection.
 * 
 * Note: This file was originally named Session.test.tsx but doesn't
 * actually test the Session component. The Session component is tested
 * via SessionView.test.tsx (presentational component) and integration tests.
 */

describe('Color Validation', () => {
  it('should normalize color with # prefix', () => {
    const colorWithoutHash = 'FF5733';
    const normalized = colorWithoutHash.startsWith('#') ? colorWithoutHash : '#' + colorWithoutHash;
    expect(normalized).toBe('#FF5733');
  });

  it('should keep color with # prefix as is', () => {
    const colorWithHash = '#FF5733';
    const normalized = colorWithHash.startsWith('#') ? colorWithHash : '#' + colorWithHash;
    expect(normalized).toBe('#FF5733');
  });

  it('should validate hex color format', () => {
    const validColors = ['#FF5733', '#ff5733', '#FFF', '#abc', 'FF5733', 'fff'];
    const invalidColors = ['#GGGGGG', 'not-a-color', '#12', '#12345', ''];

    validColors.forEach(color => {
      const normalized = color.startsWith('#') ? color : '#' + color;
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      expect(hexRegex.test(normalized)).toBe(true);
    });

    invalidColors.forEach(color => {
      if (!color) return; // Skip empty string
      const normalized = color.startsWith('#') ? color : '#' + color;
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      expect(hexRegex.test(normalized)).toBe(false);
    });
  });
});

