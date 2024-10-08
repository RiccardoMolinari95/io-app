import * as React from "react";
import type { IOColors } from "@pagopa/io-app-design-system";
import { IOFontFamily, IOFontWeight } from "../fonts";
import { useTypographyFactory } from "./Factory";
import { ExternalTypographyProps, TypographyProps } from "./common";

type AllowedColors = IOColors;
type AllowedWeight = Extract<IOFontWeight, "Semibold" | "Bold">;

type OwnProps = ExternalTypographyProps<
  TypographyProps<AllowedWeight, AllowedColors>
>;

const fontName: IOFontFamily = "TitilliumSansPro";
const fontSize = 16;
export const linkDefaultColor: AllowedColors = "blue";
export const linkDefaultWeight: AllowedWeight = "Semibold";

/**
 * Typography component to render `Link` text with font size {@link fontSize} and fontFamily {@link fontName}.
 * default values(if not defined) are weight: `Semibold`, color: `blue`
 * @param props`
 * @constructor
 * @deprecated Don't use local `Link`. Import `LabelLink` from `io-app-design-system` instead.
 */
export const Link: React.FunctionComponent<OwnProps> = props =>
  useTypographyFactory<AllowedWeight, AllowedColors>({
    accessibilityRole: props.onPress ? "link" : undefined,
    ...props,
    defaultWeight: linkDefaultWeight,
    defaultColor: linkDefaultColor,
    font: fontName,
    fontStyle: {
      fontSize,
      textDecorationLine: "underline"
    }
  });
