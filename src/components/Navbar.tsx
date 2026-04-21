import { Menu, Bell, User, Navigation2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick }) => {
  return (
    <nav className="h-16 bg-white shadow-sm border-b border-slate-100 z-50 relative">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Navigation2 className="w-8 h-8 text-indigo-600 fill-indigo-600" />
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text tracking-tighter">
            RideChain
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full relative">
            <Bell className="w-6 h-6 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-full"
          >
            <User className="w-6 h-6 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;