import React from "react";
import { createStore, PreloadedState } from "redux";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import { fireEvent } from "@testing-library/react-native";
import { renderScreenWithNavigationStoreContext } from "../../../utils/testWrapper";
import ProfileDataAlternativeScreen from "../ProfileDataAlternativeScreen";
import { appReducer } from "../../../store/reducers";
import { GlobalState } from "../../../store/reducers/types";
import ROUTES from "../../../navigation/routes";
import {
  profileAlternativeLoadRequest,
  profileAlternativeLoadSuccess,
  profileAlternativeLoadFailure
} from "../../../store/actions/profileAlternative";
import I18n from "../../../i18n";
import { applicationChangeState } from "../../../store/actions/application";
import { ServicesPreferencesModeEnum } from "../../../../definitions/backend/ServicesPreferencesMode";

const profileWithoutEmail = {
  is_inbox_enabled: true,
  is_email_enabled: true,
  is_webhook_enabled: true,
  is_email_already_taken: false,
  family_name: "Red",
  fiscal_code: "FiscalCode" as FiscalCode,
  has_profile: true,
  name: "Tom",
  service_preferences_settings: { mode: ServicesPreferencesModeEnum.AUTO },
  version: 1
};

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      ...actualNav.useNavigation(),
      navigate: mockNavigate
    })
  };
});

describe("ProfileDataAlternativeScreen", () => {
  it("should render loading components correctly", () => {
    const { component, store } = renderComponent();
    store.dispatch(profileAlternativeLoadRequest());

    expect(component.getByText(I18n.t("profile.data.loading"))).toBeTruthy();
  });

  it("should render error components correctly", () => {
    const { component, store } = renderComponent();
    const error = new Error("Network error");
    store.dispatch(profileAlternativeLoadFailure(error));

    expect(component.getByText(I18n.t("profile.data.error"))).toBeTruthy();
    expect(component.getByText(I18n.t("profile.data.retry"))).toBeTruthy();
  });

  it("should render success components correctly when loaded", () => {
    const { component, store } = renderComponent();
    store.dispatch(profileAlternativeLoadSuccess({ ...profileWithoutEmail }));

    expect(
      component.getByText(I18n.t("profile.data.list.nameSurname"))
    ).toBeTruthy();
    expect(
      component.getByText(I18n.t("profile.data.list.fiscalCode"))
    ).toBeTruthy();
  });

  it("should navigate to account removal info screen when switch is toggled", async () => {
    const { component, store } = renderComponent();

    store.dispatch(profileAlternativeLoadSuccess({ ...profileWithoutEmail }));

    const switchButton = component.getByTestId("toDeleteProfile");

    fireEvent(switchButton, "valueChange", true);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PROFILE_NAVIGATOR, {
      screen: ROUTES.PROFILE_REMOVE_ACCOUNT_INFO_ALTERNATIVE
    });
  });

  const renderComponent = () => {
    const globalState = appReducer(
      undefined,
      applicationChangeState("active")
    ) as PreloadedState<GlobalState>;
    const store = createStore(appReducer, globalState);

    return {
      component: renderScreenWithNavigationStoreContext<GlobalState>(
        () => <ProfileDataAlternativeScreen />,
        ROUTES.PROFILE_DATA,
        {},
        store
      ),
      store
    };
  };
});
