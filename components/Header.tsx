
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="w-full p-2 bg-black bg-opacity-20 backdrop-blur-sm text-xs md:text-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={user.profilePhotoUrl} alt="Profile" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-yellow-400" />
          <div>
            <p className="font-bold text-yellow-300">{user.username}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
            <span className="text-yellow-400">FLAP:</span> {Math.floor(user.flapBalance).toLocaleString()}
          </div>
          <div className="bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
            <span className="text-cyan-400">TON:</span> {user.tonBalance.toFixed(6)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
