import React from "react";

const Message = ({ message }) => {
  if (!message.text) return null;

  return (
    <div className={`mx-6 mt-4 p-4 rounded-lg ${
      message.type === "success" 
        ? "bg-green-100 text-green-800 border border-green-200" 
        : "bg-red-100 text-red-800 border border-red-200"
    }`}>
      {message.text}
    </div>
  );
};

export default Message;