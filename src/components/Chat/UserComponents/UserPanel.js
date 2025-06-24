import { Flex, Input } from "antd";
import { SearchBar } from "./SearchBar";
import { FriendList } from "./FriendList";

export const UserPanel = ({ username, setUserName }) => {
  return (
    <Flex
      vertical
      gap="small"
      style={{
        padding: "1rem",
        minWidth: "200px",
        maxHeight: "400px",
        overflowY: "auto",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <Flex vertical gap="small" style={{ width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>User Profile</h2>
        <Input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "100%" }}
        />
      </Flex>
      <SearchBar />
      <FriendList />
      {/* <GroupPanel /> */}
    </Flex>
  );
};
