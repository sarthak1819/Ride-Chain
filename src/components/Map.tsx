import React from 'react';
import { motion } from 'framer-motion';

const Map: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0a0c10] relative overflow-hidden">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Moving Lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '-100%', y: `${20 * i}%` }}
            animate={{ x: '100%' }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
          />
        ))}
      </div>

      {/* Pulsing Nodes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            className="absolute w-4 h-4 bg-indigo-500 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Center Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent"></div>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[120px] font-black text-white/5 tracking-tighter uppercase select-none"
          >
            RideChain
          </motion.div>
          <div className="text-indigo-500/20 text-sm font-black uppercase tracking-[1em] mt-[-40px]">
            Protocol Active
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;