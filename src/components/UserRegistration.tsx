import React, { useState, useEffect } from 'react';
import { UserCircle, User, Loader2 } from 'lucide-react';
import { registerUser, getCurrentUser, UserRole } from '../utils/web3';

interface UserRegistrationProps {
  walletAddress: string | null;
  onRegistered: (isRegistered: boolean, role?: UserRole) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ walletAddress, onRegistered }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (walletAddress) {
        try {
          const user = await getCurrentUser();
          console.log("User data from blockchain:", user);
          if (user && user.isRegistered) {
            setIsRegistered(true);
            setCurrentUser(user);
            console.log("User is registered with role:", user.role === UserRole.Rider ? "Rider" : "Driver");
            onRegistered(true, user.role);
          } else {
            setIsRegistered(false);
            onRegistered(false);
          }
        } catch (err) {
          console.error('Error checking user registration:', err);
        }
      }
    };

    checkUserRegistration();
  }, [walletAddress, onRegistered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!name) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Always register as a Rider (UserRole.Rider = 0)
      console.log("Registering user as Rider");
      const success = await registerUser(name, phoneNumber || 'Not provided', UserRole.Rider);
      if (success) {
        setIsRegistered(true);
        const user = await getCurrentUser();
        console.log("User registered successfully. Data from blockchain:", user);
        setCurrentUser(user);
        onRegistered(true, UserRole.Rider);
      } else {
        setError('Failed to register user');
      }
    } catch (err: any) {
      setError(err.message || 'Error registering user');
      console.error('Error registering user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered && currentUser) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserCircle className="text-indigo-600" />
          Rider Profile
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="text-gray-500" size={18} />
            <span className="font-medium">Name:</span> {currentUser.name}
          </div>
          {currentUser.phoneNumber && currentUser.phoneNumber !== 'Not provided' && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Phone:</span> {currentUser.phoneNumber}
            </div>
          )}
          {currentUser.totalRatings > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Rating:</span> {currentUser.rating} ({currentUser.totalRatings} ratings)
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserCircle className="text-indigo-600" />
        Quick Rider Registration
      </h2>
      
      {!walletAddress ? (
        <div className="text-center py-4 text-gray-500">
          Please connect your wallet to register
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your phone number (optional)"
            />
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
                Registering...
              </>
            ) : (
              'Register as Rider'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserRegistration; 