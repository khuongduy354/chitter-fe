import { useState } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { EmojiPanel } from "./components/EmojiPanel";

function App() {
  const [user, setUser] = useState(null);
  const [panelMode, setPanelMode] = useState("chat"); // chat || emoji | theme
  return (
    <div>
      {!user ? (
        <Login user={user} setUser={setUser} />
      ) : panelMode == "chat" ? (
        <Chat user={user} setPanelMode={setPanelMode} />
      ) : panelMode == "emoji" ? (
        <EmojiPanel user={user} setPanelMode={setPanelMode} />
      ) : (
        // <ThemePanel />
        <div>Theme Panel</div>
      )}
    </div>
  );
}

export default App;
