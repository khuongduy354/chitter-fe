import { createContext, useState, useContext } from "react";
import { defaultChatTheme } from "../helper/chatTheme";
import { RESTQuery } from "../helper/restQuery";
import { AppContext } from "./AppContext";

export const ThemeContext = createContext({
  theme: null,
  setTheme: () => {},
  saveTheme: () => {},
  applyTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultChatTheme);
  const { user } = useContext(AppContext);

  const saveTheme = async (themeData) => {
    if (!user) return null;
    const newTheme = await RESTQuery.ThemeAPI.createTheme(
      user.accessToken,
      themeData
    );
    return newTheme;
  };

  const applyTheme = async (themeId, roomId) => {
    if (!user) return null;
    const result = await RESTQuery.ThemeAPI.applyTheme(
      user.accessToken,
      themeId,
      roomId
    );
    return result;
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, saveTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
