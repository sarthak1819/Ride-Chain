import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map from '../components/Map';
import BookingPanel from '../components/BookingPanel';
import AvailableRides from '../components/AvailableRides';
import RideHistory from '../components/RideHistory';
import WithdrawFunds from '../components/WithdrawFunds';
import { UserRole, getUserRides } from '../utils/web3';
import { Plus, History, Wallet, Map as MapIcon, Car } from 'lucide-react';

interface DashboardProps {
  walletAddress: string | null;
  userRole: UserRole | null;
}

const Dashboard: React.FC<DashboardProps> = ({ walletAddress, userRole }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'history' | 'earnings'>('map');
  const [activeRide, setActiveRide] = useState<any>(null);

  // Poll for active ride status
  React.useEffect(() => {
    const checkActiveRide = async () => {
      try {
        const rides = await getUserRides();
        const ongoing = rides.find((r: any) => r.status === 0 || r.status === 1); // Available or InProgress
        setActiveRide(ongoing || null);
      } catch (e) {
        // Silent error for polling
      }
    };
    
    checkActiveRide();
    const interval = setInterval(checkActiveRide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-slate-50 relative overflow-hidden">
      {/* Side Navigation (Modern) */}
      <div className="w-24 bg-slate-900 flex flex-col items-center py-8 gap-10 z-30">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Car size={24} />
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          <NavButton 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')} 
            icon={<MapIcon size={24} />} 
            label="Map"
          />
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={24} />} 
            label="History"
          />
          {userRole === UserRole.Driver && (
            <NavButton 
              active={activeTab === 'earnings'} 
              onClick={() => setActiveTab('earnings')} 
              icon={<Wallet size={24} />} 
              label="Earnings"
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Map />
              
              {/* Overlays for Map */}
              <div className="absolute inset-0 pointer-events-none z-10 p-8">
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col gap-4 pointer-events-auto">
                    {userRole === UserRole.Rider && !isBookingOpen && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-indigo-600 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-3 font-black text-lg border-b-4 border-indigo-800"
                      >
                        <Plus size={24} />
                        New Journey
                      </motion.button>
                    )}

                    {/* Active Journey Tracking Card */}
                    <AnimatePresence>
                      {activeRide && (
                        <motion.div
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          className="w-80 bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl p-8 overflow-hidden relative"
                        >
                          <div className="absolute top-0 right-0 p-4">
                            <div className={`w-3 h-3 rounded-full ${activeRide.status === 0 ? 'bg-amber-500' : 'bg-green-500'} animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]`}></div>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                              <Car size={20} />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 tracking-tight">Active Trip</h4>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {activeRide.status === 0 ? 'Searching...' : 'Driver Found'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                              <p className="text-xs font-bold text-slate-600 truncate">{activeRide.pickupLocation}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-sm bg-purple-500"></div>
                              <p className="text-xs font-bold text-slate-600 truncate">{activeRide.dropoffLocation}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setActiveTab('history')}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                          >
                            <History size={14} />
                            TRACK STATUS
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-full max-w-md pointer-events-auto flex flex-col gap-6 ml-auto overflow-auto max-h-full no-scrollbar pb-20">
                    {userRole === UserRole.Driver && (
                      <AvailableRides userRole={userRole} />
                    )}
                    {isBookingOpen && (
                      <BookingPanel 
                        onClose={() => setIsBookingOpen(false)} 
                        onSuccess={() => setIsBookingOpen(false)} 
                        onTrack={() => {
                          setIsBookingOpen(false);
                          setActiveTab('history');
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 w-full max-w-4xl mx-auto overflow-auto h-full no-scrollbar"
            >
              <h2 className="text-4xl font-black text-slate-900 mb-10">Ride History</h2>
              <RideHistory walletAddress={walletAddress} />
            </motion.div>
          )}

          {activeTab === 'earnings' && userRole === UserRole.Driver && (
            <motion.div 
              key="earnings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 w-full max-w-2xl mx-auto overflow-auto h-full no-scrollbar"
            >
              <h2 className="text-4xl font-black text-slate-900 mb-10">Earnings & Wallet</h2>
              <WithdrawFunds walletAddress={walletAddress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Status Bar (Dashboard Exclusive) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/90 backdrop-blur-xl px-10 py-4 rounded-full shadow-2xl border border-white/10 flex items-center gap-10 pointer-events-auto"
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Active</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Role: <span className="text-indigo-400">{userRole === UserRole.Rider ? 'RIDER' : 'DRIVER'}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 transition-all duration-300 ${active ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'}`}
  >
    <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-indigo-600 shadow-lg shadow-indigo-500/50' : 'bg-transparent'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Dashboard;
