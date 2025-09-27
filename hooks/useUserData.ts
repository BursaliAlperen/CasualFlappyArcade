import { useState, useCallback } from 'react';
import type { User, Friend } from '../types';
import { FLAP_TO_TON_CONVERSION_RATE } from '../constants';

// Mock initial user data. In a real app, this would be fetched from a backend.
const initialUser: User = {
  telegramId: '123456789',
  username: 'TelegramUser',
  profilePhotoUrl: 'https://picsum.photos/100',
  flapBalance: 10000,
  tonBalance: 0.1,
  friends: [
    { id: 'friend1', username: 'PlayerOne', bonus: 2 },
    { id: 'friend2', username: 'PlayerTwo', bonus: 2 },
  ],
};

const useUserData = () => {
  const [user, setUser] = useState<User>(initialUser);

  // Simulate API call to add FLAP points
  const addFlap = useCallback((amount: number) => {
    console.log(`Adding ${amount} FLAP to balance.`);
    setUser(prevUser => ({
      ...prevUser,
      flapBalance: prevUser.flapBalance + amount,
    }));
  }, []);
  
  // Simulate API call to swap FLAP for TON
  const swapFlapToTon = useCallback((flapAmount: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => { // Simulate network delay
        if (user.flapBalance < flapAmount) {
            resolve({ success: false, message: 'Insufficient FLAP balance.' });
            return;
        }

        const tonToReceive = flapAmount * FLAP_TO_TON_CONVERSION_RATE;

        setUser(prevUser => ({
          ...prevUser,
          flapBalance: prevUser.flapBalance - flapAmount,
          tonBalance: prevUser.tonBalance + tonToReceive,
        }));
        
        console.log(`Swapped ${flapAmount} FLAP for ${tonToReceive} TON.`);
        resolve({ success: true, message: `Successfully swapped ${flapAmount} FLAP!` });
      }, 500);
    });
  }, [user.flapBalance]);

  // Simulate API call for withdrawal
  const withdrawTon = useCallback((tonAmount: number): Promise<{success: boolean, message: string}> => {
     return new Promise((resolve) => {
        setTimeout(() => { // Simulate network delay
            if(user.tonBalance < tonAmount) {
                resolve({ success: false, message: 'Insufficient TON balance.'});
                return;
            }
             setUser(prevUser => ({
                ...prevUser,
                tonBalance: prevUser.tonBalance - tonAmount
            }));
            console.log(`Withdrew ${tonAmount} TON.`);
            resolve({ success: true, message: `Withdrawal of ${tonAmount} TON successful.`});
        }, 500);
     });
  }, [user.tonBalance]);

  const addFriend = useCallback((friendId: string): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trimmedId = friendId.trim();
        if (!trimmedId) {
            resolve({ success: false, message: 'Friend Telegram ID cannot be empty.' });
            return;
        }

        if (trimmedId === user.telegramId) {
            resolve({ success: false, message: 'You cannot invite yourself.' });
            return;
        }

        const friendExists = user.friends.some(f => f.id === trimmedId);
        if (friendExists) {
            resolve({ success: false, message: `Friend with ID ${trimmedId} has already been invited.` });
            return;
        }
        
        const newFriend: Friend = {
            id: trimmedId,
            // In a real app, you'd fetch the username. For simulation, we'll create a placeholder.
            username: `Friend#${trimmedId.slice(-4)}`, 
            bonus: 2 // The bonus is 2 flap per friend
        };

        setUser(prevUser => ({
            ...prevUser,
            friends: [...prevUser.friends, newFriend],
            flapBalance: prevUser.flapBalance + newFriend.bonus
        }));
        
        resolve({ success: true, message: `Successfully invited friend and earned ${newFriend.bonus} FLAP!` });
      }, 500);
    });
  }, [user.friends, user.telegramId]);

  return { user, addFlap, swapFlapToTon, withdrawTon, addFriend };
};

export default useUserData;