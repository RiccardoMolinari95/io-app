import {
  ButtonSolid,
  ContentWrapper,
  Divider,
  H4,
  ListItemHeader,
  ListItemInfo,
  ListItemSwitch,
  VSpacer
} from "@pagopa/io-app-design-system";
import React, { useCallback, useEffect, useMemo } from "react";
import * as pot from "@pagopa/ts-commons/lib/pot";
import { View } from "react-native";
import { capitalize } from "lodash";
import { useIODispatch, useIOSelector } from "../../../store/hooks";
import { ContextualHelpPropsMarkdown } from "../../../components/screens/BaseScreenComponent";
import { newProfileSelector } from "../store/reducers/newProfile";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinnerOverlay";
import { formatDateAsLocal } from "../../../utils/dates";
import { IOScrollViewWithLargeHeader } from "../../../components/ui/IOScrollViewWithLargeHeader";
import { newProfileLoadRequest } from "../store/actions/newProfile";
import I18n from "../../../i18n";
import { userDataProcessingSelector } from "../../../store/reducers/userDataProcessing";
import { UserDataProcessingStatusEnum } from "../../../../definitions/backend/UserDataProcessingStatus";
import ROUTES from "../../../navigation/routes";
import { useIONavigation } from "../../../navigation/params/AppParamsList";

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "profile.preferences.contextualHelpTitle",
  body: "profile.preferences.contextualHelpContent"
};

const NewProfileDataScreen = () => {
  const { navigate } = useIONavigation();
  const profileSelector = useIOSelector(newProfileSelector);
  const userDataProcessing = useIOSelector(userDataProcessingSelector);
  const dispatch = useIODispatch();
  const isNoneDelete = pot.isNone(userDataProcessing.DELETE);
  const isPendingDelete =
    pot.isSome(userDataProcessing.DELETE) &&
    userDataProcessing.DELETE.value?.status ===
      UserDataProcessingStatusEnum.PENDING;

  useEffect(() => {
    dispatch(newProfileLoadRequest());
  }, [dispatch]);

  const handleSwitchValueChange = useCallback(() => {
    navigate(ROUTES.PROFILE_NAVIGATOR, {
      screen: ROUTES.NEW_PROFILE_REMOVE_ACCOUNT_INFO
    });
  }, [navigate]);

  const switchItems = useMemo(
    () => [
      {
        label: I18n.t("profile.data.deletion.status"),
        value: !isNoneDelete && isPendingDelete,
        onSwitchValueChange: handleSwitchValueChange,
        disabled: isPendingDelete
      }
    ],
    [isNoneDelete, isPendingDelete, handleSwitchValueChange]
  );

  const renderProfileInfo = () => {
    if (pot.isLoading(profileSelector)) {
      return (
        <>
          <H4>{I18n.t("profile.data.loading")}</H4>
          <LoadingSpinnerOverlay isLoading={true} />
        </>
      );
    }

    if (pot.isError(profileSelector)) {
      return (
        <>
          <H4>{I18n.t("profile.data.error")}</H4>
          <VSpacer size={16} />
          <ButtonSolid
            label={I18n.t("profile.data.retry")}
            color="primary"
            onPress={() => dispatch(newProfileLoadRequest())}
          />
          <VSpacer size={32} />
        </>
      );
    }

    if (pot.isSome(profileSelector) && profileSelector.value) {
      const profile = profileSelector.value;
      const nameAndSurname = capitalize(
        `${profile.name} ${profile.familyName}`
      );
      const fiscalCode = profile.fiscalCode;
      const email = profile.email;
      const birthDate = profile.dateOfBirth;

      return (
        <View>
          {nameAndSurname && (
            <ListItemInfo
              label={I18n.t("profile.data.list.nameSurname")}
              icon="profile"
              value={nameAndSurname}
              testID="name-surname"
            />
          )}
          <Divider />
          {fiscalCode && (
            <ListItemInfo
              label={I18n.t("profile.data.list.fiscalCode")}
              icon={"creditCard"}
              testID="show-fiscal-code"
              value={profile.fiscalCode}
            />
          )}
          <Divider />
          {email && (
            <ListItemInfo
              label={I18n.t("profile.data.list.email")}
              value={profile.email}
              icon={"email"}
              testID="insert-or-edit-email"
            />
          )}
          <Divider />
          {birthDate && (
            <ListItemInfo
              label={I18n.t("profile.data.list.birthDate")}
              icon={"calendar"}
              testID="date-of-birth"
              value={formatDateAsLocal(birthDate, true)}
            />
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <IOScrollViewWithLargeHeader
      title={{
        label: I18n.t("profile.data.profileTitle")
      }}
      description={I18n.t("profile.data.subtitle")}
      headerActionsProp={{ showHelp: true }}
      contextualHelpMarkdown={contextualHelpMarkdown}
    >
      <ContentWrapper>
        {renderProfileInfo()}
        <Divider />
        <VSpacer size={24} />
        <ListItemHeader label={I18n.t("profile.data.deletion.title")} />
        <LoadingSpinnerOverlay isLoading={isPendingDelete} />
        {switchItems.map((item, index) => (
          <ListItemSwitch
            key={index}
            label={item.label}
            value={item.value}
            onSwitchValueChange={item.onSwitchValueChange}
            disabled={item.disabled}
          />
        ))}
      </ContentWrapper>
    </IOScrollViewWithLargeHeader>
  );
};

export default NewProfileDataScreen;
