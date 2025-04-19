import { createContext, useContext, useState } from "react";
import { Button, Flex } from "antd";
import { ChatPanel } from "./ChatPanel";
import { AppContext } from "../../App";
import { UserPanel } from "./UserComponents/UserPanel";
import { PublicChatPanel } from "./PublicChatPanel";

export const ChatContext = createContext({
  currChatFriend: null,
  setCurrChatFriend: () => {},
});
export const Chat = () => {
  const { setPanelMode } = useContext(AppContext);
  const [currChatFriend, setCurrChatFriend] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null); // use this for theme
  const [username, setUsername] = useState("");

  return (
    <ChatContext.Provider
      value={{ currChatFriend, setCurrChatFriend, activeRoom, setActiveRoom }}
    >
      <Button onClick={() => setPanelMode("emoji")}>Emojis</Button>
      <Button onClick={() => setPanelMode("theme")}>Theme Edit</Button>
      <Button onClick={() => setPanelMode("market")}>Market</Button>
      <Button onClick={() => setPanelMode("mythemes")}>My Themes</Button>
      <Flex justify="space-around">
        <UserPanel username={username} setUserName={setUsername} />
        <PublicChatPanel username={username} />
        {/* <ChatPanel /> */}
      </Flex>
    </ChatContext.Provider>
  );
};
