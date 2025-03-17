import React from 'react';

const Map: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-100">
      <div className="w-full h-full" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'grayscale(0.5) brightness(0.9)'
      }} />
    </div>
  );
}

export default Map;