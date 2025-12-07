import { describe, it, expect, beforeEach } from 'vitest';
import { getUserData, saveUserData, generateUserId, UserData } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('getUserData', () => {
    it('should return null when no user data exists', () => {
      expect(getUserData()).toBeNull();
    });

    it('should return parsed user data when it exists', () => {
      const userData: UserData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: 'user123',
      };
      localStorage.setItem('planning-poker-user', JSON.stringify(userData));
      
      expect(getUserData()).toEqual(userData);
    });

    it('should return user data with color when it exists', () => {
      const userData: UserData = {
        name: 'John Doe',
        email: 'john@example.com',
        userId: 'user123',
        color: '#FF5733',
      };
      localStorage.setItem('planning-poker-user', JSON.stringify(userData));
      
      const result = getUserData();
      expect(result).toEqual(userData);
      expect(result?.color).toBe('#FF5733');
    });

    it('should return null when localStorage contains invalid JSON', () => {
      localStorage.setItem('planning-poker-user', 'invalid json');
      expect(getUserData()).toBeNull();
    });
  });

  describe('saveUserData', () => {
    it('should save user data to localStorage', () => {
      const userData: UserData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        userId: 'user456',
      };
      
      saveUserData(userData);
      
      const saved = localStorage.getItem('planning-poker-user');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(userData);
    });

    it('should save user data with color to localStorage', () => {
      const userData: UserData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        userId: 'user456',
        color: '#3B82F6',
      };
      
      saveUserData(userData);
      
      const saved = localStorage.getItem('planning-poker-user');
      const parsed = JSON.parse(saved!);
      expect(parsed.color).toBe('#3B82F6');
    });

    it('should overwrite existing user data', () => {
      const initialData: UserData = {
        name: 'Old Name',
        email: 'old@example.com',
        userId: 'user789',
      };
      saveUserData(initialData);
      
      const newData: UserData = {
        name: 'New Name',
        email: 'new@example.com',
        userId: 'user789',
        color: '#10B981',
      };
      saveUserData(newData);
      
      const saved = getUserData();
      expect(saved?.name).toBe('New Name');
      expect(saved?.email).toBe('new@example.com');
      expect(saved?.color).toBe('#10B981');
    });
  });

  describe('generateUserId', () => {
    it('should generate a unique user ID', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with the correct format', () => {
      const id = generateUserId();
      expect(id).toMatch(/^user_\d+_[a-z0-9]+$/);
    });
  });
});

