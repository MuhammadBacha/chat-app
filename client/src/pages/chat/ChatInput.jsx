import React, { useState } from "react";

import { useAuthContext } from "../../auth/userContext";
import { useParams } from "react-router-dom";
// import socket from "../../services/socket";

function ChatInput() {
  const { chatName } = useParams();
  const {
    userData: { username: currentUser, chatsAccess },
  } = useAuthContext();
  const access = chatsAccess[chatName];
  const [currentMessage, setCurrentMessage] = useState("");
  function handleMessage() {
    if (!currentMessage || !chatName) return;
    fetch(`${import.meta.env.VITE_API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: currentUser,
        chatName,
        text: currentMessage,
        sentAt: new Date(),
      }),
    }).then((res) => res.json());

    // socket.emit("message", {
    //   text: currentMessage,
    //   sender: currentUser,
    //   chatName: chatName,
    // });
    setCurrentMessage("");
  }
  return (
    <form
      className="flex flex-col sm:flex-row gap-2 justify-around w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        className="input input-bordered input-primary w-full text-white"
        value={currentMessage}
        placeholder="type here"
        disabled={!access}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        type="submit"
        className=" btn btn-primary font-semibold normal-case tracking-wide"
        disabled={!access}
        onClick={handleMessage}
      >
        Send Message
      </button>
    </form>
  );
}

export default ChatInput;
