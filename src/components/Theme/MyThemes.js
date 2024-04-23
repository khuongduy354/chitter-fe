import { useContext, useEffect, useState } from "react";
import { RESTQuery } from "../../helper/restQuery";
import { AppContext } from "../../App";
import { Button } from "antd";
import { BackHome } from "../BackHome";

export const MyThemes = () => {
  const [themes, setThemes] = useState([]);
  const fetchMyThemes = async () => {
    const themes = await RESTQuery.ThemeAPI.getMyThemes(user.accessToken);
    if (themes) setThemes(themes);
  };
  useEffect(() => {
    fetchMyThemes();
  }, []);
  const { user } = useContext(AppContext);
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
  return (
    <div>
      <BackHome />
      {themes.map((theme, idx) => {
        const isOwned = theme.author.id === user.id;
        const isPublished = isOwned && theme.published;

        return (
          <div key={idx}>
            <h2>{theme.title}</h2>
            {isOwned && (
              <Button
                onClick={() => {
                  isPublished ? unPublish(theme._id) : publishTheme(theme._id);
                }}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </Button>
            )}
            <Button> Apply </Button>
          </div>
        );
      })}
    </div>
  );
};
