import {
  ParallaxBanner,
  ParallaxBannerLayer,
  ParallaxProvider,
} from "react-scroll-parallax";
import { Fragment } from "react";

const ParallaxChunk = ({ layers }) => {
  return (
    <ParallaxBanner style={{ aspectRatio: "2 / 1" }}>
      {layers.map((layer, index) => {
        return (
          <Fragment key={index}>
            {layer.enable && (
              <ParallaxBannerLayer
                translateY={[layer.translateYMin, layer.translateYMax]}
              >
                <img
                  src={layer.imgUrl}
                  style={{
                    margin: layer.margin
                      .split(" ")
                      .map((m) => m + "px")
                      .join(" "),
                  }}
                />
              </ParallaxBannerLayer>
            )}
          </Fragment>
        );
      })}
    </ParallaxBanner>
  );
};
export const ParallaxBackground = ({ style, bg }) => {
  const { layers, divider, bgColor } = bg;
  console.log(bg);
  return (
    <ParallaxProvider>
      <div
        style={{
          width: "100%",
          backgroundColor: bgColor,
          ...style,
        }}
      >
        {[...new Array(10)].map((_, i) => (
          <div key={i}>
            <ParallaxChunk layers={layers} />
            <div
              style={{
                height: divider.height,
                maxHeight: divider.maxHeight,
                backgroundColor: divider.color,
              }}
            />
          </div>
        ))}
      </div>
    </ParallaxProvider>
  );
};
