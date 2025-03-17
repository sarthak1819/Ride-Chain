import React, { useState, useEffect } from 'react';
import { Shield, Phone, X, AlertTriangle, Share2 } from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyActivated, setEmergencyActivated] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { name: 'John Doe', phone: '911', relationship: 'Emergency Services' },
    { name: 'Jane Smith', phone: '+1 234-567-8900', relationship: 'Emergency Contact' },
    { name: 'Local Police', phone: '911', relationship: 'Law Enforcement' },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      activateEmergency();
    }
    return () => clearInterval(timer);
  }, [showModal, countdown]);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    setShowModal(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  const cancelEmergency = () => {
    setShowModal(false);
    setCountdown(5);
    setEmergencyActivated(false);
  };

  const activateEmergency = () => {
    setEmergencyActivated(true);
    setShowModal(false);
    // Here you would typically:
    // 1. Send emergency signal to backend
    // 2. Start location tracking
    // 3. Alert emergency contacts
    // 4. Contact emergency services
  };

  const handleContactClick = (contact: EmergencyContact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <>
      <button
        onClick={handleEmergencyPress}
        className={`
          group relative p-4 rounded-full shadow-lg
          ${emergencyActivated 
            ? 'bg-red-600 animate-pulse' 
            : isPressed 
              ? 'bg-red-700'
              : 'bg-white hover:bg-red-50'}
          transition-all duration-300
        `}
      >
        <Shield className={`w-6 h-6 ${emergencyActivated ? 'text-white' : 'text-red-600'}`} />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {emergencyActivated ? 'Emergency Active' : 'Emergency Button'}
        </span>
      </button>

      {/* Emergency Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Emergency Alert</h2>
              </div>
              <button onClick={cancelEmergency} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                Emergency services will be contacted in <span className="font-bold text-red-600">{countdown}</span> seconds.
                Press cancel if this was a mistake.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelEmergency}
                  className="flex-1 py-2 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={activateEmergency}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Activate Now
                </button>
              </div>

              <button
                onClick={() => setShowContacts(!showContacts)}
                className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <span className="text-slate-600">Emergency Contacts</span>
                <Share2 className="w-5 h-5 text-slate-400" />
              </button>

              {showContacts && (
                <div className="space-y-2 pt-2">
                  {emergencyContacts.map((contact, index) => (
                    <button
                      key={index}
                      onClick={() => handleContactClick(contact)}
                      className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{contact.name}</div>
                        <div className="text-sm text-slate-500">{contact.relationship}</div>
                      </div>
                      <Phone className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Active Notification */}
      {emergencyActivated && (
        <div className="fixed bottom-24 right-8 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Services Contacted</span>
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;