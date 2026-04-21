import React, { useState, useEffect } from 'react';
import { History, MapPin, DollarSign, Clock, Loader2, CheckCircle, XCircle, AlertCircle, Star, Navigation } from 'lucide-react';
import { getUserRides, Ride, RideStatus, completeRide, cancelRide, rateUser } from '../utils/web3';
import { formatDistanceToNow, format } from 'date-fns';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

interface RideHistoryProps {
  walletAddress: string | null;
}

const RideHistory: React.FC<RideHistoryProps> = ({ walletAddress }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionRideId, setActionRideId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [ratingRide, setRatingRide] = useState<Ride | null>(null);
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    if (walletAddress) {
      fetchRideHistory();
    }
  }, [walletAddress]);

  const fetchRideHistory = async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    setError(null);
    try {
      const userRides = await getUserRides();
      userRides.sort((a, b) => b.timestamp - a.timestamp);
      setRides(userRides);
    } catch (err: any) {
      setError(err.message || 'Error fetching ride history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRide = async (rideId: number) => {
    setActionRideId(rideId);
    setError(null);
    try {
      const result = await completeRide(rideId);
      if (result) {
        setSuccessMessage(`Ride #${rideId} Completed`);
        setRides(rides.map(ride => ride.id === rideId ? { ...ride, status: RideStatus.Completed } : ride));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to complete ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error completing ride');
    } finally {
      setActionRideId(null);
    }
  };

  const handleCancelRide = async (rideId: number) => {
    setActionRideId(rideId);
    setError(null);
    try {
      const result = await cancelRide(rideId);
      if (result) {
        setSuccessMessage(`Ride #${rideId} Cancelled`);
        setRides(rides.map(ride => ride.id === rideId ? { ...ride, status: RideStatus.Cancelled } : ride));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to cancel ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error cancelling ride');
    } finally {
      setActionRideId(null);
    }
  };

  const handleRateUser = async () => {
    if (!ratingRide) return;
    setError(null);
    try {
      const userToRate = walletAddress === ratingRide.rider ? ratingRide.driver : ratingRide.rider;
      const result = await rateUser(userToRate, rating);
      if (result) {
        setSuccessMessage(`User Rated!`);
        setRides(rides.map(ride => ride.id === ratingRide.id ? { ...ride, isRated: true } : ride));
        setRatingRide(null);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to submit rating');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting rating');
    }
  };

  const getStatusConfig = (status: RideStatus) => {
    switch (status) {
      case RideStatus.Available:
        return { label: 'Awaiting Driver', color: 'bg-blue-500', icon: <Clock size={12} /> };
      case RideStatus.InProgress:
        return { label: 'In Progress', color: 'bg-amber-500', icon: <Navigation size={12} className="rotate-45" /> };
      case RideStatus.Completed:
        return { label: 'Completed', color: 'bg-green-500', icon: <CheckCircle size={12} /> };
      case RideStatus.Cancelled:
        return { label: 'Cancelled', color: 'bg-red-500', icon: <XCircle size={12} /> };
      default:
        return { label: 'Unknown', color: 'bg-slate-500', icon: null };
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">Your Journeys</h2>
        <button
          onClick={fetchRideHistory}
          disabled={isLoading}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-300 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Loader2 size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-500/20 border border-green-500/30 text-green-400 rounded-3xl mb-6 font-bold flex items-center gap-3 shadow-inner"
          >
            <CheckCircle size={20} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {rides.length === 0 ? (
          <div className="col-span-2 py-20 text-center glass-panel rounded-[3rem]">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <History size={40} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No history yet</p>
          </div>
        ) : (
          rides.map((ride) => {
            const config = getStatusConfig(ride.status);
            return (
              <motion.div 
                layout
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-[2.5rem] shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:border-indigo-500/50 transition-all group border border-white/10"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest drop-shadow-sm">Protocol ID</span>
                    <h3 className="text-xl font-black text-white tracking-tighter">#{ride.id}</h3>
                  </div>
                  <div className={`${config.color} text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                    {config.icon}
                    {config.label}
                  </div>
                </div>

                <div className="space-y-6 mb-8 relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</div>
                    <p className="font-bold text-white text-sm leading-tight drop-shadow-sm">{ride.pickupLocation}</p>
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#0a0a0f] shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</div>
                    <p className="font-bold text-white text-sm leading-tight drop-shadow-sm">{ride.dropoffLocation}</p>
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-sm bg-pink-500 border-2 border-[#0a0a0f] shadow-[0_0_8px_rgba(244,114,182,0.8)]"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-black/20 border border-white/5 rounded-3xl mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl shadow-sm text-indigo-400">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fare</div>
                      <div className="font-black text-white">{ethers.formatEther(ride.fare)} ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                    <div className="font-bold text-indigo-200 text-sm">{format(new Date(ride.timestamp * 1000), 'MMM d')}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {ride.status === RideStatus.InProgress && (
                    <button
                      onClick={() => handleCompleteRide(ride.id)}
                      disabled={actionRideId === ride.id}
                      className="flex-1 py-4 bg-green-500/80 hover:bg-green-500 text-white border border-green-400/50 rounded-2xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                      {actionRideId === ride.id ? <Loader2 className="animate-spin" /> : 'COMPLETE'}
                    </button>
                  )}
                  
                  {(ride.status === RideStatus.Available || ride.status === RideStatus.InProgress) && (
                    <button
                      onClick={() => handleCancelRide(ride.id)}
                      disabled={actionRideId === ride.id}
                      className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-xs tracking-widest hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      {actionRideId === ride.id ? <Loader2 className="animate-spin" /> : 'CANCEL'}
                    </button>
                  )}
                  
                  {ride.status === RideStatus.Completed && !ride.isRated && (
                    <button
                      onClick={() => setRatingRide(ride)}
                      className="flex-1 py-4 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl font-black text-xs tracking-widest hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    >
                      <Star size={16} />
                      RATE TRIP
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Rating Modal */}
      {ratingRide && (
        <div className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-12 max-w-md w-full shadow-[0_0_50px_rgba(99,102,241,0.3)] border border-white/10 rounded-[3rem]"
          >
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">Rate Trip</h3>
            <p className="text-indigo-200 font-medium mb-10 leading-relaxed">
              Your feedback secures the quality of the RideChain protocol.
            </p>
            
            <div className="flex justify-center gap-4 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-5xl transition-all ${rating >= star ? 'text-amber-400 scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setRatingRide(null)}
                className="flex-1 py-5 bg-white/5 border border-white/10 text-slate-300 rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-white/10 transition-all"
              >
                SKIP
              </button>
              <button
                onClick={handleRateUser}
                className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
              >
                SUBMIT
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RideHistory;