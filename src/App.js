import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import { UserProvider } from "./UserContext";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
