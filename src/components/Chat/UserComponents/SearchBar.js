import { useContext, useRef, useState } from "react";
import { ChatContext } from "../Chat";
import { RESTQuery } from "../../../helper/restQuery";
import { info } from "../../../helper/info";
import { Button, Input, List, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { AppContext } from "../../../contexts/AppContext";

export const SearchBar = () => {
  const { setCurrChatFriend } = useContext(ChatContext);
  const { user } = useContext(AppContext);

  const searchRef = useRef(null);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const searchHandler = async () => {
    const searchValue = searchRef.current.input.value;
    if (!searchValue.trim()) {
      info("Please enter a search term");
      return;
    }

    const newUser = await RESTQuery.searchFriend(searchValue);
    if (newUser) {
      if (!searchedUsers.find((f) => f.id === newUser.id)) {
        setSearchedUsers([...searchedUsers, newUser]);
      }
    } else {
      info("No user found");
    }
  };

  const addFriendRequest = async (friend) => {
    const isOk = await RESTQuery.sendFriendRequest(friend.id, user.accessToken);
    if (isOk) {
      info("Friend request sent");
    } else {
      info("Friend request failed");
    }
  };

  return (
    <div style={{ padding: "0 1rem", marginBottom: "1rem" }}>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          ref={searchRef}
          placeholder="Search user by email"
          onPressEnter={searchHandler}
        />
        <Button
          type="primary"
          onClick={searchHandler}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
      </Space.Compact>

      {searchedUsers.length > 0 && (
        <List
          style={{ marginTop: "1rem" }}
          size="small"
          dataSource={searchedUsers}
          renderItem={(friend) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  size="small"
                  onClick={() => setCurrChatFriend(friend)}
                >
                  Chat
                </Button>,
                <Button
                  type="link"
                  size="small"
                  onClick={() => addFriendRequest(friend)}
                >
                  Add Friend
                </Button>,
              ]}
            >
              <List.Item.Meta title={friend.email} description={friend.name} />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
