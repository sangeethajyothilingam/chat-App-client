import React, { useState, useEffect } from "react";
import { createContext } from "react";

let UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [selectChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  return (
    <UserContext.Provider
      value={{
        selectChat,
        setSelectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
