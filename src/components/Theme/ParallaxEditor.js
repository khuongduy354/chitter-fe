import { Button, Divider, Flex, Input, List } from "antd";
import { useContext, useState } from "react";
import { ParallaxBackground } from "./ParallaxBackground";
import { defaultChatTheme } from "../../helper/chatTheme";
import { RESTQuery } from "../../helper/restQuery";
import { AppContext } from "../../App";

const GeneralSettings = ({
  bgColor,
  setBgColor,
  dividerProps,
  setDividerProps,
}) => {
  return (
    <div>
      <Divider> Background Color </Divider>
      <Input
        value={bgColor}
        type="text"
        placeholder="Background Color"
        onChange={(e) => {
          e.preventDefault();
          setBgColor(e.target.value);
        }}
      />
      <Divider> Divider Settings</Divider>
      <List>
        <label>Max Height</label>
        <Input
          type="number"
          placeholder="Max Height (in pixel)"
          value={dividerProps.maxHeight}
          onChange={(e) => {
            setDividerProps({
              ...dividerProps,
              maxHeight: parseInt(e.target.value),
            });
          }}
        />
        <label>Color</label>
        <Input
          type="text"
          placeholder="Color here"
          value={dividerProps.color}
          onChange={(e) => {
            setDividerProps({ ...dividerProps, color: e.target.value });
          }}
        />
        <label>Height</label>
        <Input
          type="number"
          placeholder="Height (% height of screen )"
          value={dividerProps.height.split("vh")[0]}
          onChange={(e) => {
            setDividerProps({
              ...dividerProps,
              height: e.target.value.toString() + "vh",
            });
          }}
        />
      </List>
    </div>
  );
};

const LayersSettings = ({ layers, setLayers }) => {
  const uploadFile = (files) => {};
  return (
    <div>
      <Divider>Current Layers</Divider>
      <Button
        type="primary"
        onClick={() => {
          setLayers([
            ...layers,
            {
              translateYMin: 0,
              translateYMax: 0,
              margin: "0 0 0 0",
              imgUrl: "",
            },
          ]);
        }}
      >
        Add Layer
      </Button>
      <div>
        {layers.map((layer, index) => {
          return (
            <div key={index}>
              <Divider>
                Layer {index}{" "}
                {!layer.enable ? (
                  <Button
                    onClick={() => {
                      setLayers([
                        ...layers.slice(0, index),
                        { ...layer, enable: true },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                    type="primary"
                  >
                    Enable
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      setLayers([
                        ...layers.slice(0, index),
                        { ...layer, enable: false },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  >
                    Disable
                  </Button>
                )}
              </Divider>

              {layer.enable && (
                <List.Item>
                  <label>Image URL</label>
                  <Input
                    type="text"
                    value={layer.imgUrl}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        { ...layer, imgUrl: e.target.value },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  />
                  <label>Margin</label>
                  <Input
                    placeholder="Margin format: top bottom left right"
                    type="text"
                    value={layer.margin}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        { ...layer, margin: e.target.value },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  />
                  <label>Translate Y minimum</label>
                  <Input
                    type="number"
                    value={layer.translateYMin}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        {
                          ...layer,
                          translateYMin: parseInt(e.target.value),
                        },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  />
                  <label>Translate Y maximum</label>
                  <Input
                    type="number"
                    value={layer.translateYMax}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        {
                          ...layer,
                          translateYMax: parseInt(e.target.value),
                        },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  />
                  <Button
                    onClick={() => {
                      setLayers([
                        ...layers.slice(0, index),
                        ...layers.slice(index + 1),
                      ]);
                    }}
                    type="primary"
                  >
                    Delete Layer
                  </Button>
                </List.Item>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const ParallaxEditor = () => {
  const [bgColor, setBgColor] = useState(defaultChatTheme.bg.bgColor);
  const [dividerProps, setDividerProps] = useState(defaultChatTheme.bg.divider);
  const [layers, setLayers] = useState(
    defaultChatTheme.bg.layers.map((l) => ({ ...l, enable: true }))
  );
  const [themeName, setThemeName] = useState(defaultChatTheme.themeName);
  const [senderMsgColor, setSenderMsgColor] = useState(
    defaultChatTheme.sender_msg_color
  );
  const [receiverMsgColor, setReceiverMsgColor] = useState(
    defaultChatTheme.receiver_msg_color
  );

  const { user, setPanelMode } = useContext(AppContext);
  const saveTheme = async () => {
    // remove enable key from layers
    const _layers = layers.map((l) => {
      const { enable, ...rest } = l;
      return rest;
    });
    const theme = {
      bg: { bgColor, layers: _layers, divider: dividerProps },
      sender_msg_color: senderMsgColor,
      receiver_msg_color: receiverMsgColor,
      themeName,
    };
    const newTheme = await RESTQuery.createTheme(user.accessToken, theme);
    if (newTheme) {
      alert("Theme saved!");
    } else {
      alert("Failed to save theme");
    }
  };

  const GeneralSettingsProps = {
    bgColor,
    setBgColor,
    dividerProps,
    setDividerProps,
  };
  const LayersSettingsProps = { layers, setLayers };
  return (
    <div>
      <Flex>
        <div>
          <Button
            onClick={() => {
              setPanelMode("chat");
            }}
          >
            Back to user
          </Button>
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
          <GeneralSettings {...GeneralSettingsProps} />
          <LayersSettings {...LayersSettingsProps} />
        </div>
        <ParallaxBackground bg={{ layers, divider: dividerProps, bgColor }} />
      </Flex>
    </div>
  );
};
