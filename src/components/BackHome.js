import { Button } from "antd";
import { useContext } from "react";
import { AppContext } from "../App";

export function BackHome() {
  const { setPanelMode } = useContext(AppContext);
  return (
    <div>
      <Button
        onClick={() => {
          setPanelMode("chat");
        }}
      >
        Back
      </Button>
    </div>
  );
}
