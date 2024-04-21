import { useContext, useEffect, useRef, useState } from "react";
import { RESTQuery } from "../../helper/restQuery";
import { getSocket } from "../../helper/socket";
import { Button, Flex } from "antd";
import { AppContext } from "../../App";
import { ChatContext } from "./Chat";

const ChatTheme = ({ theme }) => {
  // const sample = {
  //   _id: { $oid: "661e53d01b0c5c829139cc2b" },
  //   title: "My Theme",
  //   background: {
  //     bgType: "color",
  //     color: "#ffffff",
  //     _id: { $oid: "661e53d01b0c5c829139cc2c" },
  //   },
  //   emojis: [
  //     { $oid: "611d29bafba6b60015eae6c7" },
  //     { $oid: "611d29bafba6b60015eae6c8" },
  //   ],
  //   author: "550e8400-e29b-41d4-a716-446655440000",
  //   __v: { $numberInt: "0" },
  // };
  const Background = () => {
    return (
      <div>
        {theme.background.bgType === "color" && (
          <div
            style={{
              backgroundColor: theme.background.color,
              width: "100%",
              height: "100%",
            }}
          ></div>
        )}
        {theme.background.bgType === "image" && (
          <img src={theme.background.image} alt="background" />
        )}
      </div>
    );
  };
  return (
    <div>
      <Background />
    </div>
  );
};

export const ChatPanel = () => {
  const { currChatFriend } = useContext(ChatContext);
  const { user } = useContext(AppContext);

  const sendMsgRef = useRef(null);
  const [chatContent, setChatContent] = useState([]);
  const [room, setRoom] = useState(null); // use this for theme
  const [chatTheme, setChatTheme] = useState(null);
  const [emojisBox, setEmojisBox] = useState([]);

  useEffect(() => {
    if (!user) return;
    // load chat msgs
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent([...chatContent, { content, from }]);
    });
  }, [chatContent]);

  useEffect(() => {
    async function getRoom() {
      if (!user || !currChatFriend) return;
      const _r = await RESTQuery.getRoom(user.accessToken, currChatFriend.id);
      if (_r) {
        setRoom(_r);
        if (_r.theme) {
          setChatTheme(_r.theme);
          setEmojisBox(_r.theme.emojis);
        }
      }
    }
    if (currChatFriend) getRoom();
  }, [currChatFriend]);

  useEffect(() => {
    async function getMsgs() {
      const msgs = await RESTQuery.getMessages(user.accessToken, room.id);
      if (msgs) {
        setChatContent(msgs);
      }
    }
    if (room) getMsgs();
  }, [room]);

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
    <div>
      <Flex
        className="RightBar"
        vertical
        align="space-between"
        justify="space-between"
        style={{ height: "90vh" }}
      >
        <h3>Chatting with {currChatFriend && currChatFriend.email}</h3>

        <div style={{ overflow: "scroll" }}>
          {chatTheme && (
            <ChatTheme theme={chatTheme} />
            // <ParallaxBackground
            //   style={{
            //     position: "absolute",
            //     zIndex: -1,
            //     maxWidth: "50%",
            //     top: 0,
            //     maxHeight: "100vh",
            //     overflow: "scroll",
            //   }}
            //   bg={chatTheme.bg}
            // />
          )}
          <ul style={{ listStyle: "none" }}>
            {chatContent.map((msg, idx) => {
              return (
                <li key={idx}>
                  <Flex
                    justify={msg.from === user.id ? "flex-end" : "flex-start"}
                  >
                    <span
                      style={{
                        backgroundColor:
                          msg.from === user.id ? "blue" : "black",
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
        </div>

        <div className="msgSender">
          <input ref={sendMsgRef} type="text" />
          <Button type="primary" onClick={sendMsg}>
            Send
          </Button>
        </div>
      </Flex>
    </div>
  );
};
