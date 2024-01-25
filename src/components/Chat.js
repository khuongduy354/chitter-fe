import { useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "../helper/socket";
import { RESTQuery } from "../helper/restQuery";
import { Button, Divider, Flex, Input, message } from "antd";
import { ChatPanel } from "./ChatPanel";
import { AppContext } from "../App";

export const Chat = () => {
  const { user, setPanelMode } = useContext(AppContext);
  const searchRef = useRef(null);

  const [searchedUsers, setSearchedUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [friends, setFriends] = useState([]);
  const [currChatFriend, setCurrChatFriend] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [chatContent, setChatContent] = useState([]);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent([...chatContent, { content, from }]);
    });
  }, [chatContent]);

  useEffect(() => {
    async function getFriends() {
      const friends = await RESTQuery.getFriends(user.accessToken);
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

  //components
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
  const groupInput = useRef(null);
  const createGroup = async () => {
    const room = await RESTQuery.createGroup(
      user.accessToken,
      groupInput.current.value
    );
    if (room) {
      info("Group created");
    } else {
      info("Group creation failed");
    }
  };
  const searchGroup = async () => {
    const groups = await RESTQuery.searchGroups(groupInput.current.value);
    if (groups) setSearchedGroups(groups);
  };
  const joinGroup = async (gr) => {
    const joined = await RESTQuery.joinGroup(user.accessToken, gr.name);
    if (joined) {
      info("Joined group");
    } else {
      info("Join group failed");
    }
  };
  useEffect(() => {
    async function getMyGroups() {
      const myGroups = await RESTQuery.getMyGroups(user.accessToken);
      if (myGroups) setMyGroups(myGroups);
    }
    getMyGroups();
  }, []);

  const GroupPanel = () => {
    return (
      <div>
        <input ref={groupInput} />
        <Button onClick={createGroup}>Create Group</Button>
        <Button onClick={searchGroup}>Search Group</Button>

        {searchedGroups.length > 0 && (
          <div>
            <Divider>Search Results</Divider>
            <ul>
              {searchedGroups.map((gr, idx) => (
                <li key={idx}>
                  {gr.name} - {gr.id}
                  <Button onClick={() => joinGroup(gr)}>Chat</Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {myGroups.length > 0 && <Divider>My Groups</Divider>}
        <ul>
          {myGroups.map((gr, idx) => (
            <li key={idx}>
              {gr.name}
              <span> </span>
              <Button>Chat</Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {contextHolder}
      <Flex justify="space-around">
        <div>
          <UserPanel />
          <GroupPanel />
        </div>

        {currChatFriend && (
          <ChatPanel
            user={user}
            currChatFriend={currChatFriend}
            chatContent={chatContent}
          />
        )}
      </Flex>
      <Button onClick={() => setPanelMode("emoji")}>Emoji Panel</Button>
      <Button onClick={() => setPanelMode("theme")}>Theme Panel</Button>
    </div>
  );
};
