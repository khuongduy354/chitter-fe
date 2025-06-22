import { createContext, useState } from "react";
import { Flex } from "antd";
import { ChatPanel } from "./ChatPanel";
import { UserPanel } from "./UserComponents/UserPanel";

export const ChatContext = createContext({
  currChatFriend: null,
  setCurrChatFriend: () => {},
  activeRoom: null,
  setActiveRoom: () => {},
});

export const Chat = () => {
  const [currChatFriend, setCurrChatFriend] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);

  return (
    <ChatContext.Provider
      value={{ currChatFriend, setCurrChatFriend, activeRoom, setActiveRoom }}
    >
      <Flex vertical gap="middle" style={{ width: "100%" }}>
        <Flex
          justify="space-between"
          wrap="wrap"
          gap="small"
          style={{ padding: "1rem" }}
        >
          <UserPanel />
        </Flex>
        <Flex justify="space-around" gap="large" style={{ padding: "1rem" }}>
          <ChatPanel />
        </Flex>
      </Flex>
    </ChatContext.Provider>
  );
};
