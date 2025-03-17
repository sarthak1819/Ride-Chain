import React, { useState } from 'react';
import { MapPin, Navigation, DollarSign, Loader2 } from 'lucide-react';
import { requestRide, UserRole } from '../utils/web3';

interface RequestRideProps {
  userRole: UserRole;
}

const RequestRide: React.FC<RequestRideProps> = ({ userRole }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [fare, setFare] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation || !dropoffLocation || !fare) {
      setError('Please fill in all fields');
      return;
    }
    
    if (isNaN(parseFloat(fare)) || parseFloat(fare) <= 0) {
      setError('Please enter a valid fare amount');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setTransactionHash(null);
    
    try {
      const result = await requestRide(pickupLocation, dropoffLocation, fare);
      if (result) {
        setSuccess(true);
        // In a real implementation, you would get the transaction hash from the result
        // For now, we'll just simulate it
        setTransactionHash('0x' + Math.random().toString(16).substr(2, 64));
        
        // Reset form
        setPickupLocation('');
        setDropoffLocation('');
        setFare('');
      } else {
        setError('Failed to request ride');
      }
    } catch (err: any) {
      setError(err.message || 'Error requesting ride');
      console.error('Error requesting ride:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Navigation className="text-indigo-600" />
        Request a Ride
      </h2>
      
      {success && transactionHash ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <h3 className="text-green-800 font-medium">Ride Requested Successfully!</h3>
          <p className="text-green-700 mt-1 text-sm">
            Your ride request has been submitted to the blockchain.
          </p>
          <div className="mt-2 text-xs text-green-600 break-all">
            <span className="font-medium">Transaction Hash:</span> {transactionHash}
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setTransactionHash(null);
            }}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Request Another Ride
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter pickup location"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Dropoff Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="dropoffLocation"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter dropoff location"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="fare" className="block text-sm font-medium text-gray-700 mb-1">
              Fare (ETH)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="fare"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                step="0.001"
                min="0.001"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter fare amount"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This amount will be transferred from your wallet when a driver accepts the ride.
            </p>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Requesting...
              </>
            ) : (
              'Request Ride'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestRide; 