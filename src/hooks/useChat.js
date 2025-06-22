import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { AppContext } from "../contexts/AppContext";
import { RESTQuery } from "../helper/restQuery";

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket } = useContext(SocketContext);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!user || !roomId) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const msgs = await RESTQuery.getMessages(user.accessToken, roomId);
        if (msgs) {
          setMessages(msgs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId, user]);

  useEffect(() => {
    if (!socket) return;

    socket.on("userChatReceive", ({ content, from }) => {
      setMessages((prev) => [...prev, { content, from }]);
    });

    return () => {
      socket.off("userChatReceive");
    };
  }, [socket]);

  const sendMessage = (content) => {
    if (!socket || !user || !roomId) return;

    socket.emit("userChat", user.id, roomId, content);
    setMessages((prev) => [...prev, { content, from: user.id }]);
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};
