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
        setCurrentUser(user);
        onRegistered(true, Number(user.role));
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
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-[1.8rem] flex items-center justify-center text-indigo-600">
            <UserCircle size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Identity Verified</h2>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">
              {currentUser.role === UserRole.Rider ? 'RIDER' : 'DRIVER'} ACTIVE
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Protocol Data</div>
            <div className="space-y-3">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Name</span>
                <span className="text-slate-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Address</span>
                <span className="text-slate-800 font-mono text-xs truncate max-w-[150px]">{walletAddress}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onRegistered(true, Number(currentUser.role))}
            className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-sm tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            ENTER DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
            Identity Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 font-bold text-slate-800 transition-all shadow-sm"
            placeholder="e.g. Satoshi Nakamoto"
            required
          />
        </div>
        
        {!defaultRole && (
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">
              Service Role
            </label>
            <div className="grid grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setRole(UserRole.Rider)}
                className={`py-5 px-6 rounded-[2rem] border-2 transition-all font-black text-sm tracking-widest ${
                  role === UserRole.Rider
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xl scale-105'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                RIDER
              </button>
              <button
                type="button"
                onClick={() => setRole(UserRole.Driver)}
                className={`py-5 px-6 rounded-[2rem] border-2 transition-all font-black text-sm tracking-widest ${
                  role === UserRole.Driver
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                DRIVER
              </button>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
            Contact Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 font-bold text-slate-800 transition-all shadow-sm"
            placeholder="+1 555-0123"
          />
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-red-50 text-red-600 rounded-[2rem] text-sm font-bold flex items-center gap-3 border border-red-100"
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
            {error}
          </motion.div>
        )}
        
        {!walletAddress ? (
          <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
            <p className="text-slate-500 font-bold mb-6">Wallet connection required to access the protocol.</p>
            <div className="max-w-xs mx-auto">
               <button 
                type="button"
                onClick={async () => {
                  try {
                    const { initWeb3, getCurrentAccount } = await import('../utils/web3');
                    const success = await initWeb3();
                    if (success) {
                      const addr = await getCurrentAccount();
                      if (addr) window.location.reload(); // Simplest way to sync all states
                    }
                  } catch (e) {
                    setError("Failed to connect wallet. Ensure MetaMask is open.");
                  }
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
               >
                 CONNECT WALLET
               </button>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-6 px-8 rounded-[2rem] transition-all flex items-center justify-center gap-4 font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] ${
              role === UserRole.Driver 
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
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