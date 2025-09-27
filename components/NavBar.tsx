
import React from 'react';
import type { Page } from '../types';
import { BirdIcon, BankIcon, FriendsIcon } from './icons/Icons';

interface NavBarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full pt-2 pb-1 transition-all duration-200 ${
        isActive ? 'text-yellow-300 scale-110' : 'text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
};

const NavBar: React.FC<NavBarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="w-full bg-black bg-opacity-30 backdrop-blur-md border-t-2 border-yellow-400">
      <div className="container mx-auto flex justify-around items-center h-16">
        <NavButton
          label="FLAPPY"
          icon={<BirdIcon />}
          isActive={currentPage === 'FLAPPY'}
          onClick={() => setCurrentPage('FLAPPY')}
        />
        <NavButton
          label="BANK"
          icon={<BankIcon />}
          isActive={currentPage === 'BANK'}
          onClick={() => setCurrentPage('BANK')}
        />
        <NavButton
          label="FRIENDS"
          icon={<FriendsIcon />}
          isActive={currentPage === 'FRIENDS'}
          onClick={() => setCurrentPage('FRIENDS')}
        />
      </div>
    </nav>
  );
};

export default NavBar;
