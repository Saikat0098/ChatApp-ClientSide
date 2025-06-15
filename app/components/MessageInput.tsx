import { Paperclip, Send } from 'lucide-react';
import React, { useRef, useState } from 'react'

function MessageInput() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [imagePreview , setImagePreview] = useState(null);
  const fileInputRef = useRef(null) ;
   const maxChars = 1000;

 
  const handleImageChange = (e)=>{

  }

  const removeImg = ()=>{

  }

  const handleSend = () => {
    if (message.trim() === '') return;
    // Logic to send the message
    console.log('Sending message:', message);
    setMessage('');
  };
  return (
    <div className="  bg-gray-50 flex items-end justify-center p-4">
    <div className="w-full max-w-2xl">
      {/* Message Input Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-end gap-3">
          {/* Attachment Button */}
          <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input Area */}
          <div className="flex-1 relative">
            <textarea
              value={message}
               onChange={(e) =>setMessage(e.target.value)}
              // onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full resize-none border-0 outline-none text-gray-900 placeholder-gray-400 text-base leading-relaxed min-h-[24px] max-h-32 overflow-y-auto"
              rows="1"
              style={{
                height: 'auto',
                minHeight: '24px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          {/* Character Count */}
          <div className="flex-shrink-0 text-xs text-gray-400 font-medium">
            {message.length}/{maxChars}
          </div>

          {/* Send Button */}
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-shrink-0 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Emoji/Reaction Bar */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
          <button className="text-xl hover:scale-110 transition-transform">🤍</button>
          <button className="text-xl hover:scale-110 transition-transform">❤️</button>
          <button className="text-xl hover:scale-110 transition-transform">👍</button>
          <button className="text-xl hover:scale-110 transition-transform">😊</button>
          <button className="text-xl hover:scale-110 transition-transform">🎉</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MessageInput