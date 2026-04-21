import React, { useState, useEffect } from 'react';
import { Car, MapPin, DollarSign, Clock, Loader2, CheckCircle, RefreshCcw, Navigation } from 'lucide-react';
import { getUserRides, acceptRide, getAllAvailableRides, Ride, RideStatus, UserRole } from '../utils/web3';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

interface AvailableRidesProps {
  userRole: UserRole | null;
}

const AvailableRides: React.FC<AvailableRidesProps> = ({ userRole }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptingRideId, setAcceptingRideId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userRole === UserRole.Driver) {
      fetchAvailableRides();
    }
  }, [userRole]);

  const fetchAvailableRides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const availableRides = await getAllAvailableRides();
      setRides(availableRides);
    } catch (err: any) {
      setError(err.message || 'Error fetching available rides');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: number) => {
    setAcceptingRideId(rideId);
    setError(null);
    try {
      const result = await acceptRide(rideId);
      if (result) {
        setSuccessMessage(`Ride #${rideId} Accepted`);
        setRides(rides.filter(ride => ride.id !== rideId));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to accept ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error accepting ride');
    } finally {
      setAcceptingRideId(null);
    }
  };

  if (userRole !== null && userRole !== UserRole.Driver) {
    return null; // Don't show for riders
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white max-h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Navigation size={20} />
            </div>
            Dispatch Board
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Available Missions</p>
        </div>
        <button
          onClick={fetchAvailableRides}
          disabled={isLoading}
          className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500 text-white p-4 rounded-2xl mb-6 flex items-center gap-3 font-bold shadow-lg shadow-green-500/20"
          >
            <CheckCircle size={20} />
            {successMessage}
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
        {rides.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Car size={32} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              {isLoading ? 'Scanning Protocol...' : 'No Requests Found'}
            </p>
          </div>
        ) : (
          rides.map((ride) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={ride.id} 
              className="group bg-slate-50 hover:bg-white p-6 rounded-[2rem] border border-transparent hover:border-indigo-100 transition-all hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">Trip #{ride.id}</h3>
                  <div className="flex items-center gap-2 text-slate-400 mt-1">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {formatDistanceToNow(new Date(ride.timestamp * 1000), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black text-sm shadow-lg shadow-indigo-500/30">
                  {ethers.formatEther(ride.fare)} ETH
                </div>
              </div>
              
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 mb-8">
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</div>
                  <div className="text-sm font-bold text-slate-700">{ride.pickupLocation}</div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-sm bg-purple-500 border-2 border-white"></div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dropoff</div>
                  <div className="text-sm font-bold text-slate-700">{ride.dropoffLocation}</div>
                </div>
              </div>
              
              <button
                onClick={() => handleAcceptRide(ride.id)}
                disabled={acceptingRideId === ride.id}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest hover:bg-indigo-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-900/10"
              >
                {acceptingRideId === ride.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Navigation size={16} className="rotate-45" />
                    ACCEPT MISSION
                  </>
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableRides;