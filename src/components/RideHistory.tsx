import React, { useState, useEffect } from 'react';
import { History, MapPin, DollarSign, Clock, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getUserRides, Ride, RideStatus, completeRide, cancelRide, rateUser } from '../utils/web3';
import { formatDistanceToNow, format } from 'date-fns';
import { ethers } from 'ethers';

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
      // Sort rides by timestamp (newest first)
      userRides.sort((a, b) => b.timestamp - a.timestamp);
      setRides(userRides);
    } catch (err: any) {
      setError(err.message || 'Error fetching ride history');
      console.error('Error fetching ride history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRide = async (rideId: number) => {
    setActionRideId(rideId);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await completeRide(rideId);
      if (result) {
        setSuccessMessage(`Ride #${rideId} has been completed successfully`);
        // Update the ride status in the list
        setRides(rides.map(ride => 
          ride.id === rideId 
            ? { ...ride, status: RideStatus.Completed } 
            : ride
        ));
      } else {
        setError('Failed to complete ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error completing ride');
      console.error('Error completing ride:', err);
    } finally {
      setActionRideId(null);
    }
  };

  const handleCancelRide = async (rideId: number) => {
    setActionRideId(rideId);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await cancelRide(rideId);
      if (result) {
        setSuccessMessage(`Ride #${rideId} has been cancelled`);
        // Update the ride status in the list
        setRides(rides.map(ride => 
          ride.id === rideId 
            ? { ...ride, status: RideStatus.Cancelled } 
            : ride
        ));
      } else {
        setError('Failed to cancel ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error cancelling ride');
      console.error('Error cancelling ride:', err);
    } finally {
      setActionRideId(null);
    }
  };

  const handleRateUser = async () => {
    if (!ratingRide) return;
    
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Determine which user to rate (if current user is rider, rate the driver, and vice versa)
      const userToRate = walletAddress === ratingRide.rider ? ratingRide.driver : ratingRide.rider;
      
      const result = await rateUser(userToRate, rating);
      if (result) {
        setSuccessMessage(`You have successfully rated the user with ${rating} stars`);
        // Mark the ride as rated
        setRides(rides.map(ride => 
          ride.id === ratingRide.id 
            ? { ...ride, isRated: true } 
            : ride
        ));
        setRatingRide(null);
      } else {
        setError('Failed to submit rating');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting rating');
      console.error('Error submitting rating:', err);
    }
  };

  const getRideStatusBadge = (status: RideStatus) => {
    switch (status) {
      case RideStatus.Available:
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Available</span>;
      case RideStatus.InProgress:
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In Progress</span>;
      case RideStatus.Completed:
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>;
      case RideStatus.Cancelled:
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  if (!walletAddress) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <History className="text-indigo-600" />
          Ride History
        </h2>
        <div className="text-center py-4 text-gray-500">
          Please connect your wallet to view your ride history
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History className="text-indigo-600" />
          Ride History
        </h2>
        <button
          onClick={fetchRideHistory}
          disabled={isLoading}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Clock size={14} />
              Refresh
            </>
          )}
        </button>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-start gap-2">
          <CheckCircle size={18} className="text-green-500 mt-0.5" />
          <div>
            <p className="text-green-800">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {/* Rating Modal */}
      {ratingRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            <p className="text-gray-600 mb-4">
              How would you rate your experience with this {walletAddress === ratingRide.rider ? 'driver' : 'rider'}?
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRatingRide(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRateUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
      
      {rides.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Loading ride history...' : 'No ride history found'}
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">Ride #{ride.id}</h3>
                {getRideStatusBadge(ride.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Pickup</div>
                    <div className="text-sm text-gray-600">{ride.pickupLocation}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Dropoff</div>
                    <div className="text-sm text-gray-600">{ride.dropoffLocation}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign size={18} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium">Fare:</span>{' '}
                    <span className="text-sm">{ethers.formatEther(ride.fare)} ETH</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  <div className="text-sm">
                    {format(new Date(ride.timestamp * 1000), 'PPpp')}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ride.status === RideStatus.InProgress && (
                  <button
                    onClick={() => handleCompleteRide(ride.id)}
                    disabled={actionRideId === ride.id}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {actionRideId === ride.id ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Complete Ride
                      </>
                    )}
                  </button>
                )}
                
                {(ride.status === RideStatus.Available || ride.status === RideStatus.InProgress) && (
                  <button
                    onClick={() => handleCancelRide(ride.id)}
                    disabled={actionRideId === ride.id}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {actionRideId === ride.id ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle size={18} />
                        Cancel Ride
                      </>
                    )}
                  </button>
                )}
                
                {ride.status === RideStatus.Completed && !ride.isRated && (
                  <button
                    onClick={() => setRatingRide(ride)}
                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">★</span>
                    Rate User
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideHistory; 