import React, { useState, useEffect } from 'react';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { initWeb3, isConnected, getCurrentAccount } from '../utils/web3';
import { NETWORK_CONFIG } from '../utils/networkConfig';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkSwitchLoading, setNetworkSwitchLoading] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isConnected();
        if (connected) {
          const address = await getCurrentAccount();
          if (address) {
            setAccount(address);
            onConnect(address);
          }
        }
        
        // Check current network
        if (window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setCurrentNetwork(chainId);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onConnect(accounts[0]);
        } else {
          setAccount(null);
        }
      });
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setCurrentNetwork(chainId);
        window.location.reload(); // Reload the page when chain changes
      });
    }

    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, [onConnect]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await initWeb3();
      if (success) {
        const address = await getCurrentAccount();
        if (address) {
          setAccount(address);
          onConnect(address);
        } else {
          setError('Failed to get account address');
        }
      } else {
        setError('Failed to initialize Web3');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting wallet');
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchToSepoliaNetwork = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }
    
    setNetworkSwitchLoading(true);
    setError(null);
    
    try {
      // Try to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          setError('Failed to add Sepolia network to MetaMask');
          console.error('Error adding Sepolia network:', addError);
        }
      } else {
        setError(switchError.message || 'Failed to switch network');
        console.error('Error switching network:', switchError);
      }
    } finally {
      setNetworkSwitchLoading(false);
    }
  };
  
  const isSepoliaNetwork = currentNetwork === NETWORK_CONFIG.chainId;

  return (
    <div className="mb-6">
      {!account ? (
        <div className="flex flex-col items-center">
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Wallet size={20} />
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          {error && (
            <div className="mt-2 text-red-500 flex items-center gap-1">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Don't have test ETH? Get some from a faucet:</p>
            <a 
              href="https://sepoliafaucet.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline flex items-center gap-1 mt-1"
            >
              Sepolia Faucet <ExternalLink size={14} />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Wallet size={20} />
            <span>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
          </div>
          
          {!isSepoliaNetwork && (
            <div className="mt-3">
              <button
                onClick={switchToSepoliaNetwork}
                disabled={networkSwitchLoading}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors flex items-center gap-1"
              >
                {networkSwitchLoading ? 'Switching...' : 'Switch to Sepolia Test Network'}
              </button>
            </div>
          )}
          
          {isSepoliaNetwork && (
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Connected to Sepolia Test Network
            </div>
          )}
          
          <div className="mt-3 text-sm text-gray-600">
            <p>Need test ETH? Get some from a faucet:</p>
            <a 
              href="https://sepoliafaucet.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline flex items-center gap-1 mt-1"
            >
              Sepolia Faucet <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 