import { useEffect, useState } from "react";
import { FriendTab } from "./FriendTab";
import { getSocket } from "../helper/socket";

export const Chat = ({ user }) => {
  const [friendTab, showFriendTab] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("initConnection", user.id);
  }, []);

  return (
    <div>
      <h1>Chat Page</h1>
      <h2>{user.email}</h2>
      <div className="LeftBar">
        <h3>Search Friends</h3>
        <button
          onClick={() => {
            showFriendTab(true);
          }}
        >
          Add Friends
        </button>

        {friendTab && <FriendTab showFriendTab={showFriendTab} />}

        <ul>
          <li>Chat tab</li>
          <li>Chat tab</li>
          <li>Chat tab</li>
          <li>Chat tab</li>
        </ul>
      </div>

      <div className="RightBar">
        Content here
        <ul>
          <li>Chat msg</li>
          <li>Chat msg</li>
          <li>Chat msg</li>
          <li>Chat msg</li>
        </ul>
      </div>
    </div>
  );
};
