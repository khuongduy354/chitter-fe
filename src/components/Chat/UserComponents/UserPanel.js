import { useContext } from "react";
import { AppContext } from "../../../App";
import { FriendList } from "./FriendList";
import { GroupPanel } from "./GroupPanel";
import { SearchBar } from "./SearchBar";
import { supabase } from "../../Login";
import { Button } from "antd";

export const UserPanel = () => {
  const { user, setUser } = useContext(AppContext);
  const signOutGG = async () => {
    let { data, error } = await supabase.auth.signOut();
    if (!error) setUser(null);
  };
  return (
    <div>
      <h2>User: {user.email}</h2>
      {user && <Button onClick={(e) => signOutGG()}>Sign Out</Button>}
      <SearchBar />
      <FriendList />
      <GroupPanel />
    </div>
  );
};
