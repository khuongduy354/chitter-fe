import { createContext } from "react";

export const AppContext = createContext({
  user: null,
  panelMode: "chat",
  setPanelMode: () => {},
  setUser: () => {},
});
