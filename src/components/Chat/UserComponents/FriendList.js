import { useState, useContext, useEffect, useCallback } from "react";
import { RESTQuery } from "../../../helper/restQuery";
import { info } from "../../../helper/info";
import { AppContext } from "../../../contexts/AppContext";
import { Button, List } from "antd";
import { ChatContext } from "../Chat";
import { SearchBar } from "./SearchBar";

export const FriendList = () => {
  const { user } = useContext(AppContext);
  const { setCurrChatFriend } = useContext(ChatContext);

  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const getFriendRequests = useCallback(async () => {
    const friendRequests = await RESTQuery.getFriendRequestsReceived(
      user.accessToken
    );
    if (friendRequests) setFriendRequests(friendRequests);
  }, [user.accessToken]);

  const getFriends = useCallback(async () => {
    const friends = await RESTQuery.getFriends(user.accessToken);
    if (friends) setFriends(friends);
  }, [user.accessToken]);

  useEffect(() => {
    getFriends();
    getFriendRequests();
  }, [getFriends, getFriendRequests]);

  const acceptFriend = async (freq) => {
    const isOk = await RESTQuery.acceptFriendRequest(user.accessToken, freq);
    if (isOk) {
      info("Friend request accepted!");
      getFriendRequests();
      getFriends();
    } else {
      info("Friend request accept failed");
    }
  };

  return (
    <div
      style={{
        width: "250px",
        borderRight: "2px solid #d1d5db",
        padding: "1rem",
        backgroundColor: "#ffffff",
      }}
    >
      <SearchBar />
      {friendRequests.length > 0 && (
        <List
          itemLayout="horizontal"
          dataSource={friendRequests}
          renderItem={(freq) => (
            <List.Item
              style={{
                padding: "0.75rem",
                marginBottom: "0.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                backgroundColor: "#f9fafb",
              }}
            >
              <List.Item.Meta
                title={freq.email}
                description={freq.email + " sent you a friend request"}
              />
              <Button type="primary" onClick={() => acceptFriend(freq)}>
                Accept
              </Button>
            </List.Item>
          )}
        />
      )}
      <List
        itemLayout="horizontal"
        dataSource={friends}
        renderItem={(friend) => (
          <List.Item
            onClick={() => setCurrChatFriend(friend)}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              color: "#374151",
            }}
            className="friend-list-item"
          >
            <List.Item.Meta
              title={<span style={{ color: "#374151" }}>{friend.email}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
