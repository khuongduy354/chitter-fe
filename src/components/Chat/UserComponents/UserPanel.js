import { useContext, useState } from "react";
import { AppContext } from "../../../App";
import { FriendList } from "./FriendList";
import { GroupPanel } from "./GroupPanel";
import { SearchBar } from "./SearchBar";
import { supabase } from "../../Login";
import { Button, Input } from "antd";
import { Header } from "antd/es/layout/layout";

export const UserPanel = ({ username, setUsername }) => {
  const { user, setUser } = useContext(AppContext);
  const signOutGG = async () => {
    let { data, error } = await supabase.auth.signOut();
    if (!error) setUser(null);
  };
  return (
    <div>
      <div>
        <h2>
          User: <span>{username}</span>
          <Input onChange={(e) => setUsername(e.target.value)} />
        </h2>

        {user && <Button onClick={(e) => signOutGG()}>Sign Out</Button>}
        {/* <SearchBar /> */}
        {/* <FriendList /> */}
        {/* <GroupPanel /> */}
      </div>
    </div>
  );
};
