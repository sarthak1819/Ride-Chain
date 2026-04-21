import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, User, Shield, Zap, Globe } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';

interface HomeProps {
  walletAddress: string | null;
  onConnect: (address: string) => void;
}

const Home: React.FC<HomeProps> = ({ walletAddress, onConnect }) => {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Instant Booking", desc: "No middleman, just pure peer-to-peer connection." },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Payments", desc: "Escrowed payments ensure both parties are protected." },
    { icon: <Globe className="w-6 h-6" />, title: "Fully Decentralized", desc: "Owned by the community, powered by Ethereum." }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-70 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-50 animate-[pulse_3s_infinite]"></div>

      <div className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-2 px-6 rounded-full glass-panel shadow-[0_0_20px_rgba(99,102,241,0.3)] text-indigo-300 font-bold text-sm mb-8 uppercase tracking-widest"
          >
            The Future of Mobility is Here
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.1] drop-shadow-2xl"
          >
            Decentralized <span className="neon-text animate-glow">Ridesharing</span> for Everyone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light"
          >
            Connect your wallet, choose your role, and start your journey on the world's most secure P2P transport network.
          </motion.p>

          {!walletAddress ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-10 glass-panel rounded-[3rem] max-w-md w-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <WalletConnect onConnect={onConnect} />
                  <p className="mt-6 text-sm text-slate-500 font-medium italic">
                    MetaMask is required to interact with the blockchain.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
            >
              <button
                onClick={() => navigate('/register/rider')}
                className="group p-10 glass-panel rounded-[3rem] text-left relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <User size={100} className="text-white" />
                </div>
                <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300">
                  <User size={40} />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">I'm a Rider</h3>
                <p className="text-slate-400 font-medium leading-snug text-lg">Book secure rides with transparent cryptocurrency pricing.</p>
              </button>

              <button
                onClick={() => navigate('/register/driver')}
                className="group p-10 glass-panel rounded-[3rem] text-left relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Car size={100} className="text-white" />
                </div>
                <div className="w-20 h-20 bg-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300">
                  <Car size={40} />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">I'm a Driver</h3>
                <p className="text-slate-400 font-medium leading-snug text-lg">Earn ETH by providing high-speed decentralized transport.</p>
              </button>
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              whileHover={{ y: -10 }}
              className="text-center group glass-panel p-8 rounded-[2.5rem] cursor-default"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] group-hover:border-indigo-400 transition-all duration-500">
                {f.icon}
              </div>
              <h4 className="text-2xl font-bold text-slate-100 mb-4">{f.title}</h4>
              <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
