import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

const initialState = {
  username: "",
  isAuthenticated: "",
  token: "",
  chatsAccess: {
    public: true,
    nustians: false,
    goodz: false,
  },
};

// Don't want to save chatsAccess in localStorage

function getInitialState() {
  // if everyone is empty then return initialState
  if (
    Object.keys(initialState)
      .filter((state) => state !== "chatsAccess")
      .every((field) => JSON.parse(window.localStorage.getItem(field)) === "")
  ) {
    return initialState;
  }
  return Object.keys(initialState).reduce((acc, field) => {
    // chats access should not get null upon refresh, rather it should the the same as in initialState
    if (field === "chatsAccess") acc[field] = initialState[field];
    else acc[field] = JSON.parse(window.localStorage.getItem(field));
    return acc;
  }, {});
}

export default function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(getInitialState);

  // Whenever, the state changes, update the localStorage too
  useEffect(() => {
    Object.keys(initialState)
      .filter((state) => state !== "chatsAccess")
      .forEach((field) => {
        window.localStorage.setItem(field, JSON.stringify(userData[field]));
      });
  }, [userData]);

  return (
    <userContext.Provider value={{ userData, setUserData }}>
      {children}
    </userContext.Provider>
  );
}

export function useAuthContext() {
  function resetData() {
    setUserData(initialState);
  }
  const { userData, setUserData } = useContext(userContext);
  return { userData, setUserData, resetData };
}
