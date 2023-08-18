import React from "react";

function ChatBubble({ sender, text, currentUser }) {
  return (
    <div
      className={`chat ${sender === currentUser ? "chat-end" : "chat-start"}`}
    >
      <div className="chat-header p-1">
        {sender === currentUser ? "Me" : sender}
      </div>
      <div className="chat-bubble z-[-1]">{text}</div>
    </div>
  );
}

export default ChatBubble;
