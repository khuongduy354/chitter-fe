import { createContext, useContext, useState } from "react";
import { Button, Flex } from "antd";
import { ChatPanel } from "./ChatPanel";
import { AppContext } from "../../App";
import { UserPanel } from "./UserComponents/UserPanel";

export const ChatContext = createContext({
  currChatFriend: null,
  setCurrChatFriend: () => {},
});
export const Chat = () => {
  const { setPanelMode } = useContext(AppContext);
  const [currChatFriend, setCurrChatFriend] = useState(null);
  return (
    <ChatContext.Provider value={{ currChatFriend, setCurrChatFriend }}>
      <Button onClick={() => setPanelMode("emoji")}>Emoji Panel</Button>
      <Button onClick={() => setPanelMode("theme")}>Theme Panel</Button>
      <Flex justify="space-around">
        <UserPanel />
        {currChatFriend && <ChatPanel />}
      </Flex>
    </ChatContext.Provider>
  );
};
