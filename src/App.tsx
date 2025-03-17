import React, { useState, useEffect } from 'react';
import { MapPin, Navigation2, Clock, Wallet, Shield, Star, Menu, X, Bell } from 'lucide-react';
import Navbar from './components/Navbar';
import BookingPanel from './components/BookingPanel';
import Map from './components/Map';
import EmergencyButton from './components/EmergencyButton';
import UserProfile from './components/UserProfile';
import WalletConnect from './components/WalletConnect';
import UserRegistration from './components/UserRegistration';
import RequestRide from './components/RequestRide';
import RideHistory from './components/RideHistory';
import WithdrawFunds from './components/WithdrawFunds';
import TransactionHistory from './components/TransactionHistory';
import { UserRole, getCurrentUser } from './utils/web3';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Rider); // Default to Rider
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    
    // Try to get user info when wallet is connected
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (user && user.isRegistered) {
        setIsRegistered(true);
        setUserRole(UserRole.Rider); // Always set to Rider
        console.log("User connected and set as Rider");
      } else {
        setIsRegistered(false);
        setUserRole(UserRole.Rider); // Default to Rider
      }
    } catch (err) {
      console.error('Error getting user info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRegistered = (registered: boolean, role?: UserRole) => {
    setIsRegistered(registered);
    setUserRole(UserRole.Rider); // Always set to Rider
    console.log("Registration complete. Role set to Rider");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onProfileClick={() => setIsProfileOpen(true)} />
      
      <main className="relative h-[calc(100vh-4rem)]">
        <Map />
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="container mx-auto h-full">
            <div className="relative h-full">
              {/* Booking Panel */}
              <div className={`absolute top-4 left-4 pointer-events-auto transition-transform duration-300 ${isBookingOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>
                <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Ride Sharing dApp</h2>
                    <button 
                      onClick={() => setIsBookingOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {/* Wallet Connection */}
                  <WalletConnect onConnect={handleWalletConnect} />
                  
                  {/* User Registration */}
                  {walletAddress && !isRegistered && (
                    <UserRegistration 
                      walletAddress={walletAddress} 
                      onRegistered={handleUserRegistered} 
                    />
                  )}
                  
                  {/* Blockchain Interaction Tabs */}
                  {walletAddress && isRegistered && (
                    <div className="mt-6">
                      {isLoading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                          <p className="mt-2 text-gray-600">Loading user data...</p>
                        </div>
                      ) : (
                        <Tabs defaultValue="request">
                          <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger value="request">Request</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                            <TabsTrigger value="wallet">Wallet</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="request">
                            <RequestRide userRole={userRole} />
                          </TabsContent>
                          
                          <TabsContent value="history">
                            <RideHistory walletAddress={walletAddress} />
                          </TabsContent>
                          
                          <TabsContent value="wallet">
                            <div className="space-y-6">
                              <WithdrawFunds walletAddress={walletAddress} />
                              <TransactionHistory walletAddress={walletAddress} />
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Toggle Booking Button */}
              <button 
                onClick={() => setIsBookingOpen(true)}
                className={`absolute top-4 left-4 bg-white shadow-lg rounded-full p-3 pointer-events-auto transition-opacity duration-300 ${isBookingOpen ? 'opacity-0' : 'opacity-100'}`}
              >
                <Navigation2 className="w-6 h-6 text-indigo-600" />
              </button>

              {/* Emergency Button */}
              <div className="absolute bottom-8 right-8 pointer-events-auto">
                <EmergencyButton />
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* User Profile Slide-over */}
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

// Create simple Tabs components
const Tabs = ({ defaultValue, children }: { defaultValue: string, children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className="tabs" data-active={activeTab}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            activeTab, 
            setActiveTab 
          });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className || ''}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ 
  value, 
  children, 
  activeTab, 
  setActiveTab 
}: { 
  value: string, 
  children: React.ReactNode,
  activeTab?: string,
  setActiveTab?: (value: string) => void
}) => {
  return (
    <button
      className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
        activeTab === value 
          ? 'bg-white shadow text-indigo-700' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab && setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  value, 
  children,
  activeTab
}: { 
  value: string, 
  children: React.ReactNode,
  activeTab?: string
}) => {
  if (activeTab !== value) return null;
  
  return (
    <div className="mt-2">
      {children}
    </div>
  );
};

export default App;