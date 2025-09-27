export interface User {
  telegram_id: string;
  username: string;
  profile_photo: string;
  flap_balance: number;
  ton_balance: number;
  friends: string[];
}

export type Page = 'FLAPPY' | 'BANK' | 'FRIENDS';