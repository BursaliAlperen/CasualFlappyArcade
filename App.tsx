
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import FlappyGame from './components/FlappyGame';
import BankPage from './components/BankPage';
import FriendsPage from './components/FriendsPage';
import useUserData from './hooks/useUserData';
import type { Page, User } from './types';
import { SpinnerIcon } from './components/icons/Icons';

// A type guard to make sure we only pass a valid user object to child components
interface ValidatedUserData {
  user: User;
  addFlap: (amount: number) => Promise<void>;
  swapFlapToTon: (flapAmount: number) => Promise<{ success: boolean; message: string; }>;
  withdrawTon: (tonAmount: number, address: string) => Promise<{ success: boolean; message: string; }>;
  addFriend: (friendId: string) => Promise<{ success: boolean; message: string; }>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('FLAPPY');
  const userData = useUserData();

  const renderPage = () => {
    if (!userData.user) return null; // Should not be reached if loading/error is handled
    
    // The userData object is now validated and can be passed safely
    const validatedUserData: ValidatedUserData = {
      ...userData,
      user: userData.user
    };

    switch (currentPage) {
      case 'FLAPPY':
        return <FlappyGame onFlapEarned={userData.addFlap} />;
      case 'BANK':
        return <BankPage userData={validatedUserData} />;
      case 'FRIENDS':
        return <FriendsPage userData={validatedUserData} />;
      default:
        return <FlappyGame onFlapEarned={userData.addFlap} />;
    }
  };

  const backgroundStyle = useMemo(() => {
    switch (currentPage) {
      case 'FLAPPY':
        return 'bg-gradient-to-b from-sky-400 to-sky-600';
      case 'BANK':
        return 'bg-gradient-to-b from-slate-800 to-slate-900';
      case 'FRIENDS':
        return 'bg-gradient-to-b from-purple-800 to-purple-900';
      default:
        return 'bg-slate-900';
    }
  }, [currentPage]);

  if (userData.loading) {
    return (
      <div className="font-arcade flex flex-col h-screen w-screen text-white overflow-hidden bg-slate-900 items-center justify-center">
        <SpinnerIcon />
        <p className="mt-4 text-xl">Loading Game...</p>
      </div>
    );
  }

  if (userData.error || !userData.user) {
    return (
       <div className="font-arcade flex flex-col h-screen w-screen text-white overflow-hidden bg-red-900 items-center justify-center text-center p-4">
        <h2 className="text-2xl mb-4">Connection Error</h2>
        <p className="text-red-300">{userData.error || "Could not load user data. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className={`font-arcade flex flex-col h-screen w-screen text-white overflow-hidden ${backgroundStyle}`}>
      <Header user={userData.user} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-y-auto">
        {renderPage()}
      </main>
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
