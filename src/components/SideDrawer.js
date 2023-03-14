import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import UserContext from "../UserContext.js";
import ProfileModal from "./ProfileModal.jsx";
import axios from "axios";
import { config } from "../config";
import ChatLoading from "./ChatLoading.jsx";
import UserListItem from "./UserListItem.jsx";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let context = useContext(UserContext);
  const { selectChat, setSelectedChat, chats, setChats } = context;
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  useEffect(() => {
    let newer = window.localStorage.getItem("User");
    let newUser = JSON.parse(newer);
    setUser(newUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("app-token");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter a search term");
    }
    try {
      setLoading(true);
      const configs = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };

      const { data } = await axios.get(
        `${config.api}/users/allUsers?search=${search}`,
        configs
      );
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      alert(err);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const configs = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("app-token")} `,
        },
      };
      const { data } = await axios.post(
        `${config.api}/chat`,
        { userId },
        configs
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen} variant="ghost">
            <SearchIcon style={{ color: "black" }} />
            <Text color="black" d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Mukta" fontWeight="bold">
          My Lucky Messenger
        </Text>
        <div style={{ display: "flex" }}>
          <Menu>
            <MenuButton p={1}>
              <NotificationsIcon />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<KeyboardArrowDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
