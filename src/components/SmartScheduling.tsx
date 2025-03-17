import React, { useState } from 'react';
import { Calendar, Clock, Repeat, Zap, AlertTriangle } from 'lucide-react';
import { format, addDays, isPast, isToday } from 'date-fns';
import { motion } from 'framer-motion';

interface SmartSchedulingProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (time: Date) => void;
}

const SmartScheduling: React.FC<SmartSchedulingProps> = ({ isOpen, onClose, onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const predictedDemand = (time: string): 'low' | 'medium' | 'high' => {
    const hour = parseInt(time.split(':')[0]);
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) return 'high';
    if ((hour >= 11 && hour <= 13) || (hour >= 19 && hour <= 21)) return 'medium';
    return 'low';
  };

  const getDemandColor = (demand: 'low' | 'medium' | 'high') => {
    switch (demand) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
    }
  };

  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-800">Smart Scheduling</h2>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
          <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            {nextDays.map((date) => (
              <motion.button
                key={date.toISOString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex-shrink-0 w-16 h-20 mx-1 rounded-xl flex flex-col items-center justify-center
                  ${selectedDate.toDateString() === date.toDateString()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}
                  transition-colors
                `}
              >
                <span className="text-xs font-medium">
                  {isToday(date) ? 'Today' : format(date, 'EEE')}
                </span>
                <span className="text-2xl font-bold mt-1">{format(date, 'd')}</span>
              </motion.button>
            ))}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
            {generateTimeSlots().map((time) => {
              const demand = predictedDemand(time);
              const isDisabled = isPast(new Date(selectedDate.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))));

              return (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isDisabled}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-3 rounded-xl text-center relative
                    ${selectedTime === time
                      ? 'bg-indigo-600 text-white'
                      : isDisabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}
                  `}
                >
                  <span className="text-sm font-medium">{time}</span>
                  <div className={`text-xs mt-1 ${selectedTime === time ? 'text-indigo-200' : getDemandColor(demand)}`}>
                    {demand === 'low' && <Zap className="w-3 h-3 mx-auto" />}
                    {demand === 'medium' && <Clock className="w-3 h-3 mx-auto" />}
                    {demand === 'high' && <AlertTriangle className="w-3 h-3 mx-auto" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Recurring Options */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <Repeat className="w-5 h-5 text-slate-400" />
            <select className="flex-1 bg-transparent border-none text-slate-600 focus:ring-0">
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="workdays">Workdays</option>
            </select>
          </div>

          {/* Smart Suggestions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700">Smart Suggestions</h3>
            <div className="flex gap-2">
              {['08:00', '12:30', '17:00'].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(time)}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm hover:bg-indigo-100 transition"
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const [hours, minutes] = selectedTime.split(':').map(Number);
                const scheduledDate = new Date(selectedDate);
                scheduledDate.setHours(hours, minutes);
                onSchedule(scheduledDate);
              }}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Schedule Ride
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartScheduling;