import { Menu, Bell, User, Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick }) => {
  return (
    <nav className="h-20 z-50 relative pt-4">
      <div className="container mx-auto px-4">
        <div className="glass-panel h-14 rounded-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <Navigation2 className="w-8 h-8 text-indigo-400 fill-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            <span className="text-2xl font-black neon-text tracking-tighter hover:animate-pulse">
              RideChain
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 text-slate-300 transition-all rounded-full relative hover:scale-110">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]"></span>
            </button>
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all rounded-full"
            >
              <User className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold text-slate-300">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;