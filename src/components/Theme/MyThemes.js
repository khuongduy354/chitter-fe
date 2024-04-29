import { useContext, useEffect, useState } from "react";
import { RESTQuery } from "../../helper/restQuery";
import { AppContext } from "../../App";
import { Button } from "antd";
import { BackHome } from "../BackHome";
import { ChatContext } from "../Chat/Chat";
import { ChatTheme } from "../Chat/ChatPanel";

export const MyThemes = ({ closeCb = () => {}, showPublish = false }) => {
  const [themes, setThemes] = useState([]);
  const fetchMyThemes = async () => {
    const themes = await RESTQuery.ThemeAPI.getMyThemes(user.accessToken);
    if (themes) setThemes(themes);
  };
  useEffect(() => {
    fetchMyThemes();
  }, []);
  const { user } = useContext(AppContext);
  const { activeRoom, setActiveRoom } = useContext(ChatContext);
  const publishTheme = async (id) => {
    const res = await RESTQuery.ThemeAPI.publishTheme(user.accessToken, id);
    if (res.ok) {
      fetchMyThemes();
    } else {
      alert("Failed to publish theme");
    }
  };
  const unPublish = async (id) => {
    const res = await RESTQuery.ThemeAPI.unpublishTheme(user.accessToken, id);
    if (res.ok) {
      fetchMyThemes();
    } else {
      alert("Failed to Unpublish theme");
    }
  };
  const applyTheme = async (theme) => {
    if (activeRoom === null || activeRoom === undefined) return;

    const res = await RESTQuery.ThemeAPI.applyTheme(
      user.accessToken,
      theme._id,
      activeRoom.id
    );
    if (res.ok) {
      const room = (await res.json()).room;
      console.log(room);
      setActiveRoom({ ...activeRoom, theme: room.theme });
      alert("Theme applied");
    } else {
      alert("Failed to apply theme");
    }
  };
  return (
    <div>
      <Button onClick={() => closeCb()}>Close</Button>
      {themes.map((theme, idx) => {
        const isOwned = theme.author === user.id;
        const isPublished = isOwned && theme.published;

        return (
          <div key={idx}>
            <h2>{theme.title}</h2>
            {isOwned && showPublish && (
              <Button
                onClick={() => {
                  isPublished ? unPublish(theme._id) : publishTheme(theme._id);
                }}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </Button>
            )}
            <ChatTheme
              bgAbs={true}
              theme={theme}
              messages={[
                {
                  content: "Hello",
                  from: "me",
                },
                {
                  content: "Hi there",
                  from: "me",
                },
              ]}
            />
            <Button onClick={() => applyTheme(theme)}> Apply </Button>
          </div>
        );
      })}
    </div>
  );
};
