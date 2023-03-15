import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import UserContext from "../UserContext.js";
import { config } from "../config";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading.jsx";
import { getSender } from "./ChatLogic.js";
import GroupChatModal from "./GroupChatModal.jsx";

const MyChats = ({ user, fetchAgain }) => {
  let context = useContext(UserContext);
  const [loggedUser, setLoggedUser] = useState("");
  const { selectChat, setSelectedChat, chats, setChats } = context;

  const fetchChats = async () => {
    try {
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };
      const { data } = await axios.get(`${config.api}/chat`, configs);
      setChats(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Mukta"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
