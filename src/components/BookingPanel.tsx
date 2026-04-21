import React, { useState } from 'react';
import { Navigation, Wallet, X, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import RideOptions from './RideOptions';
import { requestRide } from '../utils/web3';

import { searchLocation, calculateDistance, calculateFare } from '../utils/location';

interface BookingPanelProps {
  onClose: () => void;
  onSuccess?: () => void;
  onTrack?: () => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({ onClose, onSuccess, onTrack }) => {
  const [step, setStep] = useState<'location' | 'options' | 'requesting' | 'success'>('location');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPricing, setIsPricing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fare, setFare] = useState('0.015');
  const [distance, setDistance] = useState<number>(0);
  
  const handleContinue = async () => {
    if (step === 'location') {
      setIsPricing(true);
      setError(null);
      try {
        const pickupLoc = await searchLocation(pickup);
        const dropoffLoc = await searchLocation(destination);
        
        if (!pickupLoc) {
          setError(`Could not find pickup location: "${pickup}"`);
          return;
        }
        if (!dropoffLoc) {
          setError(`Could not find destination: "${destination}"`);
          return;
        }
        
        const dist = calculateDistance(pickupLoc.lat, pickupLoc.lon, dropoffLoc.lat, dropoffLoc.lon);
        setDistance(dist);
        
        // Base price 0.005 ETH + 0.001 ETH per KM
        const calculatedFare = calculateFare(dist, 0.005, 0.001);
        setFare(calculatedFare);
        
        setStep('options');
      } catch (err) {
        setError('Protocol failed to scan coordinates. Please try again.');
      } finally {
        setIsPricing(false);
      }
    } else if (step === 'options') {
      handleRequestRide();
    }
  };

  const handleRequestRide = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Submitting ride request for ${fare} ETH...`);
      const success = await requestRide(pickup, destination, fare);
      if (success) {
        setStep('success');
        if (onSuccess) onSuccess();
      } else {
        // Error is already handled by alerts in web3.ts, but we set it here for UI
        setError('Transaction failed. Check MetaMask.');
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'options') setStep('location');
  };

  return (
    <div className="w-[400px] bg-white/95 backdrop-blur-md rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-white/20">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {step === 'options' && (
              <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {step === 'location' && 'Where to?'}
              {step === 'options' && 'Select Ride'}
              {step === 'success' && 'Ride Requested!'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {step === 'location' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                </div>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup (e.g. Colaba, Mumbai)"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-700 font-bold"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 rounded-sm bg-purple-500"></div>
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination (e.g. Charni Road)"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-700 font-bold"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            <button 
              onClick={handleContinue}
              disabled={!pickup || !destination || isPricing}
              className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isPricing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SCANNING COORDINATES...
                </>
              ) : (
                'CHECK PROTOCOL PRICES'
              )}
            </button>
          </div>
        )}

        {step === 'options' && (
          <div className="flex flex-col h-[500px]">
            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4">
               <Navigation className="w-4 h-4 text-indigo-600" />
               <span className="text-xs font-black text-indigo-900 uppercase tracking-tight">
                 Est. Distance: {distance.toFixed(2)} KM
               </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4">
              <RideOptions baseFare={fare} onSelect={(selectedFare) => {
                console.log("Fare selected:", selectedFare);
                if (selectedFare) setFare(selectedFare);
              }} />
            </div>
            
            <div className="pt-6 mt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Fee</span>
                  <span className="text-sm font-bold text-slate-800">0.0005 ETH</span>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Fare</span>
                  <span className="text-lg font-black text-indigo-600 leading-none">{fare} ETH</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-shake border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              <button 
                onClick={() => {
                  console.log("Request button clicked!");
                  handleRequestRide();
                }}
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    INITIATING PROTOCOL...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    CONFIRM & PAY
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center space-y-8"
          >
            <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl shadow-green-500/40 relative">
               <CheckCircle size={48} />
               <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-green-500 rounded-[2rem]"
               />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">Protocol Secured</h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Awaiting Driver Acceptance</p>
            </div>
            
            <div className="space-y-4 px-4">
              <button 
                onClick={onTrack}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
              >
                <Navigation size={20} />
                TRACK TRIP STATUS
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-50 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                DONE
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {step !== 'success' && (
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium tracking-wide uppercase text-xs">Payment Method</span>
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" className="w-4 h-4" alt="ETH" />
              MetaMask Wallet
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPanel;