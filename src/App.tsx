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
        // If they switch accounts in MetaMask, we MUST reload the page 
        // to re-initialize the Ethers.js contract with the newly selected signer instance.
        sessionStorage.removeItem('isLoggedOut');
        window.location.reload();
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        <div className="flex flex-col items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-24 h-24 border-2 border-transparent border-t-indigo-400 border-r-purple-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-2 border-transparent border-b-pink-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          </div>
          <div className="text-white text-3xl font-black tracking-tight neon-text animate-pulse">RideChain</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-slate-100 relative selection:bg-indigo-500/30">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0f] to-[#0a0a0f]"></div>
      <div className="relative z-10">
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
    </div>
  );
};

export default App;