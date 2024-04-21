import { useContext, useEffect, useState } from "react";

import { RESTQuery } from "../../helper/restQuery";
import AppContext from "antd/es/app/context";
import { Button } from "antd";

export const Market = () => {
  const [themes, setThemes] = useState([]);
  const fetchMarketItems = async () => {
    const themes = await RESTQuery.ThemeAPI.getMarketItems();
    if (themes) setThemes(themes);
  };
  useEffect(() => {
    fetchMarketItems();
  }, []);
  const { user } = useContext(AppContext);

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
      {themes.map((theme, idx) => {
        return (
          <div key={idx}>
            <h2>{theme.title}</h2>
            {user.id !== theme.author.id &&
              !theme.buyers.includes(user.id)(
                <Button onClick={() => buyTheme(theme._id)}>Buy</Button>
              )}
            {user.id !== theme.author.id && theme.buyers.includes(user.id) && (
              <Button disabled={true}>Bought</Button>
            )}
            {user.id === theme.author.id && <div>This is your theme!</div>}
          </div>
        );
      })}
    </div>
  );
};
