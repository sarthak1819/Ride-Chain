import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  walletAddress: string | null;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  const fetchTransactions = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch transactions from the blockchain
      // For now, we'll just simulate it with some dummy data
      const mockTransactions: Transaction[] = [
        {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          from: walletAddress,
          to: '0x' + Math.random().toString(16).substr(2, 40),
          value: ethers.parseEther('0.1').toString(),
          timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
          status: 'success'
        },
        {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          from: '0x' + Math.random().toString(16).substr(2, 40),
          to: walletAddress,
          value: ethers.parseEther('0.05').toString(),
          timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
          status: 'success'
        },
        {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          from: walletAddress,
          to: '0x' + Math.random().toString(16).substr(2, 40),
          value: ethers.parseEther('0.2').toString(),
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          status: 'pending'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (err: any) {
      setError(err.message || 'Error fetching transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Success</span>;
      case 'pending':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>;
      case 'failed':
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Failed</span>;
      default:
        return null;
    }
  };

  if (!walletAddress) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="text-indigo-600" />
          Transaction History
        </h2>
        <div className="text-center py-4 text-gray-500">
          Please connect your wallet to view your transaction history
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="text-indigo-600" />
          Transaction History
        </h2>
        <button
          onClick={fetchTransactions}
          disabled={isLoading}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-700">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From/To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      {formatAddress(tx.hash)}
                      <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.from === walletAddress ? (
                      <div>
                        <div className="text-gray-500">From: <span className="text-gray-900">You</span></div>
                        <div className="text-gray-500">To: <span className="text-gray-900">{formatAddress(tx.to)}</span></div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-500">From: <span className="text-gray-900">{formatAddress(tx.from)}</span></div>
                        <div className="text-gray-500">To: <span className="text-gray-900">You</span></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={tx.from === walletAddress ? 'text-red-600' : 'text-green-600'}>
                      {tx.from === walletAddress ? '-' : '+'}{ethers.formatEther(tx.value)} ETH
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 