import { MessageSquare, Settings, User, LogOut, Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "~/store/useAuthStore";
import { useThemeStore } from "~/store/useThemeStore";
const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
   const {authUser , logout} = useAuthStore()
   const {theme} = useThemeStore();
   console.log(theme);
  return (
    <header className="fixed w-full top-0 z-40">
      {/* Glass morphism effect */}
      <div data-theme={theme} className={`absolute inset-0   backdrop-blur-lg z-0`}></div>
      
      {/* Animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative z-10">
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-lg shadow-lg shadow-violet-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 inline-block text-transparent bg-clip-text">Chatty</h1>
          </Link>

          
          
          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {/* Notification bell with indicator */}
            <div className="relative p-2 rounded-full hover:bg-violet-500/10 transition-all cursor-pointer">
              <Bell className="size-5 text-fuchsia-600" />
              <span className="absolute top-1 right-1 size-2 bg-pink-500 rounded-full"></span>
            </div>
            
            {/* Toggle dark/light mode */}
            <div 
              className="p-2 rounded-full hover:bg-violet-500/10 transition-all cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? 
                <Sun className="size-5 text-fuchsia-600" /> : 
                <Moon className="size-5 text-fuchsia-600" />
              }
            </div>
            
            {/* Settings button */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-violet-500/10 transition-all cursor-pointer">
              <Settings className="size-4 text-fuchsia-600" />
              <Link to={'settingsPage'} className="text-sm font-medium">Settings</Link>
            </div>
            
            {/* User profile button with fancy gradient border */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 transition-all cursor-pointer border border-transparent hover:border-fuchsia-500/30">
              <User className="size-4 text-fuchsia-600" />
              <Link to = {'profilePage'} className="text-sm font-medium">Profile</Link>
            </div>
            
            {/* Logout button with gradient background */}
           {
            authUser ?   <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white shadow-md shadow-violet-500/30 transition-all cursor-pointer">
            <LogOut className="size-4" />
            <button onClick={logout} className="text-sm font-medium hidden sm:inline">Logout</button>
          </div> :   <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white shadow-md shadow-violet-500/30 transition-all cursor-pointer">
              <LogOut className="size-4" />
              <Link to={'signup'} className="text-sm font-medium hidden sm:inline">signup</Link>
            </div>
           }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;