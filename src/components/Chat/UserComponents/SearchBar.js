import { useContext, useRef, useState } from "react";
import { ChatContext } from "../Chat";
import { RESTQuery } from "../../../helper/restQuery";
import { info } from "../../../helper/info";
import { Button, Divider } from "antd";
import { AppContext } from "../../../App";

export const SearchBar = () => {
  const { setCurrChatFriend } = useContext(ChatContext); // allow chatting stranger
  const { user } = useContext(AppContext);

  const searchRef = useRef(null);
  const [searchedUsers, setSearchedUsers] = useState([]);
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
  const addFriendRequest = async (friend) => {
    // if (friends.find((f) => f.id === friend.id)) return;
    const isOk = await RESTQuery.sendFriendRequest(friend.id, user.accessToken);
    if (isOk) {
      info("Friend request sent");
    } else {
      info("Friend request failed");
    }
  };
  return (
    <div>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search Friend's email here"
      />
      <Button type="primary" onClick={searchHandler}>
        Search
      </Button>

      {searchedUsers.length > 0 && <Divider>Search Results</Divider>}
      <ul>
        {searchedUsers &&
          searchedUsers.map((friend) => {
            return (
              <li key={friend.id}>
                {friend.email} - {friend.name}
                <span> </span>
                <Button onClick={() => setCurrChatFriend(friend)}>Chat</Button>
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
