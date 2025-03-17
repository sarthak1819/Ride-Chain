import React from 'react';
import { Star, MessageCircle, Phone } from 'lucide-react';

interface DriverCardProps {
  name: string;
  rating: number;
  car: string;
  plate: string;
  eta: string;
  image: string;
  onMessage: () => void;
  onCall: () => void;
}

const DriverCard: React.FC<DriverCardProps> = ({
  name,
  rating,
  car,
  plate,
  eta,
  image,
  onMessage,
  onCall,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 animate-slideUp">
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">{name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-slate-600">{rating}</span>
            </div>
          </div>
          <div className="text-sm text-slate-500 mt-1">{car}</div>
          <div className="text-sm font-medium text-slate-700 mt-1">{plate}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Arriving in <span className="font-medium text-slate-700">{eta}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMessage}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onCall}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;