import React, { useState, useEffect } from 'react';
import { Wallet, Loader2, CheckCircle, AlertCircle, TrendingUp, ArrowUpRight, RefreshCcw } from 'lucide-react';
import { getUserBalance, withdrawFunds } from '../utils/web3';
import { motion, AnimatePresence } from 'framer-motion';

interface WithdrawFundsProps {
  walletAddress: string | null;
}

const WithdrawFunds: React.FC<WithdrawFundsProps> = ({ walletAddress }) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
    }
  }, [walletAddress]);

  const fetchBalance = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const userBalance = await getUserBalance();
      setBalance(userBalance);
    } catch (err: any) {
      setError(err.message || 'Error fetching balance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletAddress) return;
    setIsWithdrawing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await withdrawFunds();
      if (result) {
        setSuccessMessage(`Transferred ${balance} ETH`);
        setBalance('0');
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError('Withdrawal rejected by protocol');
      }
    } catch (err: any) {
      setError(err.message || 'Error withdrawing funds');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!walletAddress) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Wallet size={20} />
            </div>
            Protocol Wallet
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Settlement Account</p>
        </div>
        <button 
          onClick={fetchBalance}
          disabled={isLoading}
          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all active:scale-95"
        >
          <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500 text-white p-4 rounded-2xl mb-6 font-bold flex items-center gap-3 shadow-lg shadow-green-500/20"
          >
            <CheckCircle size={20} />
            {successMessage}
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] mb-8 relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp size={100} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Escrowed Balance</div>
          <div className="flex items-baseline gap-3 text-white">
            <span className="text-5xl font-black tracking-tighter">{isLoading ? '...' : balance}</span>
            <span className="text-xl font-bold opacity-50">ETH</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleWithdraw}
        disabled={isWithdrawing || isLoading || parseFloat(balance) <= 0}
        className={`w-full py-6 px-8 rounded-[1.8rem] transition-all flex items-center justify-center gap-3 font-black text-lg shadow-xl ${
          parseFloat(balance) > 0
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
        }`}
      >
        {isWithdrawing ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <>
            <ArrowUpRight size={22} />
            WITHDRAW TO WALLET
          </>
        )}
      </button>
      
      <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Standard Blockchain gas fees apply to this settlement.
        </p>
      </div>
    </div>
  );
};

export default WithdrawFunds;