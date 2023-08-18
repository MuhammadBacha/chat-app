import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "react-hot-toast";
import VerifyFirst from "./auth/VerifyFirst";
import Protect from "./auth/Protect";
import ChatMessages from "./pages/chat/ChatMessages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <VerifyFirst>
              <Login />
            </VerifyFirst>
          }
          path="/login"
        />
        <Route
          element={
            <Protect>
              <Chat />
            </Protect>
          }
          path="/"
        >
          <Route path="" element={<ChatMessages />} />
          <Route path=":chatName" element={<ChatMessages />} />
        </Route>
        <Route
          element={
            <VerifyFirst>
              <Signup />
            </VerifyFirst>
          }
          path="/signup"
        ></Route>
      </Routes>
      <Toaster
        position="top-center"
        containerStyle={{
          fontWeight: "bold",
          textAlign: "center",
          padding: "1.5rem",
        }}
        toastOptions={{
          success: {
            style: {
              duration: 3000,
            },
          },
          error: {
            duration: 5000,
          },
        }}
      />
    </BrowserRouter>
  );
}
export default App;
