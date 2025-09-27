import React, { useState, useCallback } from 'react';
import type { User, Friend } from '../types';
import { SpinnerIcon, CopyIcon } from './icons/Icons';

interface FriendsPageProps {
  userData: {
    user: User;
    addFriend: (friendId: string) => Promise<{ success: boolean; message: string }>;
  };
}

const FriendsPage: React.FC<FriendsPageProps> = ({ userData }) => {
  const { user, addFriend } = userData;
  const [friendId, setFriendId] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleInvite = useCallback(async () => {
    if (!friendId.trim()) {
      setMessage({ text: "Please enter a friend's Telegram ID.", type: 'error' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    const result = await addFriend(friendId);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setFriendId('');
    }
    setIsLoading(false);
  }, [friendId, addFriend]);

  const handleCopyLink = useCallback(() => {
    const inviteLink = `https://t.me/CasualFlappyArcadeBot?start=${user.telegramId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setMessage({ text: 'Failed to copy link.', type: 'error' });
    });
  }, [user.telegramId]);

  const totalBonus = user.friends.reduce((sum, friend) => sum + friend.bonus, 0);

  return (
    <div className="w-full max-w-md p-6 bg-purple-700/50 rounded-lg shadow-2xl shadow-black/50 backdrop-blur-sm text-center">
      <h2 className="text-3xl text-yellow-300 mb-4">FRIENDS</h2>
      <p className="text-purple-200 mb-6">Invite friends and earn FLAP for each one that joins!</p>

      <div className="space-y-4 mb-6">
        <div className="p-3 bg-purple-800/50 rounded-md">
          <p className="text-sm text-gray-300">Friends Invited</p>
          <p className="text-2xl text-white">{user.friends.length}</p>
        </div>
        <div className="p-3 bg-purple-800/50 rounded-md">
          <p className="text-sm text-gray-300">Total Bonus Earned</p>
          <p className="text-2xl text-yellow-400">{totalBonus.toLocaleString()} FLAP</p>
        </div>
      </div>
      
       {/* Copy Link Section */}
       <div className="mb-6">
        <button
          onClick={handleCopyLink}
          disabled={isCopied}
          className={`w-full px-6 py-3 rounded-lg border-b-4 transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 ${
            isCopied
              ? 'bg-green-500 border-green-700 text-white cursor-default'
              : 'bg-purple-500 border-purple-700 hover:bg-purple-600 text-white'
          }`}
        >
          <CopyIcon />
          <span>{isCopied ? 'Copied!' : 'Copy Invite Link'}</span>
        </button>
      </div>

      {/* Manual Invite Section */}
      <div className="space-y-2 mb-6">
        <div>
          <label htmlFor="friend-id" className="block text-sm mb-1 text-left">Or Invite by Telegram ID</label>
          <input
            id="friend-id"
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            placeholder="Enter Telegram ID"
            className="w-full bg-purple-900/70 p-3 rounded-md text-white text-center text-lg border-2 border-purple-600 focus:border-yellow-400 focus:outline-none"
          />
        </div>
        <button
          onClick={handleInvite}
          disabled={isLoading || !friendId}
          className="w-full px-6 py-3 bg-yellow-500 text-slate-900 rounded-lg border-b-4 border-yellow-700 hover:bg-yellow-600 disabled:bg-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon />
              <span>Inviting...</span>
            </>
          ) : (
            'INVITE FRIEND'
          )}
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.type === 'success' ? 'text-green-300' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}

      {/* Friends List */}
      <div className="max-h-48 overflow-y-auto bg-purple-900/50 rounded-lg p-2">
        <h3 className="text-lg text-yellow-200 mb-2 sticky top-0 bg-purple-900/50 py-1">Your Squad</h3>
        {user.friends.length > 0 ? (
          <ul className="space-y-2">
            {user.friends.map((friend) => (
              <li key={friend.id} className="flex justify-between items-center bg-purple-800/60 p-2 rounded-md">
                <span className="text-white">{friend.username}</span>
                <span className="text-yellow-400 text-sm">+{friend.bonus} FLAP</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-purple-300 p-4">You haven't invited any friends yet.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;