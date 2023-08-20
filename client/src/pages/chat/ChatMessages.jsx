import { useEffect, useRef, useState } from "react";
import { pusher } from "../../services/pusher";
import ChatBubble from "./ChatBubble";
import { useAuthContext } from "../../auth/userContext";
import { useParams } from "react-router-dom";
import { fetchMessages } from "../../services/helpers";
import PrivateChatForm from "./PrivateChatForm";
import socket from "../../services/socket";
import WelcomePage from "./WelcomePage";

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
    // const channel = pusher.subscribe("public");
    // channel.bind("message", (message) => {
    //   console.log(message);
    // });
    socket.on("update-messages", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off("update-messages");
      // channel.unbind("message");
      // setMessage ([]); //reset state upon unmount
    };
  }, [chatName, access]);

  // ------------------------- COULD BE USEFUL -----------------------------------------
  // useEffect(() => {
  //   if (access || chatName) {
  //     setLoading(true);
  //     fetchMessages(token, chatName)
  //       .then((data) => {
  //         // console.log(data);
  //         setMessages(data.data || []);
  //       })
  //       .finally(() => setLoading(false));
  //   }

  //   pusher.subscribe("public");

  //   pusher.bind("message", (newMessage) => {
  //     console.log(newMessage);
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   });
  //   // socket.on("update-messages", (newMessage) => {
  //   // });
  //   return () => {
  //     // socket.off("update-messages");
  //     // channel?.unbind("message");
  //     pusher.unsubscribe("public");
  //     pusher.unbind("message");
  //     // setMessage ([]); //reset state upon unmount
  //   };
  // }, [chatName, access]);

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
