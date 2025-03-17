import React, { useState, useEffect } from 'react';
import { Wallet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getUserBalance, withdrawFunds } from '../utils/web3';

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
      console.error('Error fetching balance:', err);
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
        setSuccessMessage(`Successfully withdrew ${balance} ETH to your wallet`);
        setBalance('0');
      } else {
        setError('Failed to withdraw funds');
      }
    } catch (err: any) {
      setError(err.message || 'Error withdrawing funds');
      console.error('Error withdrawing funds:', err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wallet className="text-indigo-600" />
          Withdraw Funds
        </h2>
        <div className="text-center py-4 text-gray-500">
          Please connect your wallet to withdraw funds
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Wallet className="text-indigo-600" />
        Withdraw Funds
      </h2>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-start gap-2">
          <CheckCircle size={18} className="text-green-500 mt-0.5" />
          <div>
            <p className="text-green-800">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="text-sm text-gray-500 mb-1">Available Balance</div>
        <div className="text-2xl font-semibold flex items-center gap-2">
          {isLoading ? (
            <Loader2 size={24} className="animate-spin text-indigo-600" />
          ) : (
            <>
              <span>{balance} ETH</span>
              <button
                onClick={fetchBalance}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>
      
      <button
        onClick={handleWithdraw}
        disabled={isWithdrawing || isLoading || parseFloat(balance) <= 0}
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
          parseFloat(balance) > 0
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors`}
      >
        {isWithdrawing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Withdrawing...
          </>
        ) : (
          'Withdraw to Wallet'
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Withdrawing will transfer your available balance to your connected wallet address.
      </p>
    </div>
  );
};

export default WithdrawFunds; 