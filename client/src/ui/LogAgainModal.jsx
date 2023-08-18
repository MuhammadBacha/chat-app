import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../auth/userContext";

function LogAgainModal() {
  const modalRef = useRef();
  const { resetData } = useAuthContext();

  useEffect(() => {
    const element = modalRef.current;
    const handleEscapeKeyPress = (event) => {
      if (event.key === "Escape") {
        // Prevent the default "Escape" key behavior i.e closing the dialog
        event.preventDefault();
      }
    };

    // Add event listener for "keydown" event

    element.addEventListener("keydown", handleEscapeKeyPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      element.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, []);

  return (
    <dialog id="log_again_modal" ref={modalRef} className="modal">
      <form className="modal-box w-3/4 md:w-full flex flex-col gap-2">
        <h3 className="font-bold text-xl">You are no longer authorized.</h3>
        <p className="py-4">Log in again to gain access.</p>
        <div className="flex justify-end">
          {/* button first to close modal */}
          <Link to="/login" replace>
            <button
              onClick={resetData}
              className="btn bg-red-700 hover:bg-white hover:text-red-700 text-white"
            >
              Log Again
            </button>
          </Link>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop darkish"></form>
    </dialog>
  );
}

export default LogAgainModal;
