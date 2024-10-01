import { Banner, ContentWrapper, VSpacer } from "@pagopa/io-app-design-system";
import React from "react";
import I18n from "../../i18n";
import { useIONavigation } from "../../navigation/params/AppParamsList";
import ROUTES from "../../navigation/routes";
import { IOScrollViewWithLargeHeader } from "../../components/ui/IOScrollViewWithLargeHeader";
import { IOScrollViewActions } from "../../components/ui/IOScrollView";

/**
 * A screen to explain how the account removal works.
 * Here user can ask to delete his account
 */
const RemoveAccountInfoAlternative = () => {
  const { navigate } = useIONavigation();

  const actions: IOScrollViewActions = {
    type: "TwoButtons",
    primary: {
      label: I18n.t("global.buttons.confirm"),
      accessibilityLabel: I18n.t("global.buttons.confirm"),
      onPress: () =>
        navigate(ROUTES.PROFILE_NAVIGATOR, {
          screen: ROUTES.PROFILE_REMOVE_ACCOUNT_DETAILS_ALTERNATIVE
        })
    },
    secondary: {
      label: I18n.t("global.buttons.cancel"),
      accessibilityLabel: I18n.t("global.buttons.cancel"),
      onPress: () =>
        navigate(ROUTES.MAIN, {
          screen: ROUTES.WALLET_HOME,
          params: { newMethodAdded: false }
        })
    }
  };

  return (
    <IOScrollViewWithLargeHeader
      title={{
        label: I18n.t("profile.main.privacy.removeAccount.info.title")
      }}
      description={I18n.t(
        "profile.main.privacy.removeAccount.info.description"
      )}
      actions={actions}
    >
      <VSpacer size={8} />
      <ContentWrapper>
        <Banner
          color="neutral"
          size="big"
          pictogramName="attention"
          content={I18n.t("profile.main.privacy.removeAccount.info.banner")}
        />
      </ContentWrapper>
    </IOScrollViewWithLargeHeader>
  );
};

export default RemoveAccountInfoAlternative;
