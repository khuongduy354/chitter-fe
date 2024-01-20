import { useEffect, useRef, useState } from "react";
import { getSocket } from "../helper/socket";
import { RESTQuery } from "../helper/restQuery";
import { Button, Divider, Flex, message } from "antd";

export const Chat = ({ user }) => {
  const searchRef = useRef(null);
  const sendMsgRef = useRef(null);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [friends, setFriends] = useState([]);
  const [currChatFriend, setCurrChatFriend] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chatContent, setChatContent] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent([...chatContent, { content, from }]);
    });
  }, [chatContent]);

  useEffect(() => {}, [currChatFriend]);
  useEffect(() => {
    async function getFriends() {
      const friends = await RESTQuery.getFriends(user.accessToken);
      console.log(friends);
      if (friends) setFriends(friends);
    }
    getFriends();
  }, []);
  useEffect(() => {
    async function getFriendRequests() {
      const friendRequests = await RESTQuery.getFriendRequestsReceived(
        user.accessToken
      );
      if (friendRequests) setFriendRequests(friendRequests);
    }
    getFriendRequests();
  }, []);

  //helpers funcs
  const info = (data) => {
    messageApi.info(data);
  };
  const addFriendRequest = async (friend) => {
    if (friends.find((f) => f.id === friend.id)) return;
    const isOk = await RESTQuery.sendFriendRequest(friend.id, user.accessToken);
    if (isOk) {
      info("Friend request sent");
    } else {
      info("Friend request failed");
    }
  };
  const searchHandler = async () => {
    const newUser = await RESTQuery.searchFriend(searchRef.current.value);
    if (newUser) {
      if (!searchedUsers.find((f) => f.id === newUser.id)) {
        setSearchedUsers([...searchedUsers, newUser]);
      }
    } else {
      alert("No user found");
    }
  };
  const sendMsg = () => {
    const socket = getSocket();
    if (chatContent != null)
      socket.emit(
        "userChat",
        user.id,
        currChatFriend.id,
        sendMsgRef.current.value
      );
    sendMsgRef.current.value = "";
  };

  //components
  const ChatPanel = () => {
    return (
      <Flex className="RightBar" vertical justify="space-between">
        <h3>Chat with {currChatFriend.email}</h3>
        <ul style={{ listStyle: "none" }}>
          {chatContent.map((msg, idx) => {
            return (
              <li key={idx}>
                <Flex
                  justify={msg.from === user.id ? "flex-end" : "flex-start"}
                >
                  <span
                    style={{
                      backgroundColor: msg.from === user.id ? "blue" : "black",
                      padding: 10,
                      borderRadius: 20,
                      color: "white",
                      margin: 5,
                    }}
                  >
                    {msg.content}
                  </span>
                </Flex>
              </li>
            );
          })}
        </ul>
        <div className="msgSender">
          <input ref={sendMsgRef} type="text" />
          <Button type="primary" onClick={sendMsg}>
            Send
          </Button>
        </div>
      </Flex>
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
  const UserPanel = () => {
    const acceptFriend = async (freq) => {
      const isOk = await RESTQuery.acceptFriendRequest(user.accessToken, freq);
      if (isOk) {
        info("Friend request accepted!");
      } else {
        info("Friend request accept failed");
      }
    };
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
    const SearchBar = () => {
      return (
        <div>
          {searchedUsers.length > 0 && <Divider>Search Results</Divider>}
          <ul>
            {searchedUsers &&
              searchedUsers.map((friend) => {
                return (
                  <li key={friend.id}>
                    {friend.email} - {friend.name}
                    <span> </span>
                    <Button onClick={() => setCurrChatFriend(friend)}>
                      Chat
                    </Button>
                    <Button onClick={() => addFriendRequest(friend)}>
                      Request to add friend
                    </Button>
                  </li>
                );
              })}
          </ul>
        </div>
      );
    };
    return (
      <div>
        <h2>User: {user.email}</h2>
        <div className="LeftBar">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search Friend's email here"
          />
          <span> </span>
          <Button type="primary" onClick={searchHandler}>
            Search
          </Button>

          <SearchBar />
          <FriendList />
          <FriendRequestList />
        </div>
      </div>
    );
  };

  return (
    <div>
      {contextHolder}
      <Flex justify="space-around">
        <UserPanel />
        {currChatFriend && <ChatPanel />}
      </Flex>
    </div>
  );
};
