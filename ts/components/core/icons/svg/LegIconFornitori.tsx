import React from "react";
import { Svg, Path } from "react-native-svg";
import { SVGIconProps } from "../Icon";

const LegIconFornitori = ({ size, style, ...props }: SVGIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style} {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 1c-1.731 0-3.48.223-4.848.7-1.343.468-2.399 1.212-2.609 2.307A.666.666 0 0 0 5 4.243c0 .024.004.054.007.075v.001c-.002.014-.007.04-.007.07v15.317c0 .138.021.275.064.407.284 1.124 1.44 1.836 2.813 2.268 1.393.44 3.098.619 4.623.619 1.525 0 3.23-.18 4.624-.619 1.373-.432 2.529-1.144 2.812-2.268a1.33 1.33 0 0 0 .064-.407V4.402c0-1.245-1.039-2.093-2.424-2.621C16.175 1.247 14.326 1 12.5 1ZM6.436 4.312a.865.865 0 0 1-.088-.096c.06-.241.243-.478.559-.704.346-.248.831-.464 1.416-.642 1.17-.355 2.69-.542 4.177-.542 1.437 0 2.909.174 4.064.507.577.166 1.066.37 1.429.603.336.217.545.446.636.68l-.002.011a.717.717 0 0 0-.007.035.668.668 0 0 1-.087.112c-.066.069-.165.152-.299.246-.267.186-.66.4-1.18.602-1.04.405-2.573.758-4.588.758-1.973 0-3.482-.338-4.519-.731a6.022 6.022 0 0 1-1.193-.59 2.333 2.333 0 0 1-.318-.249Zm6.03 2.898c2.772 0 4.953-.639 6.218-1.414v3.327a.635.635 0 0 0-.064.208.666.666 0 0 1-.087.112c-.066.069-.165.152-.299.246-.267.186-.66.4-1.18.602-1.04.405-2.573.758-4.588.758-2.014 0-3.547-.353-4.586-.757a5.77 5.77 0 0 1-1.18-.6 2.04 2.04 0 0 1-.3-.245.661.661 0 0 1-.084-.107V5.837c1.275.757 3.429 1.373 6.15 1.373Zm0 5.167c2.772 0 4.953-.638 6.218-1.414v3.327a.634.634 0 0 0-.064.208.649.649 0 0 1-.087.112c-.066.069-.165.153-.299.246-.267.186-.66.4-1.18.603-1.04.404-2.573.758-4.588.758-2.014 0-3.547-.354-4.586-.758a5.775 5.775 0 0 1-1.18-.6 2.038 2.038 0 0 1-.3-.245.67.67 0 0 1-.084-.107v-3.502c1.275.756 3.428 1.372 6.15 1.372Zm6.218 7.327.215.074-.219-.062-.013.046-.003.011c-.054.23-.229.468-.55.701-.319.232-.764.444-1.317.624-1.105.358-2.606.574-4.297.574-1.691 0-3.192-.216-4.297-.574-.553-.18-.998-.392-1.317-.624-.32-.233-.496-.472-.55-.7l-.018-.065-.002-.006v-3.531c1.275.757 3.429 1.372 6.15 1.372 2.772 0 4.953-.638 6.218-1.414v3.576-.002Z"
      fill="currentColor"
    />
  </Svg>
);

export default LegIconFornitori;
