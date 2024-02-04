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
              <ParallaxBannerLayer translateY={layer.translateY}>
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
export const ParallaxBackground = ({ bgColor, dividerProps, layers }) => {
  return (
    <ParallaxProvider>
      <div
        style={{
          width: "100%",
          backgroundColor: bgColor,
        }}
      >
        {[...new Array(1)].map((_, i) => (
          <div key={i}>
            <ParallaxChunk layers={layers} />
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
