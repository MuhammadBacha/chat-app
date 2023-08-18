import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../auth/userContext";

function LogoutModal() {
  const { resetData } = useAuthContext();
  return (
    <dialog id="logout_confirmation" className="modal">
      <form method="dialog" className="modal-box w-3/4 md:w-full flex flex-col">
        <h3 className="font-bold text-xl">Are you sure you want to Log out?</h3>
        <p className="py-4">This action is irreversible.</p>
        <div className="flex justify-end gap-2">
          <button className="btn btn-primary hover:bg-white hover:text-primary">
            Cancel
          </button>
          <Link to="/login" replace>
            <button
              onClick={resetData}
              className="btn bg-red-700 hover:bg-white hover:text-red-700 text-white"
            >
              Confirm
            </button>
          </Link>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop darkish">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default LogoutModal;
