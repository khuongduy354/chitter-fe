import { useContext, useEffect, useRef, useState } from "react";
import { RESTQuery } from "../../../helper/restQuery";
import { Button, Divider } from "antd";
import { AppContext } from "../../../App";
import { info } from "../../../helper/info";

export const GroupPanel = () => {
  const { user } = useContext(AppContext);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

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
