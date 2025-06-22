import { useContext, useRef, useState, useEffect } from "react";
import { getSocket } from "../../helper/socket";
import { RESTQuery } from "../../helper/restQuery";
import { Button, Flex } from "antd";
import { AppContext } from "../../contexts/AppContext";
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
        theme !== undefined &&
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
  const messageListRef = useRef(null);

  const sendMsgRef = useRef(null);
  const [chatContent, setChatContent] = useState([]);
  const [chatTheme, setChatTheme] = useState(null);
  const [themePicker, setThemePicker] = useState(false);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    socket.emit("initConnection", user.id);
    socket.on("userChatReceive", ({ content, from }) => {
      setChatContent((prev) => [
        ...prev,
        { content, from, timestamp: new Date() },
      ]);
      scrollToBottom();
    });
  }, [user]);

  useEffect(() => {
    async function getRoom() {
      if (!user || !currChatFriend) return;
      const _r = await RESTQuery.getRoom(user.accessToken, currChatFriend.id);
      if (_r) {
        setActiveRoom(_r);
        if (_r.theme) {
          setChatTheme(_r.theme);
        }
      }
    }
    if (currChatFriend) getRoom();
  }, [currChatFriend, user, setActiveRoom]);

  useEffect(() => {
    async function getMsgs() {
      if (!activeRoom || !user?.accessToken) return;
      const msgs = await RESTQuery.getMessages(user.accessToken, activeRoom.id);
      if (msgs) {
        setChatContent(
          msgs.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp || Date.now()),
          }))
        );
        scrollToBottom();
      }
      setChatTheme(activeRoom.theme);
    }
    getMsgs();
  }, [activeRoom, user?.accessToken]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  const sendMsg = () => {
    const message = sendMsgRef.current.value.trim();
    if (!message) return;

    const socket = getSocket();
    socket.emit("userChat", user.id, currChatFriend.id, message);
    setChatContent((prev) => [
      ...prev,
      { content: message, from: user.id, timestamp: new Date() },
    ]);
    sendMsgRef.current.value = "";
    scrollToBottom();
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        display: "flex",
        height: "calc(100vh - 40px)",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left Panel - Users Tab */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #e2e8f0",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Chats</h2>
        {/* Add your users list component here */}
      </div>

      {/* Right Panel - Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className="chatHeader"
          style={{
            padding: "20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="userInfo">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                color: "#64748b",
              }}
            >
              {currChatFriend?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{currChatFriend?.email}</h3>
              <div className="userStatus">
                <span className="statusDot"></span>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="actionButtons">
            <Button
              className="actionButton"
              onClick={() => setThemePicker(true)}
              icon={
                <span role="img" aria-label="theme">
                  🎨
                </span>
              }
            >
              Theme
            </Button>
          </div>
        </div>

        {themePicker && (
          <MyThemes
            closeCb={() => {
              setThemePicker(false);
            }}
          />
        )}

        {activeRoom && !themePicker && (
          <Flex vertical style={{ height: "100%", overflow: "hidden" }}>
            <div
              className="messageList"
              ref={messageListRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <ChatTheme theme={chatTheme} messages={chatContent} />
            </div>

            <div
              className="inputContainer"
              style={{
                padding: "20px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: "10px",
              }}
            >
              <textarea
                ref={sendMsgRef}
                className="input"
                placeholder="Type a message..."
                onKeyPress={handleKeyPress}
                rows={1}
                style={{
                  resize: "none",
                  flex: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Button
                className="sendButton"
                onClick={sendMsg}
                icon={
                  <span role="img" aria-label="send">
                    📤
                  </span>
                }
                style={{
                  height: "100%",
                }}
              >
                Send
              </Button>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
};
