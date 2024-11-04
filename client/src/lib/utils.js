import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generatePassword(options) {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnpqrstuvwxyz';
  const numberChars = '23456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let chars = '';
  if (options.uppercase) chars += options.excludeSimilar ? uppercaseChars : uppercaseChars + 'IO';
  if (options.lowercase) chars += options.excludeSimilar ? lowercaseChars : lowercaseChars + 'il';
  if (options.numbers) chars += options.excludeSimilar ? numberChars : numberChars + '10';
  if (options.special) chars += specialChars;
  
  if (chars.length === 0) chars = lowercaseChars;
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

export function calculatePasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 12) strength += 2;
  else if (password.length >= 8) strength += 1;
  
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 5);
}