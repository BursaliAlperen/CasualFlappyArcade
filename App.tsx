
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import FlappyGame from './components/FlappyGame';
import BankPage from './components/BankPage';
import FriendsPage from './components/FriendsPage';
import useUserData from './hooks/useUserData';
import type { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('FLAPPY');
  const userData = useUserData();

  const renderPage = () => {
    switch (currentPage) {
      case 'FLAPPY':
        return <FlappyGame onFlapEarned={userData.addFlap} />;
      case 'BANK':
        return <BankPage userData={userData} />;
      case 'FRIENDS':
        return <FriendsPage userData={userData} />;
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
