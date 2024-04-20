import { Button, Divider, Flex, Input, List } from "antd";
import { useContext, useState } from "react";
import { ParallaxBackground } from "./ParallaxBackground";
import { defaultChatTheme } from "../../helper/chatTheme";
import { RESTQuery } from "../../helper/restQuery";
import { AppContext } from "../../App";
import { Select } from "antd";
import { FileUploadComponent } from "../FileUpload";

const GeneralSettings = ({
  bgColor,
  setBgColor,
  bgMode,
  setBgImage,
  senderMsgColor,
  receiverMsgColor,
  setSenderMsgColor,
  setReceiverMsgColor,
}) => {
  const handleFilesUpload = (files) => {
    if (files[0] && files[0] !== undefined) {
      // TODO: validate if image
      setBgImage(URL.createObjectURL(files[0]));
    }
  };
  return (
    <div>
      {bgMode === "color" && (
        <div>
          <Input
            value={bgColor}
            type="text"
            placeholder="Background Color"
            onChange={(e) => {
              e.preventDefault();
              setBgColor(e.target.value);
            }}
          />
        </div>
      )}
      {bgMode === "image" && (
        <div>
          <FileUploadComponent cb={handleFilesUpload} />
        </div>
      )}
      <Divider>Sender Message Color</Divider>
      <Input
        value={senderMsgColor.fg}
        type="text"
        placeholder="Sender Message Color"
        onChange={(e) => {
          e.preventDefault();
          setSenderMsgColor({ ...senderMsgColor, fg: e.target.value });
        }}
      />
      <Input
        value={senderMsgColor.bg}
        type="text"
        placeholder="Sender Message Background Color"
        onChange={(e) => {
          e.preventDefault();
          setSenderMsgColor({ ...senderMsgColor, bg: e.target.value });
        }}
      />

      <Divider>Receiver Message Color</Divider>
      <Input
        value={receiverMsgColor.fg}
        type="text"
        placeholder="Receiver Message Color"
        onChange={(e) => {
          e.preventDefault();
          setReceiverMsgColor({ ...receiverMsgColor, fg: e.target.value });
        }}
      />

      <Input
        value={receiverMsgColor.bg}
        type="text"
        placeholder="Receiver Message Background Color"
        onChange={(e) => {
          e.preventDefault();
          setReceiverMsgColor({ ...receiverMsgColor, bg: e.target.value });
        }}
      />
    </div>
  );
};

// mode: image, color
// payload: image file upload, or  color code
export const ThemeEditor = () => {
  const [bgMode, setBgMode] = useState("image");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);

  const [themeName, setThemeName] = useState(defaultChatTheme.themeName);

  const [senderMsgColor, setSenderMsgColor] = useState({
    fg: "#000000",
    bg: "#ffffff",
  });
  const [receiverMsgColor, setReceiverMsgColor] = useState({
    fg: "#ffffff",
    bg: "#000000",
  });

  const { user, setPanelMode } = useContext(AppContext);
  const saveTheme = async () => {};

  const GeneralSettingsProps = {
    bgColor,
    setBgColor,
    bgMode,
    senderMsgColor,
    setSenderMsgColor,
    receiverMsgColor,
    setReceiverMsgColor,
    setBgImage,
  };
  return (
    <div>
      <Button
        onClick={() => {
          setPanelMode("chat");
        }}
      >
        Back to user
      </Button>
      <br />

      <Flex>
        <div>
          <Divider>Theme Name</Divider>
          <Input
            value={themeName}
            onChange={(e) => {
              setThemeName(e.target.value);
            }}
          />
          <Button type="primary" onClick={saveTheme}>
            Save Theme
          </Button>
          <div>
            <Divider> Background Input </Divider>
            <span>Background Mode: </span>
            <Select
              defaultValue={bgMode}
              style={{ width: 120 }}
              onChange={(val) => {
                setBgMode(val);
              }}
            >
              <Select.Option value="color">Color</Select.Option>
              <Select.Option value="image">Image</Select.Option>
            </Select>
          </div>
          <GeneralSettings {...GeneralSettingsProps} />
        </div>

        <div className="preview">
          <div
            style={{
              backgroundColor: bgMode === "color" ? bgColor : null,
              height: "100vh",
            }}
          >
            {bgMode === "image" && bgImage && (
              <img
                style={{ position: "absolute", zIndex: -99 }}
                src={bgImage}
              />
            )}
            <p>Some Message</p>
          </div>
        </div>

        {/* <ParallaxBackground bg={{ layers, divider: dividerProps, bgColor }} /> */}

        {/* TODO: preview here */}
      </Flex>
    </div>
  );
};
