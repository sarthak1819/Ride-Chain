import React, { useState } from 'react';
import { Car, Zap, Users, Crown, Leaf, Timer, Coins, Shield, Wallet, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import GreenRideModal from './GreenRideModal';
import SplitFareModal from './SplitFareModal';
import LoyaltyBadge from './LoyaltyBadge';
import SmartScheduling from './SmartScheduling';

interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  time: string;
  seats: number;
  features?: string[];
  isGreen?: boolean;
  discount?: string;
  surge?: number;
  loyaltyPoints?: number;
}

const RideOptions: React.FC<{ onSelect: (option: RideOption) => void }> = ({ onSelect }) => {
  const [showGreenModal, setShowGreenModal] = useState(false);
  const [showSplitFareModal, setShowSplitFareModal] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RideOption | null>(null);
  const currentHour = new Date().getHours();
  const isPeakHour = currentHour >= 7 && currentHour <= 9 || currentHour >= 16 && currentHour <= 18;
  const [showLoyaltyInfo, setShowLoyaltyInfo] = useState(false);

  const options: RideOption[] = [
    {
      id: 'standard',
      name: 'Standard',
      icon: <Car className="w-6 h-6" />,
      price: '0.015 ETH',
      time: '12 min',
      seats: 4,
      surge: isPeakHour ? 1.2 : 1,
      features: ['Standard Comfort', 'Regular Route'],
      loyaltyPoints: 50
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="w-6 h-6" />,
      price: '0.025 ETH',
      time: '10 min',
      seats: 4,
      features: ['Luxury Vehicle', 'Priority Route', 'Professional Driver'],
      loyaltyPoints: 100
    },
    {
      id: 'pool',
      name: 'Pool',
      icon: <Users className="w-6 h-6" />,
      price: '0.010 ETH',
      time: '15 min',
      seats: 2,
      discount: '30% off',
      features: ['Share Ride', 'Eco-friendly', 'Budget Option'],
      loyaltyPoints: 75
    },
    {
      id: 'electric',
      name: 'Electric',
      icon: <Zap className="w-6 h-6" />,
      price: '0.018 ETH',
      time: '14 min',
      seats: 4,
      isGreen: true,
      features: ['Zero Emissions', 'Quiet Ride', 'Climate Action'],
      loyaltyPoints: 150
    },
  ];

  const handleOptionSelect = (option: RideOption) => {
    setSelectedOption(option);
    if (option.isGreen) {
      setShowGreenModal(true);
    } else {
      onSelect(option);
    }
  };

  const handleSchedule = (time: Date) => {
    setShowScheduling(false);
    // Handle scheduled ride logic here
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        {isPeakHour && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700"
          >
            <Timer className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Peak hours: Prices may be higher</p>
          </motion.div>
        )}
        <LoyaltyBadge points={1250} level="gold" onClick={() => setShowLoyaltyInfo(!showLoyaltyInfo)} />
      </div>

      {showLoyaltyInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl mb-4"
        >
          <h3 className="font-medium text-indigo-900 mb-2">Loyalty Benefits</h3>
          <div className="space-y-2 text-sm text-indigo-700">
            <div className="flex justify-between">
              <span>Current Balance</span>
              <span className="font-medium">1,250 points</span>
            </div>
            <div className="flex justify-between">
              <span>Next Reward</span>
              <span className="font-medium">250 points to Free Ride</span>
            </div>
            <div className="flex justify-between">
              <span>Member Status</span>
              <span className="font-medium">Gold (20% bonus)</span>
            </div>
          </div>
        </motion.div>
      )}

      {options.map((option) => (
        <motion.button
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionSelect(option)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition group relative overflow-hidden"
        >
          {option.discount && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {option.discount}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg transition ${option.isGreen ? 'bg-green-100 group-hover:bg-green-200' : 'bg-slate-100 group-hover:bg-indigo-100'}`}>
              {option.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-slate-900">{option.name}</div>
              <div className="text-sm text-slate-500">{option.time} away</div>
              {option.features && (
                <div className="flex gap-2 mt-2">
                  {option.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
              {option.loyaltyPoints && (
                <div className="mt-2 text-xs text-indigo-600">
                  +{option.loyaltyPoints} points
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-slate-900">
              {option.surge && option.surge > 1 ? (
                <>
                  <span className="text-sm line-through text-slate-400 mr-2">{option.price}</span>
                  <span className="text-red-600">{(parseFloat(option.price) * option.surge).toFixed(3)} ETH</span>
                </>
              ) : (
                option.price
              )}
            </div>
            <div className="text-sm text-slate-500">{option.seats} seats</div>
          </div>
        </motion.button>
      ))}

      <GreenRideModal
        isOpen={showGreenModal}
        onClose={() => {
          setShowGreenModal(false);
          if (selectedOption) onSelect(selectedOption);
        }}
        carbonSaved={2.5}
        treesPlanted={1}
      />

      <SplitFareModal
        isOpen={showSplitFareModal}
        onClose={() => setShowSplitFareModal(false)}
        fare={selectedOption?.price || '0.015 ETH'}
      />

      <SmartScheduling
        isOpen={showScheduling}
        onClose={() => setShowScheduling(false)}
        onSchedule={handleSchedule}
      />

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSplitFareModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
        >
          <Users className="w-5 h-5" />
          <span>Split Fare with Friends</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowScheduling(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule a Ride</span>
        </motion.button>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Price guaranteed</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span>ETH or USDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideOptions;