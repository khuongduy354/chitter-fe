import { useContext, useEffect, useRef, useState } from "react";
import { RESTQuery } from "../../helper/restQuery";
import { getSocket } from "../../helper/socket";
import { Button, Flex, theme } from "antd";
import { AppContext } from "../../App";
import { ChatContext } from "./Chat";
import { MyThemes } from "../Theme/MyThemes";

export const ChatTheme = ({ theme = null, messages = [], bgAbs = true }) => {
  // const sample = {
  //   _id: { $oid: "661e53d01b0c5c829139cc2b" },
  //   title: "My Theme",
  //   background: {
  //     bgType: "color",
  //     color: "#ffffff",
  //     _id: { $oid: "661e53d01b0c5c829139cc2c" },
  //   },
  //   messages: {
  //     selfMessage: {
  //       backgroundColor: "#000000",
  //       textColor: "#ffffff"
  //     },
  //     otherMessage: {
  //       backgroundColor: "#ffffff",
  //       textColor: "#000000"
  //     },
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
          <img
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              maxHeight: "500px",
              maxWidth: "400px",
              zIndex: -1,
            }}
            src={theme.background.image}
            alt="background"
          />
        )}
      </div>
    );
  };
  const { user } = useContext(AppContext);
  return (
    <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
      {theme &&
        (bgAbs ? (
          <Background />
        ) : (
          <img
            src={theme.background.image}
            alt="background"
            style={{ width: "100%", height: "100%" }}
          ></img>
        ))}
      <ul style={{ listStyle: "none" }}>
        {messages.map((msg, idx) => {
          const isMyMsg = msg.from === user.id;
          const applyTheme = (isMyMsg) => {
            if (theme.messages === undefined)
              return { textColor: "white", backgroundColor: "black" };
            if (isMyMsg) {
              return theme.messages.selfMessage;
            }
            return theme.messages.otherMessage;
          };
          return (
            <li key={idx}>
              <Flex justify={isMyMsg ? "flex-end" : "flex-start"}>
                <span
                  style={{
                    backgroundColor: theme
                      ? applyTheme(isMyMsg).backgroundColor
                      : "blue",
                    padding: 10,
                    borderRadius: 20,
                    color: theme ? applyTheme(isMyMsg).textColor : "white",
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
  );
};

export const ChatPanel = () => {
  const { currChatFriend } = useContext(ChatContext);
  const { user } = useContext(AppContext);
  const { setActiveRoom, activeRoom } = useContext(ChatContext);

  const sendMsgRef = useRef(null);
  const [chatContent, setChatContent] = useState([]);
  const [chatTheme, setChatTheme] = useState(null);
  const [emojisBox, setEmojisBox] = useState([]);
  const [themePicker, setThemePicker] = useState(false);

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
        setActiveRoom(_r);
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
      const msgs = await RESTQuery.getMessages(user.accessToken, activeRoom.id);
      if (msgs) {
        setChatContent(msgs);
      }
    }
    if (activeRoom) {
      getMsgs();
      console.log(activeRoom);
      setChatTheme(activeRoom.theme);
    }
  }, [activeRoom]);

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
      <h3>Chatting with {currChatFriend && currChatFriend.email}</h3>
      <Button
        onClick={() => {
          setThemePicker(true);
        }}
      >
        Pick theme
      </Button>
      {themePicker && (
        <MyThemes
          closeCb={() => {
            setThemePicker(false);
          }}
        />
      )}

      {activeRoom && !themePicker && (
        <Flex
          className="RightBar"
          vertical
          align="space-between"
          justify="space-between"
          style={{ height: "90vh" }}
        >
          <ChatTheme theme={chatTheme} messages={chatContent} />

          <div className="msgSender">
            <input ref={sendMsgRef} type="text" />
            <Button type="primary" onClick={sendMsg}>
              Send
            </Button>
          </div>
        </Flex>
      )}
    </div>
  );
};
