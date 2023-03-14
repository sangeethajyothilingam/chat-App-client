import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import UserContext from "../UserContext.js";
import UserBadgeItem from "./UserBadgeItem.jsx";
import axios from "axios";
import { config } from "../config";
import UserListItem from "./UserListItem.jsx";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  user,
  fetchMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  let context = useContext(UserContext);
  const { selectChat, setSelectedChat, chats } = context;

  const handleRemove = async (user1) => {
    if (selectChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("only admins can remove someone!");
    }
    try {
      setLoading(true);
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };

      const { data } = await axios.put(
        `${config.api}/chat/groupRemove`,
        {
          chatId: selectChat._id,
          userId: user1._id,
        },
        configs
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (err) {
      alert("Error Occurred !");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };

      const { data } = await axios.put(
        `${config.api}/chat/rename`,
        {
          chatId: selectChat._id,
          chatName: groupChatName,
        },
        configs
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      alert("Error Occured!");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")}`,
        },
      };

      const { data } = await axios.get(
        `${config.api}/users/allUsers?search=${query}`,
        configs
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      alert("Failed top Load the Search Results");
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectChat.users.find((u) => u._id === user1._id)) {
      alert("User Already in group!");
    }
    if (selectChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone !");
    }
    try {
      setLoading(true);
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };

      const { data } = await axios.put(
        `${config.api}/chat/groupAdd`,
        {
          chatId: selectChat._id,
          userId: user1._id,
        },
        configs
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      alert("Error Occurred !");
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<RemoveRedEyeIcon />}
        onClick={onOpen}
      ></IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Mukta"
            display="flex"
            justifyContent="center"
          >
            {selectChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
