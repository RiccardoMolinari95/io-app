import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import NewProfileRemoveAccountSuccess from "../screens/NewProfileRemoveAccountSuccessScreen";
import NewProfileRemoveAccountInfo from "../screens/NewProfileRemoveAccountInfoScreen";
import NewProfileRemoveAccountDetails from "../screens/NewProfileRemoveAccountDetailsScreen";
import ROUTES from "../../../navigation/routes";
import { NewProfileParamsList } from "./params/NewProfileParamsList";

const Stack = createStackNavigator<NewProfileParamsList>();

/**
 * A navigator for all the screens of the New Profile section
 */
const NewProfileStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={ROUTES.NEW_PROFILE_REMOVE_ACCOUNT_INFO}
      component={NewProfileRemoveAccountInfo}
    />
    <Stack.Screen
      name={ROUTES.NEW_PROFILE_REMOVE_ACCOUNT_DETAILS}
      component={NewProfileRemoveAccountDetails}
    />
    <Stack.Screen
      options={{
        headerShown: false
      }}
      name={ROUTES.NEW_PROFILE_REMOVE_ACCOUNT_SUCCESS}
      component={NewProfileRemoveAccountSuccess}
    />
  </Stack.Navigator>
);

export default NewProfileStackNavigator;
