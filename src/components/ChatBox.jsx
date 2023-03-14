import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import UserContext from "../UserContext.js";
import SingleChat from "./SingleChat.jsx";

const ChatBox = ({ fetchAgain, setFetchAgain, user }) => {
  let context = useContext(UserContext);
  const { selectChat } = context;

  return (
    <Box
      display={{ base: selectChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        user={user}
      />
    </Box>
  );
};

export default ChatBox;
