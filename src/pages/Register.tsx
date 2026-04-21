import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserRegistration from '../components/UserRegistration';
import { UserRole } from '../utils/web3';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterPageProps {
  walletAddress: string | null;
  onRegistered: (success: boolean, role?: UserRole) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ walletAddress, onRegistered }) => {
  const { roleType } = useParams<{ roleType: string }>();
  const navigate = useNavigate();
  
  // Map URL param to UserRole enum
  const selectedRole = roleType === 'driver' ? UserRole.Driver : UserRole.Rider;

  const handleRegistrationSuccess = (success: boolean, role?: UserRole) => {
    if (success) {
      onRegistered(true, role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to selection
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className={`h-4 w-full bg-gradient-to-r ${selectedRole === UserRole.Driver ? 'from-slate-800 to-slate-900' : 'from-indigo-600 to-purple-600'}`}></div>
            <div className="p-12">
              <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  Create {selectedRole === UserRole.Driver ? 'Driver' : 'Rider'} Account
                </h1>
                <p className="text-slate-500 font-medium">
                  Enter your details to register on the RideChain protocol.
                </p>
              </div>

              {/* We pass a modified version of UserRegistration or just the props */}
              <UserRegistration 
                walletAddress={walletAddress} 
                onRegistered={handleRegistrationSuccess}
                defaultRole={selectedRole} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
