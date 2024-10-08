import { Banner, ContentWrapper, VSpacer } from "@pagopa/io-app-design-system";
import React from "react";
import I18n from "../../../i18n";
import { useIONavigation } from "../../../navigation/params/AppParamsList";
import ROUTES from "../../../navigation/routes";
import { IOScrollViewWithLargeHeader } from "../../../components/ui/IOScrollViewWithLargeHeader";
import { FooterActions } from "../../../components/ui/FooterActions";

/**
 * A screen to explain how the account removal works.
 * Here user can ask to delete his account
 */
const NewProfileRemoveAccountInfoScreen = () => {
  const { navigate } = useIONavigation();

  return (
    <>
      <IOScrollViewWithLargeHeader
        title={{
          label: I18n.t("profile.main.privacy.removeAccount.info.title")
        }}
        description={I18n.t(
          "profile.main.privacy.removeAccount.info.description"
        )}
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
      <FooterActions
        fixed={false}
        actions={{
          type: "TwoButtons",
          primary: {
            label: I18n.t("global.buttons.confirm"),
            accessibilityLabel: I18n.t("global.buttons.confirm"),
            onPress: () =>
              navigate(ROUTES.NEW_PROFILE_NAVIGATOR, {
                screen: ROUTES.NEW_PROFILE_REMOVE_ACCOUNT_DETAILS
              })
          },
          secondary: {
            label: I18n.t("global.buttons.cancel"),
            onPress: () =>
              navigate(ROUTES.MAIN, {
                screen: ROUTES.WALLET_HOME,
                params: { newMethodAdded: false }
              })
          }
        }}
      />
    </>
  );
};

export default NewProfileRemoveAccountInfoScreen;
