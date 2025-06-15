import {create} from 'zustand';
import {axiosInstance} from '../Hooks/useAxiosPublic';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [], 
    selectedUser: null,
    isLoading: false,
    isMessageLoading: false,
 
     getUsers : async ()=>{
        set({isLoading: true});
        try {
            const response = await axiosInstance.get('message/api/users');
            set({users: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            set({isLoading: false});
        }
     } , 
        getMessages: async (userId ) => {
            set({isMessageLoading: true});
            try {
                const response = await axiosInstance.get(`message/api/${userId}`);
                set({message: response.data, isMessageLoading: false, selectedUser: userId});
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error('Failed to fetch messages');
                set({isMessageLoading: false});
            }
        },
    
        setMessages: async(messages) =>{
        //  const {selectedUser , messages} = get()
         try {
             const response = await axiosInstance.post(`message/api/send${selectedUser._id}`, {messages})
                set({messages: [...messages, response.data]});
         } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
            console.log("Failed to send message'");
         }
        } ,

        setSelectedUser: (selectedUser : string) => set({ selectedUser }),
     
}))