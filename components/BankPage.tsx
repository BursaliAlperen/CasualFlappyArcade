import React, { useState, useMemo, useCallback } from 'react';
import type { User } from '../types';
import { FLAP_TO_TON_CONVERSION_RATE, MIN_WITHDRAWAL_TON } from '../constants';
import { SpinnerIcon } from './icons/Icons';
import ConfirmationDialog from './ConfirmationDialog';

interface BankPageProps {
  userData: {
    user: User;
    swapFlapToTon: (flapAmount: number) => Promise<{success: boolean, message: string}>;
    withdrawTon: (tonAmount: number, address: string) => Promise<{success: boolean, message: string}>;
  };
}

const BankPage: React.FC<BankPageProps> = ({ userData }) => {
  const { user, swapFlapToTon, withdrawTon } = userData;
  const [flapAmount, setFlapAmount] = useState('');
  const [tonAmount, setTonAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'swap' | 'withdraw' | null>(null);
  const [isConfirmingWithdrawal, setIsConfirmingWithdrawal] = useState(false);

  const tonToReceive = useMemo(() => {
    const amount = parseFloat(flapAmount);
    return isNaN(amount) || amount <= 0 ? 0 : amount * FLAP_TO_TON_CONVERSION_RATE;
  }, [flapAmount]);

  const handleSwap = useCallback(async () => {
    const amount = parseInt(flapAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Please enter a valid amount.', type: 'error' });
      return;
    }
    if (amount > user.flap_balance) {
      setMessage({ text: 'Insufficient FLAP balance.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setLoadingAction('swap');
    setMessage(null);
    const result = await swapFlapToTon(amount);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error'});
    if(result.success) {
        setFlapAmount('');
    }
    setIsLoading(false);
    setLoadingAction(null);
  }, [flapAmount, user.flap_balance, swapFlapToTon]);
  
  const processWithdrawal = useCallback(async () => {
    setIsConfirmingWithdrawal(false); // Close dialog first
    const amount = parseFloat(tonAmount);
    if (isNaN(amount) || amount <= 0 || amount > user.ton_balance || !withdrawAddress.trim()) {
      setMessage({ text: 'An unexpected error occurred. Please check details.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setLoadingAction('withdraw');
    setMessage(null);
    const result = await withdrawTon(amount, withdrawAddress);
    setMessage({ text: result.message, type: result.success ? 'success' : 'error'});
    if (result.success) {
      setTonAmount('');
      setWithdrawAddress('');
    }
    setIsLoading(false);
    setLoadingAction(null);
  }, [tonAmount, user.ton_balance, withdrawTon, withdrawAddress]);

  const handleWithdrawClick = () => {
    setMessage(null);
    const amount = parseFloat(tonAmount);
    if (!withdrawAddress.trim()) {
        setMessage({ text: 'Please enter a valid wallet address.', type: 'error' });
        return;
    }
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Please enter a valid withdrawal amount.', type: 'error' });
      return;
    }
    if (amount < MIN_WITHDRAWAL_TON) {
       setMessage({ text: `Minimum withdrawal is ${MIN_WITHDRAWAL_TON} TON.`, type: 'error' });
       return;
    }
    if (amount > user.ton_balance) {
      setMessage({ text: 'Insufficient TON balance for this withdrawal.', type: 'error' });
      return;
    }
    setIsConfirmingWithdrawal(true);
  };


  return (
    <>
      <div className="w-full max-w-md p-6 bg-slate-700/50 rounded-lg shadow-2xl shadow-black/50 backdrop-blur-sm text-center">
        <h2 className="text-3xl text-yellow-300 mb-6">BANK</h2>
        
        <div className="space-y-4 mb-6">
          <div className="p-3 bg-slate-800/50 rounded-md">
            <p className="text-sm text-gray-300">FLAP Balance</p>
            <p className="text-2xl text-yellow-400">{Math.floor(user.flap_balance).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-md">
            <p className="text-sm text-gray-300">TON Balance</p>
            <p className="text-2xl text-cyan-400">{user.ton_balance.toFixed(6)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* SWAP SECTION */}
          <div className="space-y-2">
            <div>
              <label htmlFor="flap-amount" className="block text-sm mb-1 text-left">FLAP to Swap</label>
              <input
                id="flap-amount"
                type="number"
                value={flapAmount}
                onChange={(e) => setFlapAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full bg-slate-900/70 p-3 rounded-md text-white text-center text-lg border-2 border-slate-600 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <p className="text-sm">You will receive: <span className="text-cyan-400">{tonToReceive.toFixed(6)} TON</span></p>
            
            <button 
              onClick={handleSwap} 
              disabled={isLoading || !flapAmount || parseFloat(flapAmount) <= 0 || parseFloat(flapAmount) > user.flap_balance}
              className="w-full px-6 py-3 bg-yellow-500 text-slate-900 rounded-lg border-b-4 border-yellow-700 hover:bg-yellow-600 disabled:bg-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
            >
              {isLoading && loadingAction === 'swap' ? (
                <>
                  <SpinnerIcon />
                  <span>Swapping...</span>
                </>
              ) : (
                'SWAP'
              )}
            </button>
          </div>
          
          {/* DIVIDER */}
          <hr className="border-slate-600" />

          {/* WITHDRAW SECTION */}
          <div className="space-y-2">
             <div>
              <label htmlFor="ton-address" className="block text-sm mb-1 text-left">TON Wallet Address</label>
              <input
                id="ton-address"
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="w-full bg-slate-900/70 p-3 rounded-md text-white text-center text-lg border-2 border-slate-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="ton-amount" className="block text-sm mb-1 text-left">TON to Withdraw</label>
              <input
                id="ton-amount"
                type="number"
                value={tonAmount}
                onChange={(e) => setTonAmount(e.target.value)}
                placeholder={`min ${MIN_WITHDRAWAL_TON} TON`}
                className="w-full bg-slate-900/70 p-3 rounded-md text-white text-center text-lg border-2 border-slate-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <button 
              onClick={handleWithdrawClick} 
              disabled={isLoading || !tonAmount || !withdrawAddress.trim() || parseFloat(tonAmount) < MIN_WITHDRAWAL_TON || parseFloat(tonAmount) > user.ton_balance}
              className="w-full px-6 py-3 bg-cyan-500 text-slate-900 rounded-lg border-b-4 border-cyan-700 hover:bg-cyan-600 disabled:bg-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
            >
              {isLoading && loadingAction === 'withdraw' ? (
                <>
                  <SpinnerIcon />
                  <span>Processing...</span>
                </>
              ) : (
              `WITHDRAW TON`
              )}
            </button>
          </div>
        </div>

        {message && (
            <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message.text}
            </p>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isConfirmingWithdrawal}
        onClose={() => setIsConfirmingWithdrawal(false)}
        onConfirm={processWithdrawal}
        title="Confirm Withdrawal"
      >
        <p>You are about to withdraw</p>
        <p className="text-2xl text-cyan-400 my-2">{parseFloat(tonAmount || '0').toFixed(6)} TON</p>
        <p className="text-xs text-slate-400 mb-2">to the address:</p>
        <p className="text-xs text-white break-all bg-slate-900 p-2 rounded">{withdrawAddress}</p>
      </ConfirmationDialog>
    </>
  );
};

export default BankPage;
