import { Box } from "@chakra-ui/react";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={15}
      fontWeight="bold"
      bgColor="#38B2AC"
      cursor="pointer"
      onClick={handleFunction}
      display="flex"
    >
      {user.name}
      <CloseIcon />
    </Box>
  );
};

export default UserBadgeItem;
