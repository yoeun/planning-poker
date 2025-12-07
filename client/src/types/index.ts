/**
 * User interface for session participants
 */
export interface User {
  name: string;
  email: string;
  color?: string;
  joinedAt: number;
}

/**
 * Session data structure
 */
export interface SessionData {
  id: string;
  users: Record<string, User>;
  choices: Record<string, string>;
  revealed: boolean;
  createdAt: number;
}

