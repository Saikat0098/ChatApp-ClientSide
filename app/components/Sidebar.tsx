import React, { useEffect, useState } from 'react'
import { Search, Users, MessageCircle, Settings, MoreHorizontal, Phone, Video } from 'lucide-react'
import { useChatStore } from '~/store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton'

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const filteredUsers = users?.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getTimeAgo = (date) => {
    if (!date) return ''
    const now = new Date()
    const messageTime = new Date(date)
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  if (isUsersLoading) {
    return <SidebarSkeleton />
  }

  return (
    <div className="h-full w-80  
     border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 " />
            </div>
            <div>
              <h1 className="text-xl font-bold  ">Messages</h1>
              <p className="text-sm text-gray-500">{filteredUsers.length} conversations</p>
            </div>
          </div>
        
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4  " />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3  border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold  flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Recent Chats
            </h2>
            <span className="text-xs  px-2 py-1 rounded-full">
              {filteredUsers.length}
            </span>
          </div>

          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12  mx-auto mb-4" />
                <p className="  text-lg font-medium">No conversations yet</p>
                <p className="  text-sm">Start a new chat to see it here</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 group   ${
                    selectedUser?._id === user._id
                      ? '  border-2 border-blue-200 shadow-sm'
                      : 'border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center   font-semibold text-sm border-2 border-white shadow-sm">
                          {getInitials(user.fullName)}
                        </div>
                      )}
                      
                      {/* Online Status */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold  truncate max-w-40">
                          {user.fullName || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(user.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm   truncate max-w-32">
                          {user.lastMessage || user.email || 'No messages yet'}
                        </p>
                        
                        {user.unreadCount > 0 && (
                          <span className="  text-xs font-bold px-2 py-1 rounded-full min-w-5 h-5 flex items-center justify-center">
                            {user.unreadCount > 99 ? '99+' : user.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons (visible on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
                        <Phone className="w-4 h-4 " />
                      </button>
                     
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedUser?._id === user._id && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">
              {filteredUsers.filter(u => u.isOnline).length} online
            </span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View All
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar