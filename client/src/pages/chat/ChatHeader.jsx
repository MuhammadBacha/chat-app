import React from "react";
import Hamburger from "../../ui/Hamburger";
import ChatBar from "./ChatBar";
import { Link } from "react-router-dom";
import LogoutModal from "../../ui/LogoutModal";
import LogAgainModal from "../../ui/LogAgainModal";
import { useAuthContext } from "../../auth/userContext";

function ChatHeader() {
  const {
    userData: { username: currentUser },
  } = useAuthContext();
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <LogAgainModal />
      <div className="md:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="drawer-button">
            <Hamburger />
          </label>
        </div>
        <div className="drawer-side z-100">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-60 h-full bg-base-200 text-base-content">
            <ChatBar location={"drawer"} />
          </ul>
        </div>
      </div>
      <h1 className="hidden text-white text-2xl sm:inline-block font-bold tracking-wider p-2 md:text-3xl text-center">
        {currentUser}
      </h1>
      <Link replace>
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            window.logout_confirmation.showModal();
          }}
        >
          Log Out
        </button>
      </Link>
      <LogoutModal />
    </div>
  );
}

export default ChatHeader;
