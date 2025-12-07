const STORAGE_KEY = 'planning-poker-user';

export interface UserData {
  name: string;
  email: string;
  userId: string;
  color?: string;
}

export function getUserData(): UserData | null {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveUserData(userData: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

