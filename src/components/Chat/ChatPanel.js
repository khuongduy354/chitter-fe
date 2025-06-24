import { useContext, useRef, useState, useEffect } from "react";
import { getSocket } from "../../helper/socket";
import { RESTQuery } from "../../helper/restQuery";
import { Button, Flex } from "antd";
import { AppContext } from "../../contexts/AppContext";
import { ChatContext } from "./Chat";
import { MyThemes } from "../Theme/MyThemes";
import { FriendList } from "./UserComponents/FriendList";

export const ChatTheme = ({ theme = null, messages = [], bgAbs = true }) => {
  const defaultTheme = {
    background: {
      bgType: "color",
      color: "#f5f5f5",
    },
    messages: {
      selfMessage: {
        backgroundColor: "#1890ff",
        textColor: "#ffffff",
      },
      otherMessage: {
        backgroundColor: "#f0f0f0",
        textColor: "#000000",
      },
    },
  };

  // Use default theme if theme is null or undefined
  const activeTheme = theme || defaultTheme;

  const Background = () => {
    return (
      <div>
        {activeTheme.background.bgType === "color" && (
          <div
            style={{
              backgroundColor: activeTheme.background.color,
              width: "100%",
              height: "100%",
            }}
          ></div>
        )}
        {activeTheme.background.bgType === "image" &&
          activeTheme.background.image && (
            <img
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                maxHeight: "500px",
                maxWidth: "400px",
                zIndex: -1,
              }}
              src={activeTheme.background.image}
              alt="background"
            />
          )}
      </div>
    );
  };

  const { user } = useContext(AppContext);
  return (
    <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
      {bgAbs ? (
        <Background />
      ) : (
        activeTheme.background.bgType === "image" &&
        activeTheme.background.image && (
          <img
            src={activeTheme.background.image}
            alt="background"
            style={{ width: "100%", height: "100%" }}
          ></img>
        )
      )}
      <ul style={{ listStyle: "none" }}>
        {[...messages].reverse().map((msg, idx) => {
          const isMyMsg = msg.from === user.id;
          const messageStyle = isMyMsg
            ? activeTheme.messages.selfMessage
            : activeTheme.messages.otherMessage;

          return (
            <li key={idx}>
              <Flex justify={isMyMsg ? "flex-end" : "flex-start"}>
                <span
                  style={{
                    backgroundColor: messageStyle.backgroundColor,
                    color: messageStyle.textColor,
                    padding: 10,
                    borderRadius: 20,
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
      setChatContent((prev) => [{ content, from }, ...prev]);
      scrollToBottom();
    });

    return () => {
      socket.off("userChatReceive");
    };
  }, [user]);

  useEffect(() => {
    if (activeRoom) {
      const socket = getSocket();
      socket.emit("joinGroup", activeRoom.id);
    }

    return () => {
      if (activeRoom) {
        const socket = getSocket();
        socket.emit("leaveGroup", activeRoom.id);
      }
    };
  }, [activeRoom]);

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
    if (currChatFriend) {
      getRoom();
    }
  }, [currChatFriend, user, setActiveRoom]);

  useEffect(() => {
    async function getMsgs() {
      if (!activeRoom || !user?.accessToken) return;
      const msgs = await RESTQuery.getMessages(user.accessToken, activeRoom.id);
      if (msgs) {
        setChatContent(msgs);
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
    sendMsgRef.current.value = "";
    scrollToBottom();
  };

  return (
    <Flex style={{ width: "100%", height: "100%" }}>
      <FriendList />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          ref={messageListRef}
          style={{
            flex: 1,
            overflowY: "auto",
            height: "calc(100% - 60px)", // Leave space for input
            padding: "1rem",
          }}
        >
          {currChatFriend && (
            <ChatTheme theme={chatTheme} messages={chatContent} />
          )}
        </div>

        {currChatFriend && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              padding: "10px",
              backgroundColor: "white",
              borderTop: "1px solid #eaeef3",
            }}
          >
            <Flex gap="small">
              <textarea
                ref={sendMsgRef}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  resize: "none",
                  height: "40px",
                }}
              />
              <Button onClick={() => setThemePicker(true)}>Theme</Button>
              <Button type="primary" onClick={sendMsg}>
                Send
              </Button>
            </Flex>
          </div>
        )}

        {themePicker && (
          <MyThemes
            showPublish={true}
            closeCb={() => {
              setThemePicker(false);
            }}
            onThemeSelect={async (theme) => {
              if (!activeRoom || !user) return;
              await RESTQuery.updateRoomTheme(
                user.accessToken,
                activeRoom.id,
                theme
              );
              setChatTheme(theme);
              setThemePicker(false);
            }}
          />
        )}
      </div>
    </Flex>
  );
};
