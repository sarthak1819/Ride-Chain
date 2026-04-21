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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Journeys</h2>
        <button
          onClick={fetchRideHistory}
          disabled={isLoading}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all hover:shadow-lg"
        >
          <Loader2 size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-500 text-white rounded-3xl mb-6 font-bold flex items-center gap-3"
          >
            <CheckCircle size={20} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rides.length === 0 ? (
          <div className="col-span-2 py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
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
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 hover:border-indigo-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</span>
                    <h3 className="text-xl font-black text-slate-800 tracking-tighter">#{ride.id}</h3>
                  </div>
                  <div className={`${config.color} text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-${config.color}/20`}>
                    {config.icon}
                    {config.label}
                  </div>
                </div>

                <div className="space-y-6 mb-8 relative pl-6 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</div>
                    <p className="font-bold text-slate-700 text-sm leading-tight">{ride.pickupLocation}</p>
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</div>
                    <p className="font-bold text-slate-700 text-sm leading-tight">{ride.dropoffLocation}</p>
                    <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-sm bg-purple-500 border-2 border-white"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fare</div>
                      <div className="font-black text-slate-800">{ethers.formatEther(ride.fare)} ETH</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                    <div className="font-bold text-slate-600 text-sm">{format(new Date(ride.timestamp * 1000), 'MMM d')}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {ride.status === RideStatus.InProgress && (
                    <button
                      onClick={() => handleCompleteRide(ride.id)}
                      disabled={actionRideId === ride.id}
                      className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      {actionRideId === ride.id ? <Loader2 className="animate-spin" /> : 'COMPLETE'}
                    </button>
                  )}
                  
                  {(ride.status === RideStatus.Available || ride.status === RideStatus.InProgress) && (
                    <button
                      onClick={() => handleCancelRide(ride.id)}
                      disabled={actionRideId === ride.id}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-xs tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    >
                      {actionRideId === ride.id ? <Loader2 className="animate-spin" /> : 'CANCEL'}
                    </button>
                  )}
                  
                  {ride.status === RideStatus.Completed && !ride.isRated && (
                    <button
                      onClick={() => setRatingRide(ride)}
                      className="flex-1 py-4 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs tracking-widest hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Rate Trip</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Your feedback secures the quality of the RideChain protocol.
            </p>
            
            <div className="flex justify-center gap-4 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-5xl transition-all ${rating >= star ? 'text-amber-400 scale-110 drop-shadow-lg' : 'text-slate-100 hover:text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setRatingRide(null)}
                className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-slate-100"
              >
                SKIP
              </button>
              <button
                onClick={handleRateUser}
                className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
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