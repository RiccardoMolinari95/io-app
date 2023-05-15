import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const LegIconEmojiSad = ({ size, style, ...props }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style} {...props}>
    <Path
      d="M8.25 9.75C9.07843 9.75 9.75 9.07843 9.75 8.25C9.75 7.42157 9.07843 6.75 8.25 6.75C7.42157 6.75 6.75 7.42157 6.75 8.25C6.75 9.07843 7.42157 9.75 8.25 9.75Z"
      fill="currentColor"
    />
    <Path
      d="M17.25 8.25C17.25 9.07843 16.5784 9.75 15.75 9.75C14.9216 9.75 14.25 9.07843 14.25 8.25C14.25 7.42157 14.9216 6.75 15.75 6.75C16.5784 6.75 17.25 7.42157 17.25 8.25Z"
      fill="currentColor"
    />
    <Path
      d="M7.14804 17.5371C6.98938 17.9197 6.55059 18.1013 6.16796 17.9426C5.78534 17.7839 5.60378 17.3451 5.76244 16.9625C6.10211 16.1434 6.6008 15.3997 7.22703 14.7735C8.48424 13.5162 10.1861 12.7964 12 12.7964C13.8139 12.7964 15.5158 13.5162 16.773 14.7735C17.3992 15.3997 17.8979 16.1434 18.2376 16.9625C18.3962 17.3451 18.2147 17.7839 17.832 17.9426C17.4494 18.1013 17.0106 17.9197 16.852 17.5371C16.588 16.9004 16.1999 16.3217 15.7123 15.8341C14.7336 14.8554 13.412 14.2964 12 14.2964C10.588 14.2964 9.26639 14.8554 8.28769 15.8341C7.80009 16.3217 7.41204 16.9004 7.14804 17.5371Z"
      fill="currentColor"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 22.5C6.201 22.5 1.5 17.799 1.5 12C1.5 6.201 6.201 1.5 12 1.5C17.799 1.5 22.5 6.201 22.5 12C22.5 17.799 17.799 22.5 12 22.5Z"
      fill="currentColor"
    />
  </Svg>
);

export default LegIconEmojiSad;
