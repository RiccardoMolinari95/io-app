import {
  ButtonSolid,
  IOStyles,
  ListItemHeader
} from "@pagopa/io-app-design-system";
import * as React from "react";
import { Alert, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import * as pot from "@pagopa/ts-commons/lib/pot";
import { useCallback } from "react";
import I18n from "../../../i18n";
import { useIODispatch, useIOSelector } from "../../../store/hooks";
import { isItwEnabledSelector } from "../../../store/reducers/backendStatus";
import { ItwDiscoveryBanner } from "../../itwallet/common/components/ItwDiscoveryBanner";
import { itwLifecycleIsValidSelector } from "../../itwallet/lifecycle/store/selectors";
import { isItwTrialActiveSelector } from "../../trialSystem/store/reducers";
import {
  selectIsWalletCardsLoading,
  selectSortedWalletCards,
  selectWalletItwCards,
  selectWalletOtherCards
} from "../store/selectors";
import { useIONavigation } from "../../../navigation/params/AppParamsList";
import { userDataProcessingSelector } from "../../../store/reducers/userDataProcessing";
import ROUTES from "../../../navigation/routes";
import { UserDataProcessingStatusEnum } from "../../../../definitions/backend/UserDataProcessingStatus";
import { UserDataProcessingChoiceEnum } from "../../../../definitions/backend/UserDataProcessingChoice";
import { deleteUserDataProcessing } from "../../../store/actions/userDataProcessing";
import { WalletEmptyScreenContent } from "./WalletEmptyScreenContent";
import {
  WalletCardsCategoryContainer,
  WalletCardsCategoryContainerProps
} from "./WalletCardsCategoryContainer";
import { WalletCardSkeleton } from "./WalletCardSkeleton";

const WalletCardsContainer = () => {
  const isLoading = useIOSelector(selectIsWalletCardsLoading);
  const cards = useIOSelector(selectSortedWalletCards);
  const stackCards = cards.length > 4;
  const { navigate } = useIONavigation();
  const dispatch = useIODispatch();
  const userDataProcessing = useIOSelector(userDataProcessingSelector);
  const isPendingDelete =
    pot.isSome(userDataProcessing.DELETE) &&
    userDataProcessing.DELETE.value?.status ===
      UserDataProcessingStatusEnum.PENDING;

  const handleRecoverAccountAlert = useCallback(() => {
    Alert.alert(
      I18n.t("profile.main.privacy.removeAccount.alert.oldRequest"),
      I18n.t("profile.main.privacy.removeAccount.alert.oldRequestSubtitle"),
      [
        {
          text: I18n.t("profile.main.privacy.removeAccount.alert.cta.return"),
          style: "cancel"
        },
        {
          text: I18n.t("profile.main.privacy.removeAccount.alert.cta.cancel"),
          style: "destructive",
          onPress: () => {
            dispatch(
              deleteUserDataProcessing.request(
                UserDataProcessingChoiceEnum.DELETE
              )
            );
          }
        }
      ]
    );
  }, [dispatch]);

  if (isLoading && cards.length === 0) {
    return (
      <WalletCardSkeleton
        testID="walletCardSkeletonTestID"
        cardProps={{}}
        isStacked={false}
      />
    );
  }

  if (cards.length === 0) {
    // In this case we can display the empty state: we do not have cards to display and
    // the wallet is not in a loading state anymore
    return <WalletEmptyScreenContent />;
  }

  return (
    <Animated.View
      style={IOStyles.flex}
      layout={LinearTransition.duration(200)}
    >
      <View testID="walletCardsContainerTestID">
        {isPendingDelete ? (
          <ButtonSolid
            label={I18n.t("profile.main.privacy.removeAccount.recover")}
            color="primary"
            onPress={handleRecoverAccountAlert}
          />
        ) : (
          <ButtonSolid
            label={I18n.t("profile.main.privacy.removeAccount.details.cta")}
            color="danger"
            onPress={() =>
              navigate(ROUTES.PROFILE_NAVIGATOR, {
                screen: ROUTES.PROFILE_REMOVE_ACCOUNT_INFO_ALTERNATIVE
              })
            }
          />
        )}
        <ItwCardsContainer isStacked={stackCards} />
        <OtherCardsContainer isStacked={stackCards} />
      </View>
    </Animated.View>
  );
};

const ItwCardsContainer = ({
  isStacked
}: Pick<WalletCardsCategoryContainerProps, "isStacked">) => {
  const cards = useIOSelector(selectWalletItwCards);
  const isItwTrialEnabled = useIOSelector(isItwTrialActiveSelector);
  const isItwValid = useIOSelector(itwLifecycleIsValidSelector);
  const isItwEnabled = useIOSelector(isItwEnabledSelector);

  if (!isItwTrialEnabled || !isItwEnabled) {
    return null;
  }

  const endElement: ListItemHeader["endElement"] = isItwValid
    ? {
        type: "badge",
        componentProps: {
          text: I18n.t("features.itWallet.wallet.active"),
          variant: "blue",
          testID: "walletCardsCategoryItwActiveBadgeTestID"
        }
      }
    : {
        type: "badge",
        componentProps: {
          text: I18n.t("features.itWallet.wallet.inactive"),
          variant: "default",
          testID: "walletCardsCategoryItwInactiveBadgeTestID"
        }
      };

  return (
    <WalletCardsCategoryContainer
      key={`cards_category_itw`}
      testID={`walletCardsCategoryTestID_itw`}
      cards={cards}
      isStacked={isStacked}
      header={{
        label: I18n.t("features.wallet.cards.categories.itw"),
        endElement
      }}
      footer={<ItwDiscoveryBanner ignoreMargins={true} />}
    />
  );
};

const OtherCardsContainer = ({
  isStacked
}: Pick<WalletCardsCategoryContainerProps, "isStacked">) => {
  const cards = useIOSelector(selectWalletOtherCards);
  const isItwTrialEnabled = useIOSelector(isItwTrialActiveSelector);
  const isItwEnabled = useIOSelector(isItwEnabledSelector);

  if (cards.length === 0) {
    return null;
  }

  return (
    <WalletCardsCategoryContainer
      key={`cards_category_other`}
      testID={`walletCardsCategoryTestID_other`}
      cards={cards}
      isStacked={isStacked}
      header={
        isItwTrialEnabled && isItwEnabled
          ? {
              label: I18n.t("features.wallet.cards.categories.other")
            }
          : undefined
      }
    />
  );
};

export { WalletCardsContainer };
