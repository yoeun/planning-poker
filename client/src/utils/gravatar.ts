import CryptoJS from 'crypto-js';

export function getGravatarUrl(email: string, size: number = 80): string {
  if (!email || !email.trim()) {
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=${size}`;
  }
  
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=${size}`;
}

