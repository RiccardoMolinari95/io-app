import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const IconDocument = ({ size, style, ...props }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style} {...props}>
    <Path
      d="M8.703 9C8.315 9 8 9.336 8 9.75s.315.75.703.75h5.844c.388 0 .703-.336.703-.75S14.935 9 14.547 9H8.703ZM8 12.75c0-.414.308-.75.687-.75h6.876c.38 0 .687.336.687.75s-.308.75-.688.75H8.688c-.38 0-.687-.336-.687-.75ZM8.687 15c-.38 0-.687.336-.687.75s.308.75.687.75h6.876c.38 0 .687-.336.687-.75s-.308-.75-.688-.75H8.688ZM8 18.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
      fill="currentColor"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.281 6.098c0-.563-.22-1.093-.618-1.491l-1.988-1.99A2.095 2.095 0 0 0 15.183 2H7.11C5.946 2 5 2.946 5 4.11v15.78C5 21.055 5.946 22 7.11 22h10.062c1.163 0 2.11-.946 2.11-2.11V6.099Zm-1.406 13.793a.704.704 0 0 1-.703.703H7.109a.704.704 0 0 1-.703-.703V4.109c0-.387.316-.703.703-.703h6.547v3.516c0 .388.315.703.703.703h3.516v12.266ZM15.062 3.406h.034c.14-.002.373-.005.584.206l1.99 1.989c.208.209.206.436.205.588v.03h-2.813V3.406Z"
      fill="currentColor"
    />
  </Svg>
);

export default IconDocument;
