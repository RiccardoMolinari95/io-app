/**
 * Main app entrypoint
 */
// Shim file generated by rn-nodeify
import "./shim";

import { AppRegistry, YellowBox } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from "react-native-exception-handler";

import { App } from "./ts/App";
import { mixpanel } from "./ts/mixpanel";

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    if (mixpanel) {
      mixpanel.track("APPLICATION_ERROR", {
        TYPE: "js",
        ERROR: JSON.stringify(e),
        APP_VERSION: DeviceInfo.getReadableVersion()
      });
    }
    Alert.alert(
      "Unexpected error occurred",
      `
        Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}
        You will need to restart the app.
        `
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);
setNativeExceptionHandler(exceptionString => {
  if (mixpanel) {
    mixpanel.track("APPLICATION_ERROR", {
      TYPE: "native",
      ERROR: exceptionString,
      APP_VERSION: DeviceInfo.getReadableVersion()
    });
  }
});

// Temporary workaround for @https://github.com/facebook/react-native/issues/18868
// TODO: Remove this as soon as it has been fixed @https://www.pivotaltracker.com/story/show/158144437
YellowBox.ignoreWarnings(["Warning: isMounted(...) is deprecated"]);

AppRegistry.registerComponent("ItaliaApp", () => App);
