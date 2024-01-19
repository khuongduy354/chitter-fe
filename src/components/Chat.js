import { useEffect, useRef, useState } from "react";
import { getSocket } from "../helper/socket";
import { RESTQuery } from "../helper/restQuery";
import { Button, Divider, Flex } from "antd";

export const Chat = ({ user }) => {
  const searchRef = useRef(null);
  const sendMsgRef = useRef(null);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currChatFriend, setCurrChatFriend] = useState(null);
  const [chatContent, setChatContent] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent([...chatContent, { content, from }]);
    });
  }, [chatContent]);

  useEffect(() => {}, [currChatFriend]);

  //helpers funcs
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
      <ul>
        {friends.map((friend, idx) => {
          <li key={idx}>
            {friend.email}
            <span> </span>
            <Button onClick={() => setCurrChatFriend(friend)}>Chat</Button>
          </li>;
        })}
      </ul>
    );
  };
  const UserPanel = () => {
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
                  </li>
                );
              })}
          </ul>

          <FriendList />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Flex justify="space-around">
        <UserPanel />
        {currChatFriend && <ChatPanel />}
      </Flex>
    </div>
  );
};
