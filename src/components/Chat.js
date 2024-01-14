import { useState } from "react";
import { FriendTab } from "./FriendTab";

export const Chat = () => {
  const [friendTab, showFriendTab] = useState(false);
  return (
    <div>
      <h1>Chat Page</h1>

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
