import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const LegIconAmount = ({ size, style, ...props }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style} {...props}>
    <Path
      d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0Zm0 22C6.23 22 2 17.77 2 12S6.23 2 12 2s10 4.23 10 10-4.23 10-10 10Z"
      fill="currentColor"
    />
    <Path
      d="M12.172 7.782c1.262 0 2.448.794 3.098 2.073a.768.768 0 0 0 1.37-.696c-.914-1.796-2.626-2.913-4.468-2.913-2.085 0-3.884 1.398-4.69 3.4H6.249a.768.768 0 0 0 0 1.537h.837a6.454 6.454 0 0 0-.026 1.4H5.921a.768.768 0 1 0 0 1.537h1.473c.755 2.127 2.612 3.635 4.778 3.635 1.843 0 3.555-1.117 4.468-2.914a.768.768 0 0 0-1.37-.695c-.65 1.278-1.837 2.073-3.098 2.073-1.327 0-2.49-.845-3.114-2.1h3.28a.768.768 0 1 0-.001-1.535H8.603a4.945 4.945 0 0 1 .034-1.401h4.026a.769.769 0 0 0 0-1.536h-3.48c.648-1.124 1.746-1.865 2.99-1.865Z"
      fill="currentColor"
    />
  </Svg>
);

export default LegIconAmount;
