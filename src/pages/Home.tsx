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
    <div className="min-h-[calc(100vh-64px)] bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

      <div className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-2 px-4 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-6 uppercase tracking-widest"
          >
            The Future of Mobility is Here
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
          >
            Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Ridesharing</span> for Everyone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto"
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
              <div className="p-8 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-white max-w-md w-full">
                <WalletConnect onConnect={onConnect} />
                <p className="mt-4 text-sm text-slate-400 font-medium italic">
                  MetaMask is required to interact with the blockchain.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
            >
              <button
                onClick={() => navigate('/register/rider')}
                className="group p-10 bg-white rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-500 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={80} />
                </div>
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">I'm a Rider</h3>
                <p className="text-slate-500 font-medium leading-snug">Book secure rides with transparent pricing.</p>
              </button>

              <button
                onClick={() => navigate('/register/driver')}
                className="group p-10 bg-slate-900 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                  <Car size={80} />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Car size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">I'm a Driver</h3>
                <p className="text-slate-400 font-medium leading-snug">Earn ETH by providing rides to your community.</p>
              </button>
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h4>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
