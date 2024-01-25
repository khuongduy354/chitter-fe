import { useContext } from "react";
import { AppContext } from "../../../App";
import { FriendList } from "./FriendList";
import { GroupPanel } from "./GroupPanel";
import { SearchBar } from "./SearchBar";

export const UserPanel = () => {
  const { user } = useContext(AppContext);
  return (
    <div>
      <h2>User: {user.email}</h2>
      <SearchBar />
      <FriendList />
      <GroupPanel />
    </div>
  );
};
