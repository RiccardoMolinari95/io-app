import {
  FooterWithButtons,
  HSpacer,
  Icon,
  VSpacer
} from "@pagopa/io-app-design-system";
import { useSelector } from "@xstate/react";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import React from "react";
import { ScrollView, View } from "react-native";
import { Iban } from "../../../../../definitions/backend/Iban";
import { LabelledItem } from "../../../../components/LabelledItem";
import { Body } from "../../../../components/core/typography/Body";
import { H1 } from "../../../../components/core/typography/H1";
import { LabelSmall } from "../../../../components/core/typography/LabelSmall";
import { Link } from "../../../../components/core/typography/Link";
import { IOStyles } from "../../../../components/core/variables/IOStyles";
import BaseScreenComponent from "../../../../components/screens/BaseScreenComponent";
import { useNavigationSwipeBackListener } from "../../../../hooks/useNavigationSwipeBackListener";
import I18n from "../../../../i18n";
import { emptyContextualHelp } from "../../../../utils/emptyContextualHelp";
import { useConfigurationMachineService } from "../xstate/provider";
import { isLoadingSelector } from "../xstate/selectors";
import { useIOSelector } from "../../../../store/hooks";
import { isSettingsVisibleAndHideProfileSelector } from "../../../../store/reducers/backendStatus";

const IbanOnboardingScreen = () => {
  const configurationMachine = useConfigurationMachineService();
  const customGoBack = () => configurationMachine.send({ type: "BACK" });
  const [iban, setIban] = React.useState<string | undefined>(undefined);
  const [ibanName, setIbanName] = React.useState<string | undefined>(undefined);
  const isLoading = useSelector(configurationMachine, isLoadingSelector);
  const isSettingsVisibleAndHideProfile = useIOSelector(
    isSettingsVisibleAndHideProfileSelector
  );

  const isIbanValid = () =>
    pipe(
      iban,
      O.fromNullable,
      O.fold(
        () => undefined,
        iban => E.isRight(Iban.decode(iban))
      )
    );

  const isIbanNameValid = () =>
    pipe(
      ibanName,
      O.fromNullable,
      O.fold(
        () => undefined,
        ibanName => ibanName.length > 0
      )
    );

  useNavigationSwipeBackListener(() => {
    configurationMachine.send({ type: "BACK", skipNavigation: true });
  });

  return (
    <BaseScreenComponent
      goBack={customGoBack}
      headerTitle={I18n.t("idpay.configuration.headerTitle")}
      contextualHelp={emptyContextualHelp}
    >
      <ScrollView style={[IOStyles.flex, IOStyles.horizontalContentPadding]}>
        <VSpacer size={16} />
        <H1>{I18n.t("idpay.configuration.iban.onboarding.header")}</H1>
        <VSpacer size={16} />
        <Body>{I18n.t("idpay.configuration.iban.onboarding.body")}</Body>
        <Link>{I18n.t("idpay.configuration.iban.onboarding.bodyLink")}</Link>
        <VSpacer size={24} />
        <LabelledItem
          isValid={isIbanValid()}
          label="IBAN"
          inputMaskProps={{
            type: "custom",
            options: {
              mask: "AA99A9999999999999999999999"
            },
            keyboardType: "default",
            value: iban,
            onChangeText: val => setIban(val)
          }}
        />
        <VSpacer size={16} />
        <LabelledItem
          label={I18n.t("idpay.configuration.iban.onboarding.nameAssignInput")}
          isValid={isIbanNameValid()}
          inputProps={{
            keyboardType: "default",
            returnKeyType: "done",
            value: ibanName,
            maxLength: 35,
            onChangeText: val => setIbanName(val)
          }}
        />
        <VSpacer size={16} />
        <View
          style={[
            IOStyles.row,
            {
              justifyContent: "center",
              alignItems: "center"
            }
          ]}
        >
          <Icon name="profile" size={30} color="bluegrey" />
          <HSpacer size={16} />
          <LabelSmall color="bluegrey" weight="Regular">
            {isSettingsVisibleAndHideProfile
              ? I18n.t("idpay.configuration.iban.onboarding.bottomLabel")
              : I18n.t("idpay.configuration.iban.onboarding.legacyBottomLabel")}
          </LabelSmall>
        </View>
      </ScrollView>
      <FooterWithButtons
        type="SingleButton"
        primary={{
          type: "Solid",
          buttonProps: {
            label: I18n.t("global.buttons.continue"),
            loading: isLoading,
            disabled: isLoading || !isIbanValid(),
            onPress: () => {
              const isDataSendable =
                iban !== undefined &&
                ibanName !== undefined &&
                ibanName.length > 0;
              if (isDataSendable) {
                configurationMachine.send({
                  type: "CONFIRM_IBAN",
                  ibanBody: { iban, description: ibanName }
                });
              } else {
                setIbanName(""); // force re-render to show error in the UI
              }
            }
          }
        }}
      />
    </BaseScreenComponent>
  );
};

export default IbanOnboardingScreen;
