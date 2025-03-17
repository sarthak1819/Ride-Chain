import React from 'react';
import { X, Star, Shield, Wallet, Clock } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`
      fixed inset-0 bg-black/20 backdrop-blur-sm z-50
      transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div className={`
        absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Alex Thompson</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-slate-600">4.92</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-semibold text-slate-800">127</div>
                  <div className="text-sm text-slate-600">Rides</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-semibold text-slate-800">4.92</div>
                  <div className="text-sm text-slate-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-semibold text-slate-800">2.1</div>
                  <div className="text-sm text-slate-600">ETH Saved</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Payment Methods</span>
                  </div>
                  <span className="text-sm text-slate-500">2 cards</span>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Ride History</span>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <span className="font-medium text-slate-700">Safety Center</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;