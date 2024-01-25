import { useState, useContext, useEffect } from "react";
import { RESTQuery } from "../../../helper/restQuery";
import { info } from "../../../helper/info";
import { AppContext } from "../../../App";
import { Button, Divider } from "antd";
import { ChatContext } from "../Chat";

export const FriendList = () => {
  const { user } = useContext(AppContext);
  const { currChatfriend, setCurrChatFriend } = useContext(ChatContext);

  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    getFriendRequests();
  }, []);

  //helpers funcs
  async function getFriendRequests() {
    const friendRequests = await RESTQuery.getFriendRequestsReceived(
      user.accessToken
    );
    if (friendRequests) setFriendRequests(friendRequests);
  }
  async function getFriends() {
    const friends = await RESTQuery.getFriends(user.accessToken);
    if (friends) setFriends(friends);
  }
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

  //components
  const FriendRequestList = () => {
    return (
      <div>
        {friendRequests.length > 0 && <Divider>Friend Requests</Divider>}
        <ul style={{ listStyle: "none" }}>
          {friendRequests.map((freq, idx) => {
            return (
              <li key={idx}>
                {freq.from}
                <span> </span>
                <Button onClick={() => acceptFriend(freq)}>Accept</Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  const FriendList = () => {
    return (
      <div>
        {friends.length > 0 && <Divider>Friends</Divider>}
        <ul>
          {friends.map((friend, idx) => {
            return (
              <li key={idx}>
                {friend.email}
                <span> </span>
                <Button onClick={() => setCurrChatFriend(friend)}>Chat</Button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <FriendList />
      <FriendRequestList />
    </div>
  );
};
