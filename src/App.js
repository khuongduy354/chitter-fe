import { createContext, useContext, useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { Login } from "./components/Login";
import { EmojiPanel } from "./components/EmojiPanel";
import { ThemeEditor } from "./components/Theme/ThemeEditor";
import { MyThemes } from "./components/Theme/MyThemes";
import { Market } from "./components/Market/Market";

export const AppContext = createContext({
  user: null,
  panelMode: "chat",
  setPanelMode: () => {},
  setUser: () => {},
});
function App() {
  const [user, setUser] = useState(null);
  const [panelMode, setPanelMode] = useState("chat"); // chat || emoji | theme
  const MainApp = () => {
    return (
      <div>
        {panelMode == "chat" && <Chat />}
        {panelMode == "emoji" && <EmojiPanel />}
        {panelMode == "theme" && <ThemeEditor />}
        {panelMode == "mythemes" && (
          <MyThemes closeCb={() => setPanelMode("chat")} showPublish={true} />
        )}
        {panelMode == "market" && <Market />}
      </div>
    );
  };
  return (
    <AppContext.Provider value={{ user, panelMode, setPanelMode, setUser }}>
      {!user && <Login />}
      {user && <MainApp />}
    </AppContext.Provider>
  );
}

export default App;
