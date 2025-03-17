import React, { useState } from 'react';
import { Users, Copy, Check, Wallet, ArrowRight } from 'lucide-react';

interface SplitFareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fare: string;
}

const SplitFareModal: React.FC<SplitFareModalProps> = ({ isOpen, onClose, fare }) => {
  const [copied, setCopied] = useState(false);
  const [splits, setSplits] = useState(2);
  const fareValue = parseFloat(fare);
  const splitAmount = (fareValue / splits).toFixed(3);
  const shareUrl = `https://ridechain.app/split/${Math.random().toString(36).slice(2)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slideUp">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-800">Split Fare</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-600 mb-2">Total Fare</div>
            <div className="text-2xl font-bold text-slate-900">{fare} ETH</div>
          </div>

          <div>
            <label className="text-sm text-slate-600 mb-2 block">Number of People</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="4"
                value={splits}
                onChange={(e) => setSplits(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-medium text-slate-900">{splits}</span>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="text-sm text-indigo-600 mb-2">Each Person Pays</div>
            <div className="text-2xl font-bold text-indigo-700">{splitAmount} ETH</div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full pr-12 py-3 pl-4 bg-slate-50 rounded-xl text-slate-600"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <span>Send Invites</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitFareModal;