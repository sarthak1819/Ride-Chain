import React, { useState } from 'react';
import { MapPin, Navigation2, Clock, Wallet, X, ArrowLeft } from 'lucide-react';
import RideOptions from './RideOptions';
import DriverCard from './DriverCard';

interface BookingPanelProps {
  onClose: () => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({ onClose }) => {
  const [step, setStep] = useState<'location' | 'options' | 'driver'>('location');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  
  const handleContinue = () => {
    if (step === 'location') setStep('options');
    else if (step === 'options') setStep('driver');
  };

  const handleBack = () => {
    if (step === 'options') setStep('location');
    else if (step === 'driver') setStep('options');
  };

  return (
    <div className="w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {step !== 'location' && (
              <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-slate-800">
              {step === 'location' && 'Book a Ride'}
              {step === 'options' && 'Select Ride Type'}
              {step === 'driver' && 'Your Driver'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {step === 'location' && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Pickup location"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Navigation2 className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">Now</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                <Wallet className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">ETH</span>
              </button>
            </div>

            <button 
              onClick={handleContinue}
              disabled={!pickup || !destination}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'options' && (
          <div className="space-y-4">
            <RideOptions onSelect={() => handleContinue()} />
          </div>
        )}

        {step === 'driver' && (
          <div className="space-y-4">
            <DriverCard
              name="Michael Chen"
              rating={4.92}
              car="Tesla Model 3 - White"
              plate="ETH 2023"
              eta="3 minutes"
              image="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80"
              onMessage={() => {}}
              onCall={() => {}}
            />
            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-slate-500">Trip Details</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Pickup</span>
                <span className="font-medium text-slate-900">{pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Destination</span>
                <span className="font-medium text-slate-900">{destination}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Estimated fare:</span>
          <span className="font-medium">0.015 ETH</span>
        </div>
      </div>
    </div>
  );
}

export default BookingPanel;