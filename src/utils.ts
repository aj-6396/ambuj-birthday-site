import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const RANDOM_WISHES = [
  "Hope your WiFi is always fast and your bugs always small!",
  "May your code run perfectly and your coffee never run out.",
  "Wishing you success, happiness, and zero error messages.",
  "May your life be as organized as a well-commented codebase.",
  "Happy Birthday! May your git push always be successful on the first try.",
  "Wishing you a year full of high-performance and low-latency joy!",
  "May your happiness scale horizontally and your troubles be O(1).",
];

export const BALLOON_MESSAGES = [
  "Make a birthday wish 🎂",
  "Hope Ambuj has an amazing year!",
  "Stay awesome! 🚀",
  "Level up! 🎮",
  "Party time! 🥳",
  "You're a legend! 🏆",
];
