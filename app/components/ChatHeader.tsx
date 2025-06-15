import React, { useEffect } from 'react'
import { useChatStore } from '~/store/useChatStore'

function ChatHeader() {
    const {selectedUser , setSelectedUser} = useChatStore() ; 
     useEffect(()=>{
        selectedUser
     } , [ selectedUser])
    const getInitials = (name) => {
        if (!name) return '?'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }
    console.log(selectedUser);
  return (
    <div className='flex p-4'>
        <div className="relative">
                      {selectedUser.profilePic ? (
                        <img
                          src={selectedUser.profilePic}
                          alt={selectedUser.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center   font-semibold text-sm border-2 border-white shadow-sm">
                          {getInitials(selectedUser.fullName)}
                        </div>
                      )}
                      
                      {/* Online Status */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
    </div>
  )
}

export default ChatHeader