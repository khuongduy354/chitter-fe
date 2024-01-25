import { useContext, useEffect, useRef, useState } from "react";
import { RESTQuery } from "../../helper/restQuery";
import { getSocket } from "../../helper/socket";
import { Button, Flex } from "antd";
import { AppContext } from "../../App";
import { ChatContext } from "./Chat";

export const ChatPanel = () => {
  const { currChatFriend } = useContext(ChatContext);
  const { user } = useContext(AppContext);

  const sendMsgRef = useRef(null);
  const [chatContent, setChatContent] = useState([]);
  const [room, setRoom] = useState(null); // use this for theme

  useEffect(() => {
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent([...chatContent, { content, from }]);
    });
  }, [chatContent]);

  useEffect(() => {
    async function getRoom() {
      const _r = await RESTQuery.getRoom(user.accessToken, currChatFriend.id);
      if (_r) setRoom(_r);
    }
    if (currChatFriend) getRoom();
  }, [currChatFriend]);

  const sendMsg = () => {
    const socket = getSocket();
    if (chatContent != null)
      socket.emit(
        "userChat",
        user.id,
        currChatFriend.id,
        sendMsgRef.current.value
      );
    sendMsgRef.current.value = "";
  };
  return (
    <Flex className="RightBar" vertical justify="space-between">
      <h3>Chatting with {currChatFriend.email}</h3>

      <ul style={{ listStyle: "none" }}>
        {chatContent.map((msg, idx) => {
          return (
            <li key={idx}>
              <Flex justify={msg.from === user.id ? "flex-end" : "flex-start"}>
                <span
                  style={{
                    backgroundColor: msg.from === user.id ? "blue" : "black",
                    padding: 10,
                    borderRadius: 20,
                    color: "white",
                    margin: 5,
                  }}
                >
                  {msg.content}
                </span>
              </Flex>
            </li>
          );
        })}
      </ul>

      <div className="msgSender">
        <input ref={sendMsgRef} type="text" />
        <Button type="primary" onClick={sendMsg}>
          Send
        </Button>
      </div>
    </Flex>
  );
};
