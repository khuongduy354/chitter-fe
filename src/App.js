import { useState } from "react";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div>
      {user ? <Chat user={user} /> : <Login user={user} setUser={setUser} />}
    </div>
  );
}

export default App;
