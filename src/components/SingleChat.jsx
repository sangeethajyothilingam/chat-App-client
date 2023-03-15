import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { config } from "../config";
import UserContext from "../UserContext.js";

import { getSender, getSenderFull } from "./ChatLogic.js";
import ProfileModal from "./ProfileModal.jsx";
import axios from "axios";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChat";

const ENDPOINT = "https://server-puce-kappa.vercel.app";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  let context = useContext(UserContext);
  const { selectChat, setSelectedChat } = context;

  const fetchMessages = async () => {
    if (!selectChat) return;
    try {
      const configs = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };
      const { data } = await axios.get(
        `${config.api}/message/${selectChat._id}`,

        configs
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectChat._id);
    } catch (err) {
      alert("Failed to load");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectChat;
  }, [selectChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const configs = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("app-token")} `,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${config.api}/message`,
          {
            content: newMessage,
            chatId: selectChat._id,
          },
          configs
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {}
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Mukta"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIosIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectChat.isGroupChat ? (
              <>
                {getSender(user, selectChat.users)}
                <ProfileModal user={getSenderFull(user, selectChat.users)} />
              </>
            ) : (
              <>
                {selectChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  user={user}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="single-message">
                <ScrollableChat messages={messages} user={user} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Mukta">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
