/* eslint-disable no-underscore-dangle */
import { useSelector } from "@xstate/react";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Body,
  FooterWithButtons,
  H1,
  IOColors,
  IOStyles,
  Icon,
  PressableListItemBase,
  VSpacer
} from "@pagopa/io-app-design-system";
import { H4 } from "../../../../components/core/typography/H4";
import { useNavigationSwipeBackListener } from "../../../../hooks/useNavigationSwipeBackListener";
import I18n from "../../../../i18n";
import { useOnboardingMachineService } from "../xstate/provider";
import {
  criteriaToDisplaySelector,
  prerequisiteAnswerIndexSelector
} from "../xstate/selectors";
import { Link } from "../../../../components/core/typography/Link";
import { useHeaderSecondLevel } from "../../../../hooks/useHeaderSecondLevel";

type ListItemProps = {
  text: string;
  checked: boolean;
  onPress: () => void;
};

const CustomListItem = ({ text, onPress, checked }: ListItemProps) => (
  <View style={styles.outerListItem}>
    <PressableListItemBase onPress={onPress}>
      <View
        style={[IOStyles.flex, IOStyles.rowSpaceBetween, styles.innerListItem]}
      >
        <H4 weight={checked ? "Semibold" : "Regular"} color={"bluegreyDark"}>
          {text}
        </H4>
        <Icon
          name={checked ? "legRadioOn" : "legRadioOff"}
          size={24}
          color={checked ? "blue" : "bluegrey"}
        />
      </View>
    </PressableListItemBase>
  </View>
);

const MultiValuePrerequisitesScreen = () => {
  const machine = useOnboardingMachineService();

  const currentPrerequisite = useSelector(machine, criteriaToDisplaySelector);
  const possiblySelectedIndex = useSelector(
    machine,
    prerequisiteAnswerIndexSelector
  );

  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(
    possiblySelectedIndex
  );

  const continueOnPress = () => {
    if (selectedIndex === undefined) {
      return null;
    }
    machine.send("SELECT_MULTI_CONSENT", {
      data: {
        _type: currentPrerequisite._type,
        value: currentPrerequisite.value[selectedIndex],
        code: currentPrerequisite.code
      }
    });

    return null;
  };
  const goBack = () => machine.send("BACK");

  useNavigationSwipeBackListener(() => {
    machine.send({ type: "BACK", skipNavigation: true });
  });

  useHeaderSecondLevel({
    title: I18n.t("idpay.onboarding.headerTitle"),
    goBack,
    supportRequest: false
  });

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          IOStyles.horizontalContentPadding,
          { flexGrow: 1 }
        ]}
      >
        <H1>{I18n.t("idpay.onboarding.multiPrerequisites.header")}</H1>
        <VSpacer size={16} />
        <Body>{I18n.t("idpay.onboarding.multiPrerequisites.body")}</Body>
        <Link>{I18n.t("idpay.onboarding.multiPrerequisites.link")}</Link>
        <VSpacer size={24} />
        <H4>{currentPrerequisite.description}</H4>

        {currentPrerequisite.value.map((answer, index) => (
          <CustomListItem
            key={index}
            text={answer}
            checked={index === selectedIndex}
            onPress={() => setSelectedIndex(index)}
          />
        ))}
      </ScrollView>

      <FooterWithButtons
        type="TwoButtonsInlineHalf"
        primary={{
          type: "Outline",
          buttonProps: {
            label: I18n.t("global.buttons.back"),
            onPress: goBack
          }
        }}
        secondary={{
          type: "Solid",
          buttonProps: {
            label: I18n.t("global.buttons.continue"),
            onPress: continueOnPress,
            disabled: selectedIndex === undefined
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  outerListItem: {
    borderBottomWidth: 1,
    borderBottomColor: IOColors["grey-100"]
  },
  innerListItem: {
    paddingVertical: 4
  }
});

export default MultiValuePrerequisitesScreen;
