import { Button, Divider, Flex, Input, List } from "antd";
import { Fragment, useState } from "react";
import {
  ParallaxBanner,
  ParallaxBannerLayer,
  ParallaxProvider,
} from "react-scroll-parallax";

export const ThemeEditor = () => {
  const [bgColor, setBgColor] = useState("#282c34");
  const [dividerProps, setDividerProps] = useState({
    maxHeight: 0,
    height: "10vh",
    color: "#ffffff",
  });
  const [layers, setLayers] = useState([
    { translateY: [0, 0], margin: "0 0 0 0", imgUrl: "", enable: false },
  ]);

  const GeneralSettings = () => {
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

  const LayersSettings = () => {
    return (
      <div>
        <Divider>Current Layers</Divider>
        <Button
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
                    >
                      Enable
                    </Button>
                  ) : (
                    <Button
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

  const ParallaxChunk = () => {
    return (
      <ParallaxBanner style={{ aspectRatio: "2 / 1" }}>
        {layers.map((layer, index) => {
          return (
            <Fragment key={index}>
              {layer.enable && (
                <ParallaxBannerLayer translateY={layer.translateY}>
                  <img src={layer.imgUrl} style={{ margin: layer.margin }} />
                </ParallaxBannerLayer>
              )}
            </Fragment>
          );
        })}
      </ParallaxBanner>
    );
  };

  const Preview = () => {
    return (
      <ParallaxProvider>
        <div
          style={{
            width: "100%",
            backgroundColor: bgColor,
          }}
        >
          {[...new Array(10)].map((_, i) => (
            <div key={i}>
              <ParallaxChunk />
              <div
                style={{
                  height: dividerProps.height,
                  maxHeight: dividerProps.maxHeight,
                  backgroundColor: dividerProps.color,
                }}
              />
            </div>
          ))}
        </div>
      </ParallaxProvider>
    );
  };
  return (
    <div>
      <Flex>
        <div style={{ maxWidth: "50%" }}>
          <GeneralSettings />
          <LayersSettings />
        </div>
        <Preview />
      </Flex>
    </div>
  );
};
