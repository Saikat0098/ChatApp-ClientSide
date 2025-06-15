import { useRef, useState } from "react";
import {
  Camera,
  Edit,
  LogOut,
  Mail,
  User,
  Calendar,
  Star,
  MessageCircle,
  Settings,
  Bell,
} from "lucide-react";
import { useAuthStore } from "~/store/useAuthStore";
import { useThemeStore } from "~/store/useThemeStore";
export default function ProfilePage() {
 
  const { authUser: user , updateProfile, isUpdatingProfile } = useAuthStore();
  const { theme } = useThemeStore();
  //  const [userInfo , setUserInfo] = useState()
  console.log("Auth user profile", user);

  // const userInfo = authUser.filter( user => user.fullName);
  console.log("Auth user profile", user?.fullName);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const [selectedImage , setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const handleEditSubmit = () => {
    setUser({ ...editForm });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setIsImageLoading(true);
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target.result;
  
      img.onload = async () => {
        const MAX_WIDTH = 300; // চাইলে 200-500px এর মধ্যে রাখো
        const scaleSize = MAX_WIDTH / img.width;
        const canvas = document.createElement("canvas");
  
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6); 
        // 0.6 = 60% quality; চাইলে 0.3 বা 0.4 করো আরও কম সাইজের জন্য
  
        setSelectedImage(compressedBase64);
        await updateProfile({ profilePic: compressedBase64 });
  
        console.log("Compressed Base64 String loaded");
        setIsImageLoading(false);
      };
    };
  
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br   text-white p-6 mt-22">
      {/* Header */}

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-purple-800 to-pink-900 rounded-2xl p-6 shadow-lg shadow-pink-900/30 backdrop-blur-sm border border-pink-700/30">
          {/* Profile Header */}
          <div className="flex flex-col items-center relative">
      <div className="relative group mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-pink-700/50 shadow-lg shadow-pink-600/20">
          {isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : selectedImage || user?.profilePic ? (
            <img
              src={selectedImage || user?.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={72} />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          disabled={isUpdatingProfile || isImageLoading}
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          disabled={isUpdatingProfile || isImageLoading}
          className={`absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-pink-600 p-2 rounded-full shadow-lg transition-transform ${
            isUpdatingProfile || isImageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          <Camera size={18} />
        </button>
      </div>
      <div className="text-center mb-6 w-full">
        {isEditing ? (
          <input
            type="text"
            name="fullName"
            value={user?.fullName || ''}
            onChange={handleInputChange}
            className="bg-purple-900/50 text-white text-xl font-bold text-center p-2 rounded-lg mb-2 w-full border border-pink-500/30 focus:border-pink-400 focus:outline-none"
          />
        ) : (
          <h2 className="text-2xl font-bold mb-1">
            {user?.fullName || 'User'}
          </h2>
        )}
        <div className="flex items-center justify-center gap-2 text-pink-300 mb-3">
          <Mail size={14} />
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={ user?.email || ''}
              onChange={handleInputChange}
              className="bg-purple-900/50 text-white text-sm text-center p-1 rounded-lg w-full border border-pink-500/30 focus:border-pink-400 focus:outline-none"
            />
          ) : (
            <span>{user?.email || 'email@example.com'}</span>
          )}
        </div>
        
      </div>
 
    </div>

          {/* Account Information */}
          <div className="space-y-4 bg-purple-900/40 p-5 rounded-xl backdrop-blur-sm border border-pink-700/20">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="h-4 w-1 bg-pink-500 rounded-full"></span>
              Account Information
            </h3>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-sm">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-pink-300 text-xs">Member Since</p>
                
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-sm">
                <Star size={16} />
              </div>
              <div className="flex-1">
                <p className="text-pink-300 text-xs">Account Status</p>
    
              </div>
            </div>
          </div>

          
        </div>

        {/* Activity Section */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-2xl p-5 shadow-lg shadow-pink-900/30 backdrop-blur-sm border border-pink-700/30">
              <h3 className="text-pink-300 text-sm mb-2">Conversations</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">248</span>
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full">
                  <MessageCircle size={18} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-2xl p-5 shadow-lg shadow-pink-900/30 backdrop-blur-sm border border-pink-700/30">
              <h3 className="text-pink-300 text-sm mb-2">Cosmic Points</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">1,245</span>
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full">
                  <Star size={18} />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-2xl p-5 shadow-lg shadow-pink-900/30 backdrop-blur-sm border border-pink-700/30">
              <h3 className="text-pink-300 text-sm mb-2">Connections</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold">56</span>
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full">
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-purple-800 to-pink-900 rounded-2xl p-6 shadow-lg shadow-pink-900/30 backdrop-blur-sm border border-pink-700/30 flex-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="h-4 w-1 bg-pink-500 rounded-full"></span>
              Recent Cosmic Activity
            </h3>

            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 bg-purple-900/40 rounded-xl border border-pink-700/20"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Cosmic Friend #{i + 1}</h4>
                      <span className="text-xs text-pink-300">2h ago</span>
                    </div>
                    <p className="text-sm text-pink-100/80">
                      Sent you a cosmic message from the{" "}
                      {i % 2 === 0 ? "Andromeda" : "Milky Way"} galaxy
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 bg-purple-900/70 rounded-xl hover:bg-purple-800 transition-colors text-sm">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
