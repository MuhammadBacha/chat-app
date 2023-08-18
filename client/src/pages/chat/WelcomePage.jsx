import React from "react";

function WelcomePage() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-full w-full ">
      <h1 className="font-bold text-xl md:text-3xl">
        Welcome to the Chattin App!
      </h1>
      <p className="md:text-xl">Select a chat to start chattin right away!</p>
    </div>
  );
}

export default WelcomePage;
