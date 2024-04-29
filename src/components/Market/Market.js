import { useContext, useEffect, useState } from "react";

import { RESTQuery } from "../../helper/restQuery";
import { Button } from "antd";
import { BackHome } from "../BackHome";
import { AppContext } from "../../App";
import { ChatTheme } from "../Chat/ChatPanel";

export const Market = () => {
  const { user } = useContext(AppContext);
  const [themes, setThemes] = useState([]);
  const fetchMarketItems = async () => {
    const themes = await RESTQuery.ThemeAPI.getMarketItems();
    if (themes) setThemes(themes);
  };
  useEffect(() => {
    fetchMarketItems();
  }, []);

  const buyTheme = async (id) => {
    const res = await RESTQuery.ThemeAPI.buyTheme(user.accessToken, id);
    if (res.ok) {
      fetchMarketItems();
    } else {
      alert("Failed to buy theme");
    }
  };

  return (
    <div>
      <BackHome />
      {themes &&
        themes.length > 0 &&
        themes.map((theme, idx) => {
          const isBought = theme.buyers.includes(user.id);
          return (
            <div key={idx}>
              <div>
                <h2>{theme.title}</h2>
                {user.id !== theme.author && !isBought && (
                  <Button onClick={() => buyTheme(theme._id)}>Buy</Button>
                )}
                {user.id !== theme.author.id && isBought && (
                  <Button disabled={true}>Bought</Button>
                )}
                {user.id === theme.author && <div>This is your theme!</div>}
              </div>
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
            </div>
          );
        })}
    </div>
  );
};
