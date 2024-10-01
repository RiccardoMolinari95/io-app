import React, { useMemo } from "react";
import I18n from "../../i18n";
import ROUTES from "../../navigation/routes";
import { useIONavigation } from "../../navigation/params/AppParamsList";
import { OperationResultScreenContent } from "../../components/screens/OperationResultScreenContent";

/**
 * A screen to explain how the account removal works.
 * Here user can ask to delete his account
 */
const RemoveAccountSuccessAlternative = () => {
  const { navigate } = useIONavigation();

  const actions = useMemo(
    () => ({
      label: I18n.t("profile.main.privacy.removeAccount.success.cta"),
      accessibilityLabel: I18n.t(
        "profile.main.privacy.removeAccount.success.cta"
      ),
      onPress: () =>
        navigate(ROUTES.MAIN, {
          screen: ROUTES.WALLET_HOME,
          params: { newMethodAdded: false }
        })
    }),
    [navigate]
  );

  return (
    <OperationResultScreenContent
      title={I18n.t("profile.main.privacy.removeAccount.success.title")}
      action={actions}
    />
  );
};

export default RemoveAccountSuccessAlternative;
