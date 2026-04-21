import React, { useState } from 'react';
import { Car, Zap, Users, Crown, Navigation, Shield, Wallet, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export interface RideOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  time: string;
  seats: number;
}

const RideOptions: React.FC<{ baseFare: string, onSelect: (price: string) => void }> = ({ baseFare, onSelect }) => {
  const [selectedId, setSelectedId] = useState('standard');
  const base = parseFloat(baseFare);

  const options: RideOption[] = [
    {
      id: 'pool',
      name: 'RideChain Pool',
      icon: <Users size={20} />,
      price: (base * 0.6).toFixed(4),
      time: '15 min',
      seats: 2,
    },
    {
      id: 'standard',
      name: 'RideChain Standard',
      icon: <Car size={20} />,
      price: base.toFixed(4),
      time: '8 min',
      seats: 4,
    },
    {
      id: 'premium',
      name: 'RideChain Black',
      icon: <Crown size={20} />,
      price: (base * 1.6).toFixed(4),
      time: '4 min',
      seats: 4,
    },
    {
      id: 'electric',
      name: 'RideChain Volt',
      icon: <Zap size={20} />,
      price: (base * 1.2).toFixed(4),
      time: '10 min',
      seats: 4,
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Protocol Tier</span>
        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">
          <Shield size={10} />
          Insured
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedId(option.id);
              onSelect(option.price);
            }}
            className={`w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all group relative overflow-hidden ${
              selectedId === option.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-2xl transition-colors ${selectedId === option.id ? 'bg-white/20' : 'bg-white shadow-sm text-indigo-600'}`}>
                {option.icon}
              </div>
              <div className="text-left">
                <div className="font-black text-sm tracking-tight">{option.name}</div>
                <div className={`text-[10px] font-bold flex items-center gap-2 ${selectedId === option.id ? 'text-white/70' : 'text-slate-400'}`}>
                  <Clock size={10} />
                  {option.time} • {option.seats} seats
                </div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-lg tracking-tighter">{option.price}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${selectedId === option.id ? 'text-white/70' : 'text-slate-400'}`}>
                ETH
              </div>
            </div>
          </motion.button>
        ))}
      </div>

    </div>
  );
};

export default RideOptions;