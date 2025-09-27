
export interface User {
  telegramId: string;
  username: string;
  profilePhotoUrl: string;
  flapBalance: number;
  tonBalance: number;
  friends: Friend[];
}

export interface Friend {
  id: string;
  username:string;
  bonus: number;
}

export type Page = 'FLAPPY' | 'BANK' | 'FRIENDS';
