import React, { useState, useEffect } from 'react';
import { UserCircle, User, Loader2 } from 'lucide-react';
import { registerUser, getCurrentUser, UserRole } from '../utils/web3';
import { motion } from 'framer-motion';

interface UserRegistrationProps {
  walletAddress: string | null;
  onRegistered: (isRegistered: boolean, role?: UserRole) => void;
  defaultRole?: UserRole;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ walletAddress, onRegistered, defaultRole }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(defaultRole ?? UserRole.Rider);

  useEffect(() => {
    if (defaultRole !== undefined) {
      setRole(defaultRole);
    }

    const checkUserRegistration = async () => {
      if (walletAddress) {
        try {
          const user = await getCurrentUser();
          if (user && user.isRegistered) {
            setIsRegistered(true);
            setCurrentUser(user);
            onRegistered(true, Number(user.role));
          } else {
            setIsRegistered(false);
            onRegistered(false);
          }
        } catch (err) {
          console.error('Error checking user registration:', err);
        } 
      }
    };

    checkUserRegistration();
  }, [walletAddress, defaultRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!name) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the selected role
      console.log(`Registering user as ${role === UserRole.Rider ? "Rider" : "Driver"}`);
      const success = await registerUser(name, phoneNumber || 'Not provided', role);
      if (success) {
        setIsRegistered(true);
        const user = await getCurrentUser();
        console.log("User registered successfully. Data from blockchain:", user);
        if (user) {
          setCurrentUser(user);
          onRegistered(true, Number(user.role));
        }
      } else {
        setError('Failed to register user');
      }
    } catch (err: any) {
      setError(err.message || 'Error registering user');
      console.error('Error registering user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered && currentUser) {
    return (
      <div className="glass-panel p-10 rounded-[3rem] shadow-[0_0_50px_rgba(99,102,241,0.2)]">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-[1.8rem] flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <UserCircle size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Identity Verified</h2>
            <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]">
              {currentUser.role === UserRole.Rider ? 'RIDER' : 'DRIVER'} ACTIVE
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 shadow-inner block">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Protocol Data</div>
            <div className="space-y-4">
              <div className="flex justify-between font-bold border-b border-white/10 pb-3">
                <span className="text-slate-400">Name</span>
                <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{currentUser.name}</span>
              </div>
              <div className="flex justify-between font-bold pt-1">
                <span className="text-slate-400">Address</span>
                <span className="text-indigo-300 font-mono text-xs truncate max-w-[150px]">{walletAddress}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onRegistered(true, Number(currentUser.role))}
            className="w-full py-6 bg-indigo-600/80 text-white rounded-[1.8rem] font-black text-sm tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
          >
            ENTER DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full glass-panel p-10 rounded-[3rem] relative mt-10">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <UserCircle size={120} className="text-white" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">
            Identity Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-5 bg-black/40 border border-white/10 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-white transition-all shadow-inner placeholder:text-slate-600"
            placeholder="e.g. Satoshi Nakamoto"
            required
          />
        </div>
        
        {!defaultRole && (
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest">
              Service Role
            </label>
            <div className="grid grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setRole(UserRole.Rider)}
                className={`py-5 px-6 rounded-[2rem] border transition-all font-black text-sm tracking-widest ${
                  role === UserRole.Rider
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-[1.02]'
                    : 'bg-black/20 border-white/10 text-slate-500 hover:bg-white/5'
                }`}
              >
                RIDER
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.Driver)}
                className={`py-5 px-6 rounded-[2rem] border transition-all font-black text-sm tracking-widest ${
                  role === UserRole.Driver
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                    : 'bg-black/20 border-white/10 text-slate-500 hover:bg-white/5'
                }`}
              >
                DRIVER
              </button>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-widest">
            Contact Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-8 py-5 bg-black/40 border border-white/10 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-white transition-all shadow-inner placeholder:text-slate-600"
            placeholder="+1 555-0123"
          />
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-red-500/10 text-red-400 rounded-[2rem] text-sm font-bold flex items-center gap-3 border border-red-500/20"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            {error}
          </motion.div>
        )}
        
        {!walletAddress ? (
          <div className="p-10 bg-black/40 rounded-[2rem] border border-white/10 text-center">
            <p className="text-slate-400 font-bold mb-6">Wallet connection required to access the protocol.</p>
            <div className="max-w-xs mx-auto">
               <button 
                type="button"
                onClick={async () => {
                  try {
                    const { initWeb3, getCurrentAccount } = await import('../utils/web3');
                    const success = await initWeb3();
                    if (success) {
                      const addr = await getCurrentAccount();
                      if (addr) {
                        sessionStorage.removeItem('isLoggedOut');
                        window.location.reload();
                      }
                    }
                  } catch (e) {
                    setError("Failed to connect wallet. Ensure MetaMask is open.");
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
               >
                 CONNECT WALLET
               </button>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-6 px-8 rounded-[2rem] transition-all flex items-center justify-center gap-4 font-black text-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98] ${
              role === UserRole.Driver 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500 border border-indigo-400/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                SECURING PROTOCOL...
              </>
            ) : (
              <>
                {role === UserRole.Rider ? <User size={24} /> : <Loader2 size={24} className="rotate-45" />}
                REGISTER AS {role === UserRole.Rider ? 'RIDER' : 'DRIVER'}
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default UserRegistration;