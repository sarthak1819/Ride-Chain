import React from 'react';
import { Leaf, TreePine, Award } from 'lucide-react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

interface GreenRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  carbonSaved: number;
  treesPlanted: number;
}

const GreenRideModal: React.FC<GreenRideModalProps> = ({ isOpen, onClose, carbonSaved, treesPlanted }) => {
  const { width, height } = useWindowSize();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Confetti
        width={width}
        height={height}
        colors={['#22c55e', '#16a34a', '#15803d']}
        recycle={false}
        numberOfPieces={200}
      />
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slideUp relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 -translate-y-8 translate-x-8">
          <div className="w-full h-full bg-green-100 rounded-full opacity-50"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-slate-800">Green Ride Achievement!</h2>
          </div>

          <div className="space-y-6">
            <p className="text-slate-600">
              Thank you for choosing an eco-friendly ride! Your commitment to sustainable transportation makes a difference.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <TreePine className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{carbonSaved}kg</div>
                <div className="text-sm text-green-700">CO₂ Saved</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{treesPlanted}</div>
                <div className="text-sm text-green-700">Trees Planted</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-medium text-green-800 mb-2">Your Impact</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Monthly Savings</span>
                  <span className="font-medium text-green-800">{carbonSaved * 30}kg CO₂</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Community Rank</span>
                  <span className="font-medium text-green-800">Top 5%</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
            >
              Continue Making a Difference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenRideModal;