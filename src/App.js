import { createContext, useContext, useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { Login } from "./components/Login";
import { EmojiPanel } from "./components/EmojiPanel";

export const AppContext = createContext({
  user: null,
  panelMode: "chat",
  setPanelMode: () => {},
  setUser: () => {},
});
function App() {
  const [user, setUser] = useState(null);
  const [panelMode, setPanelMode] = useState("chat"); // chat || emoji | theme
  return (
    <AppContext.Provider value={{ user, panelMode, setPanelMode, setUser }}>
      {!user ? (
        <Login />
      ) : panelMode == "chat" ? (
        <Chat />
      ) : panelMode == "emoji" ? (
        <EmojiPanel />
      ) : (
        // <ThemePanel />
        <div>Theme Panel</div>
      )}
    </AppContext.Provider>
  );
}

export default App;
