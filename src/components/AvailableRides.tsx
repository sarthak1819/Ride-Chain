import React, { useState, useEffect } from 'react';
import { Car, MapPin, DollarSign, Clock, Loader2, CheckCircle } from 'lucide-react';
import { getUserRides, acceptRide, Ride, RideStatus, UserRole } from '../utils/web3';
import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

interface AvailableRidesProps {
  userRole: UserRole | null;
}

const AvailableRides: React.FC<AvailableRidesProps> = ({ userRole }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptingRideId, setAcceptingRideId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Debug log when userRole changes
  useEffect(() => {
    console.log("AvailableRides - userRole:", userRole, userRole === UserRole.Rider ? "(Rider)" : userRole === UserRole.Driver ? "(Driver)" : "(null)");
  }, [userRole]);

  useEffect(() => {
    if (userRole === UserRole.Driver) {
      fetchAvailableRides();
    }
  }, [userRole]);

  const fetchAvailableRides = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch available rides from the contract
      // For now, we'll just simulate it with some dummy data
      const allRides = await getUserRides();
      const availableRides = allRides.filter(ride => ride.status === RideStatus.Available);
      setRides(availableRides);
    } catch (err: any) {
      setError(err.message || 'Error fetching available rides');
      console.error('Error fetching available rides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: number) => {
    setAcceptingRideId(rideId);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await acceptRide(rideId);
      if (result) {
        setSuccessMessage(`You have successfully accepted ride #${rideId}`);
        // Remove the accepted ride from the list
        setRides(rides.filter(ride => ride.id !== rideId));
      } else {
        setError('Failed to accept ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error accepting ride');
      console.error('Error accepting ride:', err);
    } finally {
      setAcceptingRideId(null);
    }
  };

  // Check if userRole is explicitly not a Driver (we need to be sure it's not null)
  if (userRole !== null && userRole !== UserRole.Driver) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Car className="text-indigo-600" />
          Available Rides
        </h2>
        <div className="text-center py-4 text-gray-500">
          Only drivers can view and accept rides. Your role is Rider.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Car className="text-indigo-600" />
          Available Rides
        </h2>
        <button
          onClick={fetchAvailableRides}
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
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-red-700">
          {error}
        </div>
      )}
      
      {rides.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Loading available rides...' : 'No available rides at the moment'}
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">Ride #{ride.id}</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Available
                </span>
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
                    Requested {formatDistanceToNow(new Date(ride.timestamp * 1000), { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleAcceptRide(ride.id)}
                disabled={acceptingRideId === ride.id}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {acceptingRideId === ride.id ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Ride'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableRides; 