import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import Home from './pages/Home';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';
import { initWeb3, isConnected, getCurrentAccount, getCurrentUser, UserRole, CONTRACT_ADDRESS } from './utils/web3';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUserObject] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!CONTRACT_ADDRESS) {
      console.warn("VITE_CONTRACT_ADDRESS is missing. Please restart 'npm run dev' after deploying the contract.");
    }
  }, []);

  const checkConnection = useCallback(async () => {
    // If user manually logged out, don't auto-connect
    if (sessionStorage.getItem('isLoggedOut') === 'true') {
      setIsLoading(false);
      return;
    }

    try {
      const connected = await isConnected();
      if (connected) {
        const address = await getCurrentAccount();
        if (address) {
          setWalletAddress(address);
          const user = await getCurrentUser();
          if (user && user.isRegistered) {
            setIsRegistered(true);
            setUserRole(Number(user.role));
            setCurrentUserObject(user);
          } else {
            setIsRegistered(false);
            setCurrentUserObject(null);
          }
        }
      } else if (window.ethereum) {
        await initWeb3();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (_accounts: string[]) => {
        // If they switch accounts in MetaMask, clear logout flag and reconnect
        sessionStorage.removeItem('isLoggedOut');
        checkConnection();
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, [checkConnection]);

  const handleConnect = (address: string) => {
    sessionStorage.removeItem('isLoggedOut');
    setWalletAddress(address);
    checkConnection();
  };

  const handleRegistered = (registered: boolean, role?: UserRole) => {
    setIsRegistered(registered);
    if (role !== undefined) setUserRole(Number(role));
    checkConnection();
  };

  const handleLogout = () => {
    sessionStorage.setItem('isLoggedOut', 'true');
    setWalletAddress(null);
    setIsRegistered(false);
    setUserRole(null);
    setCurrentUserObject(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-white text-2xl font-bold tracking-tight animate-pulse">RideChain</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar onProfileClick={() => setIsProfileOpen(true)} />
      
      <Routes>
        <Route path="/" element={
          isRegistered ? <Navigate to="/dashboard" /> : <Home walletAddress={walletAddress} onConnect={handleConnect} />
        } />
        
        <Route path="/register/:roleType" element={
          <RegisterPage walletAddress={walletAddress} onRegistered={handleRegistered} />
        } />

        <Route path="/dashboard" element={
          isRegistered ? (
            <Dashboard walletAddress={walletAddress} userRole={userRole} />
          ) : (
            <Navigate to="/" />
          )
        } />
      </Routes>

      <AnimatePresence>
        {isProfileOpen && (
          <UserProfile 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;