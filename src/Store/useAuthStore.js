import { create } from "zustand";
import { axiosInstance } from "../utils/axiosClient";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (err) {
            console.log("Error in checkAuth:", err.message);
            set({ authUser: null });
            localStorage.removeItem("authToken"); // Clear token
            toast.error("Session expired. Please log in again.");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningup: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            localStorage.setItem("authToken", res.data.token); // Store token
            toast.success("Account created successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred during signup");
        } finally {
            set({ isSigningup: false });
        }
    },

    login: async(data)=>{
        set({isLoggingIng:true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser: res.data})
            toast.success("logged in successfully")
        } catch (err) {
            toast.error(err.response?.data?.message)
            
        }finally{
            set({isLoggingIng:false})
        }
    },

    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("logged out successfully")
        } catch (err) {
            toast.error(err.response?.data?.message)
            
        }
    }
}));
