import { create } from 'zustand';
import {axiosInstance} from '../Hooks/useAxiosPublic';
import toast from 'react-hot-toast';
 

export const useAuthStore = create((set) => ({
 
  authUser: null,
  isSignUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isUpdatingProfile : false , 
 
  // Check authentication status
  checkAuth: async () => {
    try {
 
      const res = await axiosInstance.get("auth/api/check");
      set({ authUser: res.data });
      console.log("Auth user", res.data);
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
 
  // Set user data after successful registration and set redirect flag
  setRegisteredUser: (userData) => {
    set({
      authUser: userData,
      isSignUp: true,
       
    });
   
    console.log("User registered and set in store:", userData);
  },

  setLoginUser: (userData) => {
    set({
      authUser: userData,
      isSignUp: true,
       
    });
   
    console.log("User registered and set in store:", userData);
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
   
      const res = await axiosInstance.post("/auth/api/login", data ,);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      console.log("Logged in successfully");
       // ✅ RETURN user data and success flag
    return {
      success: true,
      user: res.data,
    };
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  } ,
 
  // Reset signup state
  resetSignupState: () => {
    set({ isSignUp: false });
  },
 

  resetLoginState: () => {
    set({ isLogging: false });
  },
 

  // Logout function

  logout: async () => {
    try {
 
      await axiosInstance.post("auth/api/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Error logging out", error);
    }
  },
 
  // Update user profile
  updateProfile : async (data) =>{
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("auth/api/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }

}))