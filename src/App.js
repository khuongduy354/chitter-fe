import { useState } from "react";
import { Chat } from "./components/Chat/Chat";
import { Login } from "./components/Login";
import { EmojiPanel } from "./components/EmojiPanel";
import { ThemeEditor } from "./components/Theme/ThemeEditor";
import { MyThemes } from "./components/Theme/MyThemes";
import { Market } from "./components/Market/Market";
import { AppContext } from "./contexts/AppContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext";
import { Button, Flex } from "antd";
import { supabase } from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [panelMode, setPanelMode] = useState("chat"); // chat || emoji | theme

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const MainApp = () => {
    if (!user) {
      return <Login />;
    }

    return (
      <Flex
        vertical
        align="center"
        style={{
          height: "100dvh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Flex gap="small" style={{ padding: "0.5rem" }}>
          <Button onClick={() => setPanelMode("emoji")}>Emojis</Button>
          <Button onClick={() => setPanelMode("theme")}>Theme Edit</Button>
          <Button onClick={() => setPanelMode("market")}>Market</Button>
          <Button onClick={() => setPanelMode("mythemes")}>My Themes</Button>
          <Button onClick={handleSignOut} danger>
            Sign Out
          </Button>
        </Flex>
        <div
          style={{
            width: "100%",
            height: "calc(100% - 2.5rem)",
            maxWidth: "1200px",
          }}
        >
          {panelMode === "chat" && <Chat />}
          {panelMode === "emoji" && <EmojiPanel />}
          {panelMode === "theme" && <ThemeEditor />}
          {panelMode === "mythemes" && (
            <MyThemes closeCb={() => setPanelMode("chat")} showPublish={true} />
          )}
          {panelMode === "market" && <Market />}
        </div>
      </Flex>
    );
  };

  return (
    <AppContext.Provider value={{ user, panelMode, setPanelMode, setUser }}>
      <SocketProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </SocketProvider>
    </AppContext.Provider>
  );
}

export default App;
