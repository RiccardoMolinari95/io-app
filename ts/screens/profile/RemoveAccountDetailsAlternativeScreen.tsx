import {
  ContentWrapper,
  Divider,
  ListItemInfo,
  VSpacer,
  useIOToast
} from "@pagopa/io-app-design-system";
import React, { useCallback, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { IOStyles } from "../../components/core/variables/IOStyles";
import I18n from "../../i18n";

import { useIODispatch, useIOSelector } from "../../store/hooks";
import { IOScrollViewWithLargeHeader } from "../../components/ui/IOScrollViewWithLargeHeader";
import { useIONavigation } from "../../navigation/params/AppParamsList";
import ROUTES from "../../navigation/routes";
import {
  dateOfBirthSelector,
  profileEmailSelector,
  profileFiscalCodeSelector,
  profileNameSurnameSelector
} from "../../store/reducers/profile";
import { formatDateAsShortFormat } from "../../utils/dates";
import {
  isUserDataProcessingDeleteErrorSelector,
  isUserDataProcessingDeleteLoadingSelector
} from "../../store/reducers/userDataProcessing";
import LoadingSpinnerOverlay from "../../components/LoadingSpinnerOverlay";
import { FooterActions } from "../../components/ui/FooterActions";
import { requestAccountDeletion } from "../../store/actions/profile";
/**
 * A screen that ask user the motivation of the account removal
 * Here user can ask to delete his account
 */
const RemoveAccountDetailsAlternative = () => {
  const { navigate } = useIONavigation();

  const profileEmail = useIOSelector(profileEmailSelector);
  const nameSurname = useIOSelector(profileNameSurnameSelector);
  const fiscalCode = useIOSelector(profileFiscalCodeSelector);
  const dateOfBirth = useIOSelector(dateOfBirthSelector);
  const dispatch = useIODispatch();
  const isLoading = useIOSelector(isUserDataProcessingDeleteLoadingSelector);
  const isError = useIOSelector(isUserDataProcessingDeleteErrorSelector);
  const toast = useIOToast();

  const handleDeleteProfile = useCallback(() => {
    dispatch(requestAccountDeletion());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    handleDeleteProfile();
  }, [handleDeleteProfile]);

  useEffect(() => {
    if (isError) {
      toast.error(I18n.t("genericError"));
    }
  }, [isError, toast]);

  const email = useMemo(
    () =>
      pipe(
        profileEmail,
        O.getOrElse(() => I18n.t("global.remoteStates.notAvailable"))
      ),
    [profileEmail]
  );

  const dateOfBirthFormatted = useMemo(
    () =>
      pipe(
        dateOfBirth,
        O.map(date => formatDateAsShortFormat(date)),
        O.getOrElse(() => I18n.t("global.remoteStates.notAvailable"))
      ),
    [dateOfBirth]
  );

  return (
    <>
      <IOScrollViewWithLargeHeader
        title={{
          label: I18n.t(
            "profile.main.privacy.removeAccount.details.alternativeTitle"
          )
        }}
        description={I18n.t(
          "profile.main.privacy.removeAccount.details.alternativeBody"
        )}
      >
        <SafeAreaView style={IOStyles.flex}>
          {<LoadingSpinnerOverlay isLoading={isLoading} loadingOpacity={1} />}
          <ContentWrapper>
            {/* Show name and surname */}
            {nameSurname && (
              <>
                <ListItemInfo
                  label={I18n.t("profile.data.list.nameSurname")}
                  icon="profile"
                  // accessibilityLabel={I18n.t("profile.data.list.nameSurname")}
                  value={nameSurname}
                  testID="name-surname"
                />
                <Divider />
              </>
            )}
            {/* Show fiscal code */}
            {fiscalCode && (
              <>
                <ListItemInfo
                  label={I18n.t("profile.data.list.fiscalCode")}
                  icon={"creditCard"}
                  // accessibilityLabel={I18n.t("profile.data.list.fiscalCode")}
                  testID="show-fiscal-code"
                  value={fiscalCode}
                />
                <Divider />
              </>
            )}
            {/* Insert or edit email */}
            <ListItemInfo
              label={I18n.t("profile.data.list.email")}
              // accessibilityLabel={I18n.t("profile.data.list.email")}
              value={email}
              icon={"email"}
              testID="insert-or-edit-email"
            />
            {/* Show date of birth */}
            {dateOfBirth && (
              <>
                <ListItemInfo
                  label={I18n.t("profile.data.list.birthDate")}
                  icon={"creditCard"}
                  testID="date-of-birth"
                  value={dateOfBirthFormatted}
                />
                <Divider />
              </>
            )}
          </ContentWrapper>
          <VSpacer />
        </SafeAreaView>
      </IOScrollViewWithLargeHeader>
      <FooterActions
        fixed={false}
        actions={{
          type: "TwoButtons",
          primary: isError
            ? {
                label: I18n.t("global.buttons.retry"),
                color: "danger",
                onPress: handleRetry
              }
            : {
                color: "danger",
                label: I18n.t("profile.main.privacy.removeAccount.info.cta"),
                onPress: handleDeleteProfile
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

export default RemoveAccountDetailsAlternative;
