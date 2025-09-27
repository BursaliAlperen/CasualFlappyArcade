import { useState, useCallback, useEffect } from 'react';
import type { User } from '../types';

// Helper to handle API requests
async function apiRequest<T>(endpoint: string, body: object): Promise<T> {
  // In a real production app, the base URL would come from an environment variable
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'An API error occurred.');
  }
  return response.json();
}

const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        // Safely access Telegram Web App data
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

        // Fallback for development outside of Telegram
        const telegram_id = tgUser?.id?.toString() ?? '123456789_dev';
        const username = tgUser?.username ?? 'DevUser';
        const profile_photo_url = tgUser?.photo_url ?? 'https://picsum.photos/100';

        const userData = await apiRequest<User>('/user', {
          telegram_id,
          username,
          profile_photo: profile_photo_url,
        });

        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'Failed to load user data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  const addFlap = useCallback(async (amount: number) => {
    if (!user) return;
    try {
      console.log(`Adding ${amount} FLAP to balance.`);
      const updatedData = await apiRequest<{ flap_balance: number }>('/addFlap', {
        telegram_id: user.telegram_id,
        flap: amount,
      });
      setUser(prevUser => prevUser ? { ...prevUser, flap_balance: updatedData.flap_balance } : null);
    } catch (err) {
      console.error("Failed to add flap:", err);
      // Optionally show an error to the user via a toast notification
    }
  }, [user]);

  const swapFlapToTon = useCallback(async (flapAmount: number): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: "User not loaded." };

    try {
      const data = await apiRequest<{ flap_balance: number; ton_balance: number }>('/swap', {
        telegram_id: user.telegram_id,
        flap_amount: flapAmount,
      });
      setUser(prevUser => prevUser ? { ...prevUser, flap_balance: data.flap_balance, ton_balance: data.ton_balance } : null);
      return { success: true, message: `Successfully swapped ${flapAmount} FLAP!` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Swap failed.' };
    }
  }, [user]);

  const withdrawTon = useCallback(async (tonAmount: number, address: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: "User not loaded." };
    
    try {
      const data = await apiRequest<{ ton_balance: number }>('/withdraw', {
        telegram_id: user.telegram_id,
        ton_amount: tonAmount,
        address: address, // Pass address to backend
      });
      setUser(prevUser => prevUser ? { ...prevUser, ton_balance: data.ton_balance } : null);
      return { success: true, message: `Withdrawal of ${tonAmount} TON successful.` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Withdrawal failed.' };
    }
  }, [user]);

  const addFriend = useCallback(async (friendId: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: "User not loaded." };

    const trimmedId = friendId.trim();
    if (!trimmedId) {
        return { success: false, message: 'Friend Telegram ID cannot be empty.' };
    }
    if (trimmedId === user.telegram_id) {
        return { success: false, message: 'You cannot invite yourself.' };
    }

    try {
        const data = await apiRequest<{ flap_balance: number; friends: string[] }>('/invite', {
            telegram_id: user.telegram_id,
            friend_id: trimmedId,
        });
        setUser(prevUser => prevUser ? {...prevUser, friends: data.friends, flap_balance: data.flap_balance} : null);
        return { success: true, message: `Successfully invited friend!` };
    } catch (err: any) {
        return { success: false, message: err.message || `Failed to invite friend.` };
    }
  }, [user]);

  return { user, loading, error, addFlap, swapFlapToTon, withdrawTon, addFriend };
};

export default useUserData;