import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import { useAuthContext } from "../../auth/userContext";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../../services/helpers";
import PrivateChatForm from "./PrivateChatForm";
import socket from "../../services/socket";
import WelcomePage from "./WelcomePage";

const chatNamesList = [
  { label: "Public", param: "", chatType: "public" },
  { label: "NUSTIANS", param: "nustians", chatType: "private" },
  { label: "GOODz", param: "goodz", chatType: "private" },
];

function ChatMessages() {
  const { chatName } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();
  const {
    userData: { username: currentUser, token, chatsAccess },
  } = useAuthContext();

  const access = chatsAccess[chatName];
  useEffect(() => {
    if (access || chatName) {
      setLoading(true);
      fetchMessages(token, chatName)
        .then((data) => {
          // console.log(data);
          setMessages(data.data || []);
        })
        .finally(() => setLoading(false));
    }

    socket.on("update-messages", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off("update-messages");
      setMessages([]); //reset state upon unmount
    };
  }, [chatName, access]);

  useEffect(() => {
    //auto scroll bottom whenever new message is added
    const chatWindow = chatRef.current;
    var height = chatWindow.scrollHeight;
    chatWindow.scrollTo(0, height);
  }, [messages, chatName, access]);

  return (
    <div
      ref={chatRef}
      className="w-full flex-1 border-2 border-solid border-primary rounded-lg p-4 overflow-auto text-white scroll-auto"
    >
      {!chatName ? (
        <WelcomePage />
      ) : !access ? (
        // the key is to reset the form, you know it
        <PrivateChatForm key={chatName} />
      ) : loading ? (
        <div className="flex h-full w-full justify-center items-center">
          <span className="loading loading-spinner block h-24 w-24 z-[-1]"></span>
        </div>
      ) : (
        messages.map((message) => (
          <ChatBubble
            sender={message.sender}
            text={message.text}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
}

export default ChatMessages;
