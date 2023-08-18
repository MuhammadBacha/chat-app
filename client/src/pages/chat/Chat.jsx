import { Outlet } from "react-router-dom";
import ChatBar from "./ChatBar";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
// import ChatMessages from "./ChatMessages";

function Chat() {
  return (
    <div className="h-screen flex lg:justify-center md:items-center">
      <div className="flex w-full lg: h-[90%] lg:w-[70%] gap-4  ">
        <ChatBar />
        <div className="flex flex-col w-full gap-4 h-full p-4">
          <ChatHeader />
          <Outlet /> {/*Chat messages are the outlet */}
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default Chat;
