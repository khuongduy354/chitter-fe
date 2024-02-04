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
  return (
    <div>
      <Divider>Current Layers</Divider>
      <Button
        type="primary"
        onClick={() => {
          setLayers([
            ...layers,
            { translateY: [0, 0], margin: "0 0 0 0", imgUrl: "" },
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
                    type="text"
                    value={layer.translateY[0]}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        {
                          ...layer,
                          translateY: [
                            parseInt(e.target.value),
                            layer.translateY[1],
                          ],
                        },
                        ...layers.slice(index + 1),
                      ]);
                    }}
                  />
                  <label>Translate Y maximum</label>
                  <Input
                    type="text"
                    value={layer.translateY[1]}
                    onChange={(e) => {
                      setLayers([
                        ...layers.slice(0, index),
                        {
                          ...layer,
                          translateY: [
                            layer.translateY[0],
                            parseInt(e.target.value),
                          ],
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
export const ThemeEditor = () => {
  const [bgColor, setBgColor] = useState(defaultChatTheme.bgColor);
  const [dividerProps, setDividerProps] = useState(
    defaultChatTheme.dividerProps
  );
  const [layers, setLayers] = useState(
    defaultChatTheme.layers.map((l) => ({ ...l, enable: true }))
  );

  const [themeName, setThemeName] = useState("Untitled");

  const { user } = useContext(AppContext);
  const saveTheme = async () => {
    const theme = {
      bgColor,
      dividerProps,
      layers: layers.map((l) => ({ ...l, enable: true })),
    };
    const isOk = await RESTQuery.createTheme(
      user.accessToken,
      theme,
      themeName
    );
    if (isOk) {
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
        <ParallaxBackground
          layers={layers}
          bgColor={bgColor}
          dividerProps={dividerProps}
        />
      </Flex>
    </div>
  );
};
