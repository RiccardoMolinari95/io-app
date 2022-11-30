import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const IconCategFinance = ({ size, color }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M16.932 11.334a4.889 4.889 0 0 0-3.479-1.443H12a.703.703 0 0 0 0 1.406h1.453c.937 0 1.82.366 2.485 1.03a.703.703 0 1 0 .994-.993ZM5.229 14.11a.703.703 0 1 0 0-1.407.703.703 0 0 0 0 1.407ZM20.5 0C18.565 0 17 1.6 17 3.523 17 5.44 18.57 7 20.5 7S24 5.44 24 3.523C24 1.601 22.435 0 20.5 0Zm0 5.61c-1.158 0-2.1-.937-2.1-2.087 0-1.156.962-2.132 2.1-2.132 1.138 0 2.1.976 2.1 2.132 0 1.15-.942 2.086-2.1 2.086Z"
      fill={color}
    />
    <Path
      d="M23.297 9.89a.703.703 0 0 0-.703.704v.703a1.41 1.41 0 0 1-1.708 1.376c-.93-3.227-3.91-5.595-7.433-5.595H8.755a.67.67 0 0 1-.504-.223 3.502 3.502 0 0 0-2.626-1.183h-2.11a.703.703 0 0 0-.683.869l.712 2.932a7.688 7.688 0 0 0-1.295 1.824h-.14c-1.163 0-2.109.946-2.109 2.11v2.52c0 .893.565 1.692 1.407 1.99l.773.272a7.833 7.833 0 0 0 1.762 2.397c.103.094.277.291.277.557v2.154c0 .388.315.703.703.703h2.812a.703.703 0 0 0 .704-.703v-.735c.233.021.468.032.703.032h4.312c.235 0 .47-.01.703-.032v.735c0 .388.315.703.703.703h2.813a.703.703 0 0 0 .703-.703v-1.56c0-.545.22-1.072.621-1.483 1.29-1.327 2.192-3.31 2.192-5.442 0-.237-.012-.471-.033-.703l.036.001A2.814 2.814 0 0 0 24 11.297v-.703a.703.703 0 0 0-.703-.703Zm-5.309 9.383a3.525 3.525 0 0 0-1.02 2.464v.857h-1.405v-2.11a.703.703 0 1 0-1.407 0v.664a6.44 6.44 0 0 1-.703.04H9.141c-.236 0-.47-.014-.704-.04v-.664a.703.703 0 0 0-1.406 0v2.11H5.625v-1.451c0-.598-.262-1.166-.738-1.598-.636-.578-1.171-1.34-1.548-2.202a.703.703 0 0 0-.41-.381l-1.054-.372a.704.704 0 0 1-.469-.663v-2.52c0-.389.316-.704.703-.704h.57a.703.703 0 0 0 .658-.418l.001-.002v-.001a6.306 6.306 0 0 1 1.465-2.077.703.703 0 0 0 .198-.692L4.41 7.078h1.215c.602 0 1.175.258 1.571.707.392.445.96.7 1.56.7h4.697a6.335 6.335 0 0 1 6.328 6.328c0 1.766-.759 3.398-1.793 4.46Z"
      fill={color}
    />
  </Svg>
);

export default IconCategFinance;
