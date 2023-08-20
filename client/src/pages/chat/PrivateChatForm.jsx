import { useState } from "react";
// import socket from "../../services/socket";
import { pusher } from "../../services/pusher";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../../auth/userContext";

function PrivateChatForm() {
  const { setUserData } = useAuthContext();
  const [password, setPassword] = useState("");
  const { chatName } = useParams();
  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_API_URL}/join-private`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatName,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { status, message } = data;
        if (status === "failure")
          return toast.error(message, { duration: 800 });
        pusher.subscribe(chatName);
        setUserData((prev) => {
          return {
            ...prev,
            chatsAccess: { ...prev.chatsAccess, [chatName]: true },
          };
        });
        toast.success(message);
      });

    // socket.emit("join-private", { password, chatName });
    // socket.once("private-joined", ({ status, message }) => {
    //   // console.log(result);
    //   if (status === "failure") return toast.error(message, { duration: 800 });
    //   setUserData((prev) => {
    //     return {
    //       ...prev,
    //       chatsAccess: { ...prev.chatsAccess, [chatName]: true },
    //     };
    //   });
    //   toast.success(message);
    // });
  }
  return (
    <form
      className="h-full w-full flex justify-center items-center flex-col p-2 gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-md md:text-2xl font-bold tracking-wider">
        Oops! This chat is private
      </h1>
      <p className="text-sm md:text-xl">Enter the password to gain access</p>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="password"
          placeholder="Enter password here"
          className="input input-primary input-bordered w-full max-w-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary cursor-pointer animate-none">
          Submit
        </button>
      </div>
    </form>
  );
}

export default PrivateChatForm;
