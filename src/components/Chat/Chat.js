import { createContext, useState } from "react";
import { Flex } from "antd";
import { ChatPanel } from "./ChatPanel";

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
      <Flex style={{ width: "100%", height: "100dvh", margin: 0, padding: 0 }}>
        <ChatPanel />
      </Flex>
    </ChatContext.Provider>
  );
};
