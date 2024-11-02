import React, { useState, useEffect, useRef } from 'react';
import { IsTyping } from '../Firebase/IsTyping';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const MessageInput = ({ addMessage, conversationId }) => {
  const {currentUser} = useAuth()
  const [inputValue, setInputValue] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      addMessage(inputValue);
      setInputValue("");
      IsTyping(conversationId, false);
      clearTimeout(typingTimeoutRef.current);
    } else {
      toast.error("Please type somthing")
    }
  };

  const handleTyping = () => {

    IsTyping(conversationId, currentUser.uid);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }


    typingTimeoutRef.current = setTimeout(() => {
      IsTyping(conversationId, false);
    }, 2000);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    handleTyping();
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 justify-start">
      <input
        type="text"
        placeholder="Message"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
        className="flex-grow p-2 bg-gray-700 rounded-lg text-sm outline-none"
      />
      <button
        onClick={handleSend}
        className="p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.447 9.106a1 1 0 010 1.788l-14 7A1 1 0 012.038 16.725l1.429-5A1 1 0 014.429 11H9a1 1 0 100-2H4.429a1 1 0 01-.962-.725l-1.428-5a1 1 0 011.408-1.17l14 7z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;