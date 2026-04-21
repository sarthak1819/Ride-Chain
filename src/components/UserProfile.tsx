import React from 'react';
import { X, Star, Shield, Wallet, Clock, LogOut } from 'lucide-react';
import { UserRole } from '../utils/web3';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, user, onLogout }) => {
  if (!user) return null;

  return (
    <div className={`
      fixed inset-0 bg-black/40 backdrop-blur-md z-50
      transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        absolute right-0 top-0 h-full w-full max-w-md glass-panel !rounded-none shadow-[[-20px_0_50px_rgba(0,0,0,0.5)]] border-l border-white/10
        transform transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col relative z-10">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Account</h2>
              <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                <X className="w-6 h-6 text-indigo-300" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <div className="w-full h-full rounded-[1.8rem] bg-[#0a0a0f] p-1 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.wallet}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">{user.name || 'Anonymous User'}</h3>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full w-fit">
                  <span className="text-xs font-black uppercase tracking-wider shadow-indigo-500">
                    {user.role === UserRole.Rider ? 'Rider' : 'Driver'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 space-y-10">
            {/* Stats Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-1">
                  <div className="text-4xl font-black">{user.rating.toFixed(1)}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-4xl font-black">{user.totalRatings}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trips</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 px-2 drop-shadow-sm">Wallet Details</div>
              <div className="p-6 bg-black/40 rounded-[2rem] border border-white/10 shadow-inner">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Wallet className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">Address</span>
                    <span className="text-sm font-mono font-bold text-white truncate max-w-[200px]">
                      {user.wallet}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-all border border-white/5 hover:border-indigo-400/50 group shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="font-bold text-slate-200 group-hover:text-white transition-colors">Trip History</span>
                </div>
                <X className="w-5 h-5 text-slate-500 rotate-45 group-hover:text-indigo-400 transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[2rem] hover:bg-white/10 transition-all border border-white/5 hover:border-pink-400/50 group shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  <span className="font-bold text-slate-200 group-hover:text-white transition-colors">Safety Settings</span>
                </div>
                <X className="w-5 h-5 text-slate-500 rotate-45 group-hover:text-pink-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-black/40 border-t border-white/10 space-y-3 relative z-10">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2rem] hover:bg-red-500/20 hover:text-red-300 transition-all font-black text-sm tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            >
              <LogOut className="w-5 h-5" />
              DISCONNECT WALLET
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 text-slate-300 rounded-[2rem] hover:bg-white/10 hover:text-white transition-all font-black text-sm tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
              LOG OUT
            </button>
            <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">
              RideChain Protocol v1.0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;