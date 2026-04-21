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
        absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl
        transform transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Account</h2>
              <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-[1.8rem] bg-white p-1 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.wallet}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-[1.5rem]"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{user.name || 'Anonymous User'}</h3>
                <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full w-fit">
                  <span className="text-xs font-black uppercase tracking-wider">
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
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Wallet Details</div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Wallet className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase">Address</span>
                    <span className="text-sm font-mono font-bold text-slate-800 truncate max-w-[200px]">
                      {user.wallet}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all border border-transparent hover:border-indigo-100 group">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-bold text-slate-700">Trip History</span>
                </div>
                <X className="w-5 h-5 text-slate-300 rotate-45" />
              </button>
              
              <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-all border border-transparent hover:border-indigo-100 group">
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="font-bold text-slate-700">Safety Settings</span>
                </div>
                <X className="w-5 h-5 text-slate-300 rotate-45" />
              </button>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-3">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 rounded-[2rem] hover:bg-red-100 transition-all font-black text-sm tracking-widest"
            >
              <LogOut className="w-5 h-5" />
              DISCONNECT WALLET
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 p-5 bg-slate-200 text-slate-600 rounded-[2rem] hover:bg-slate-300 transition-all font-black text-sm tracking-widest"
            >
              LOG OUT
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
              RideChain Protocol v1.0.4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;