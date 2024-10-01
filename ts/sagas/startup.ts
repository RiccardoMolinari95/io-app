import * as pot from "@pagopa/ts-commons/lib/pot";
import { Millisecond } from "@pagopa/ts-commons/lib/units";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Alert } from "react-native";
import { channel } from "redux-saga";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  spawn,
  take,
  takeEvery,
  takeLatest
} from "typed-redux-saga/macro";
import { ActionType, getType } from "typesafe-actions";
import { UserDataProcessingChoiceEnum } from "../../definitions/backend/UserDataProcessingChoice";
import { UserDataProcessingStatusEnum } from "../../definitions/backend/UserDataProcessingStatus";
import { BackendClient } from "../api/backend";
import {
  apiUrlPrefix,
  cdcEnabled,
  euCovidCertificateEnabled,
  pagoPaApiUrlPrefix,
  pagoPaApiUrlPrefixTest,
  zendeskEnabled
} from "../config";
import { watchBonusCdcSaga } from "../features/bonus/cdc/saga";
import { watchBonusCgnSaga } from "../features/bonus/cgn/saga";
import { watchEUCovidCertificateSaga } from "../features/euCovidCert/saga";
import { setSecurityAdviceReadyToShow } from "../features/fastLogin/store/actions/securityAdviceActions";
import { refreshSessionToken } from "../features/fastLogin/store/actions/tokenRefreshActions";
import {
  isFastLoginEnabledSelector,
  tokenRefreshSelector
} from "../features/fastLogin/store/selectors";
import { watchFciSaga } from "../features/fci/saga";
import { watchIDPaySaga } from "../features/idpay/common/saga";
import { checkPublicKeyAndBlockIfNeeded } from "../features/lollipop/navigation";
import {
  checkLollipopSessionAssertionAndInvalidateIfNeeded,
  generateLollipopKeySaga,
  getKeyInfo
} from "../features/lollipop/saga";
import { lollipopPublicKeySelector } from "../features/lollipop/store/reducers/lollipop";
import { watchMessagesSaga } from "../features/messages/saga";
import { handleClearAllAttachments } from "../features/messages/saga/handleClearAttachments";
import { watchPnSaga } from "../features/pn/store/sagas/watchPnSaga";
import { watchPaymentsSaga } from "../features/payments/common/saga";
import {
  watchZendeskGetSessionSaga,
  watchZendeskSupportSaga
} from "../features/zendesk/saga";
import I18n from "../i18n";
import { mixpanelTrack } from "../mixpanel";
import NavigationService from "../navigation/NavigationService";
import {
  applicationInitialized,
  startApplicationInitialization
} from "../store/actions/application";
import { sessionExpired } from "../store/actions/authentication";
import { backendStatusLoadSuccess } from "../store/actions/backendStatus";
import { differentProfileLoggedIn } from "../store/actions/crossSessions";
import { previousInstallationDataDeleteSuccess } from "../store/actions/installation";
import { setMixpanelEnabled } from "../store/actions/mixpanel";
import { navigateToPrivacyScreen } from "../store/actions/navigation";
import { clearOnboarding } from "../store/actions/onboarding";
import { clearCache, resetProfileState } from "../store/actions/profile";
import {
  startupLoadSuccess,
  startupTransientError
} from "../store/actions/startup";
import { loadUserDataProcessing } from "../store/actions/userDataProcessing";
import {
  sessionInfoSelector,
  sessionTokenSelector
} from "../store/reducers/authentication";
import {
  backendStatusSelector,
  isPnEnabledSelector,
  isSettingsVisibleAndHideProfileSelector
} from "../store/reducers/backendStatus";
import { IdentificationResult } from "../store/reducers/identification";
import {
  isIdPayTestEnabledSelector,
  isPagoPATestEnabledSelector
} from "../store/reducers/persistedPreferences";
import {
  isProfileFirstOnBoarding,
  profileSelector
} from "../store/reducers/profile";
import {
  StartupStatusEnum,
  startupTransientErrorInitialState
} from "../store/reducers/startup";
import { ReduxSagaEffect, SagaCallReturnType } from "../types/utils";
import { trackKeychainGetFailure } from "../utils/analytics";
import { isTestEnv } from "../utils/environment";
import { walletPaymentHandlersInitialized } from "../store/actions/wallet/payment";
import { watchFimsSaga } from "../features/fims/common/saga";
import { deletePin, getPin } from "../utils/keychain";
import { watchEmailValidationSaga } from "../store/sagas/emailValidationPollingSaga";
import { handleIsKeyStrongboxBacked } from "../features/lollipop/utils/crypto";
import { watchWalletSaga as watchNewWalletSaga } from "../features/newWallet/saga";
import { watchServicesSaga } from "../features/services/common/saga";
import { watchItwSaga } from "../features/itwallet/common/saga";
import { watchTrialSystemSaga } from "../features/trialSystem/store/sagas/watchTrialSystemSaga";
import {
  handlePendingMessageStateIfAllowedSaga,
  updateInstallationSaga
} from "../features/pushNotifications/sagas/notifications";
import { checkNotificationsPreferencesSaga } from "../features/pushNotifications/sagas/checkNotificationsPreferencesSaga";
import { cancellAllLocalNotifications } from "../features/pushNotifications/utils";
import { handleApplicationStartupTransientError } from "../features/startup/sagas";
import {
  clearKeychainError,
  keychainError
} from "./../store/storages/keychain";
import { startAndReturnIdentificationResult } from "./identification";
import { previousInstallationDataDeleteSaga } from "./installation";
import {
  askMixpanelOptIn,
  handleSetMixpanelEnabled,
  initMixpanel,
  watchForActionsDifferentFromRequestLogoutThatMustResetMixpanel
} from "./mixpanel";
import { setLanguageFromProfileIfExists } from "./preferences";
import {
  loadProfile,
  watchProfile,
  watchProfileRefreshRequestsSaga,
  watchProfileUpsertRequestsSaga
} from "./profile";
import { askServicesPreferencesModeOptin } from "./services/servicesOptinSaga";
import { checkAppHistoryVersionSaga } from "./startup/appVersionHistorySaga";
import { authenticationSaga } from "./startup/authenticationSaga";
import { checkAcceptedTosSaga } from "./startup/checkAcceptedTosSaga";
import { checkAcknowledgedEmailSaga } from "./startup/checkAcknowledgedEmailSaga";
import { checkConfiguredPinSaga } from "./startup/checkConfiguredPinSaga";
import { watchEmailNotificationPreferencesSaga } from "./startup/checkEmailNotificationPreferencesSaga";
import { checkEmailSaga } from "./startup/checkEmailSaga";
import { checkProfileEnabledSaga } from "./startup/checkProfileEnabledSaga";
import { completeOnboardingSaga } from "./startup/completeOnboardingSaga";
import { loadSessionInformationSaga } from "./startup/loadSessionInformationSaga";
import { checkAcknowledgedFingerprintSaga } from "./startup/onboarding/biometric/checkAcknowledgedFingerprintSaga";
import { watchAbortOnboardingSaga } from "./startup/watchAbortOnboardingSaga";
import {
  checkSession,
  watchCheckSessionSaga
} from "./startup/watchCheckSessionSaga";
import { watchLogoutSaga } from "./startup/watchLogoutSaga";
import { watchSessionExpiredSaga } from "./startup/watchSessionExpiredSaga";
import { checkItWalletIdentitySaga } from "./startup/checkItWalletIdentitySaga";
import { watchUserDataProcessingSaga } from "./user/userDataProcessing";
import { watchWalletSaga } from "./wallet";
import { watchProfileEmailValidationChangedSaga } from "./watchProfileEmailValidationChangedSaga";
import { watchProfileRequest } from "./profileAlternative";

export const WAIT_INITIALIZE_SAGA = 5000 as Millisecond;
const navigatorPollingTime = 125 as Millisecond;
const warningWaitNavigatorTime = 2000 as Millisecond;

/**
 * Handles the application startup and the main application logic loop
 */
// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
export function* initializeApplicationSaga(
  startupAction?: ActionType<typeof startApplicationInitialization>
): Generator<ReduxSagaEffect, void, any> {
  const handleSessionExpiration = !!(
    startupAction?.payload && startupAction.payload.handleSessionExpiration
  );
  const showIdentificationModal =
    startupAction?.payload?.showIdentificationModalAtStartup ?? true;
  // Remove explicitly previous session data. This is done as completion of two
  // use cases:
  // 1. Logout with data reset
  // 2. FIXME: as a workaround for iOS only. Below iOS version 12.3 Keychain is
  //           not cleared between one installation and another, so it is
  //           needed to manually clear previous installation user info in
  //           order to force the user to choose unlock code and run through onboarding
  //           every new installation.

  // store the app version in the history, if the current version is not present
  yield* call(checkAppHistoryVersionSaga);
  // check if mixpanel could be initialized
  yield* call(initMixpanel);
  yield* call(waitForNavigatorServiceInitialization);

  // remove all local notifications (see function comment)
  yield* call(cancellAllLocalNotifications);
  yield* call(previousInstallationDataDeleteSaga);
  yield* put(previousInstallationDataDeleteSuccess());

  // listen for mixpanel enabling events
  yield* takeLatest(setMixpanelEnabled, handleSetMixpanelEnabled);

  if (zendeskEnabled) {
    yield* fork(watchZendeskSupportSaga);
  }

  // clear cached downloads when the logged user changes
  yield* takeEvery(differentProfileLoggedIn, handleClearAllAttachments);

  // Get last logged in Profile from the state
  const lastLoggedInProfileState: ReturnType<typeof profileSelector> =
    yield* select(profileSelector);

  const lastEmailValidated = pot.isSome(lastLoggedInProfileState)
    ? O.fromNullable(lastLoggedInProfileState.value.is_email_validated)
    : O.none;

  // Watch for profile changes
  yield* fork(watchProfileEmailValidationChangedSaga, lastEmailValidated);

  // Reset the profile cached in redux: at each startup we want to load a fresh
  // user profile.
  if (!handleSessionExpiration) {
    yield* put(resetProfileState());
  }

  // We need to generate a key in the application startup flow
  // to use this information on old app version already logged in users.
  // Here we are blocking the application startup, but we have the
  // the profile loading spinner active.

  yield* call(generateLollipopKeySaga);

  // This saga must retrieve the publicKey by its own,
  // since it must make sure to have the latest in-memory value
  // (as an example, during the authentication saga the key may have been regenerated multiple times)
  const unsupportedDevice = yield* call(checkPublicKeyAndBlockIfNeeded);
  if (unsupportedDevice) {
    return;
  }

  // Since the backend.json is done in parallel with the startup saga,
  // we need to synchronize the two tasks, to be sure to have loaded the remote FF
  // before using them.
  const backendStatus = yield* select(backendStatusSelector);
  if (O.isNone(backendStatus)) {
    yield* take(backendStatusLoadSuccess);
  }

  // Whether the user is currently logged in.
  const previousSessionToken: ReturnType<typeof sessionTokenSelector> =
    yield* select(sessionTokenSelector);

  // Unless we have a valid session token already, login until we have one.
  const sessionToken: SagaCallReturnType<typeof authenticationSaga> =
    previousSessionToken
      ? previousSessionToken
      : yield* call(authenticationSaga);

  // BE CAREFUL where you get lollipop keyInfo.
  // They MUST be placed after authenticationSaga, because they are regenerated with each login attempt.
  // Get keyInfo for lollipop

  const keyInfo = yield* call(getKeyInfo);

  // Handles the expiration of the session token
  yield* fork(watchSessionExpiredSaga);
  yield* fork(watchForActionsDifferentFromRequestLogoutThatMustResetMixpanel);

  // Instantiate a backend client from the session token
  const backendClient: ReturnType<typeof BackendClient> = BackendClient(
    apiUrlPrefix,
    sessionToken,
    keyInfo
  );

  // Watch for requests to logout
  // Since this saga is spawned and not forked
  // it will handle its own cancelation logic.
  yield* spawn(watchLogoutSaga, backendClient.logout);

  // check if the current session is still valid
  const checkSessionResponse: SagaCallReturnType<typeof checkSession> =
    yield* call(checkSession, backendClient.getSession);
  if (checkSessionResponse === 401) {
    // This is the first API call we make to the backend, it may happen that
    // when we're using the previous session token, that session has expired
    // so we need to reset the session token and restart from scratch.
    const isFastLoginEnabled = yield* select(isFastLoginEnabledSelector);
    if (!isFastLoginEnabled) {
      yield* put(sessionExpired());
    } else {
      yield* put(
        refreshSessionToken.request({
          withUserInteraction: false,
          showIdentificationModalAtStartup: true,
          showLoader: false
        })
      );
    }
    return;
  }

  // Now we fork the tasks that will handle the async requests coming from the
  // UI of the application.
  // Note that the following sagas will be automatically cancelled each time
  // this parent saga gets restarted.

  yield* fork(
    watchUserDataProcessingSaga,
    backendClient.getUserDataProcessingRequest,
    backendClient.postUserDataProcessingRequest,
    backendClient.deleteUserDataProcessingRequest
  );

  // Start watching for Services actions
  yield* fork(watchServicesSaga, backendClient, sessionToken);

  // Start watching for Messages actions
  yield* fork(watchMessagesSaga, backendClient, sessionToken);

  // start watching for FIMS actions
  yield* fork(watchFimsSaga);

  // watch FCI saga
  yield* fork(watchFciSaga, sessionToken, keyInfo);

  // whether we asked the user to login again
  const isSessionRefreshed = previousSessionToken !== sessionToken;

  // Let's see if have to load the session info, either because
  // we don't have one for the current session or because we
  // just refreshed the session.
  // FIXME: since it looks like we load the session info every
  //        time we get a session token, think about merging the
  //        two steps.
  // eslint-disable-next-line functional/no-let
  let maybeSessionInformation: ReturnType<typeof sessionInfoSelector> =
    yield* select(sessionInfoSelector);
  // In the check below we had also isSessionRefreshed, but it is not needed
  // since the actual checkSession made above is enough to ensure that the
  // session tokens are retrieved correctly.
  // Only in the scenario when we get here and session tokens are not available,
  // we have to load the session information from the backend.
  // In a future refactoring where the checkSession won't get the session tokens
  // anymore, we will need to rethink about this check.
  if (
    O.isNone(maybeSessionInformation) ||
    (O.isSome(maybeSessionInformation) &&
      (maybeSessionInformation.value.bpdToken === undefined ||
        maybeSessionInformation.value.walletToken === undefined))
  ) {
    // let's try to load the session information from the backend.

    maybeSessionInformation = yield* call(
      loadSessionInformationSaga,
      backendClient.getSession
    );

    if (
      O.isNone(maybeSessionInformation) ||
      (O.isSome(maybeSessionInformation) &&
        (maybeSessionInformation.value.bpdToken === undefined ||
          maybeSessionInformation.value.walletToken === undefined))
    ) {
      yield* call(handleApplicationStartupTransientError, "GET_SESSION_DOWN");
      return;
    }
  }

  const publicKey = yield* select(lollipopPublicKeySelector);

  const isAssertionRefValid = yield* call(
    checkLollipopSessionAssertionAndInvalidateIfNeeded,
    publicKey,
    maybeSessionInformation
  );
  if (!isAssertionRefValid) {
    return;
  }

  // Start watching for profile update requests as the checkProfileEnabledSaga
  // may need to update the profile.
  yield* fork(
    watchProfileUpsertRequestsSaga,
    backendClient.createOrUpdateProfile
  );

  // Start watching when profile is successfully loaded
  yield* fork(watchProfile, backendClient.startEmailValidationProcess);

  // If we are here the user is logged in and the session info is
  // loaded and valid

  // Load the profile info
  const maybeUserProfile: SagaCallReturnType<typeof loadProfile> = yield* call(
    loadProfile,
    backendClient.getProfile
  );

  if (O.isNone(maybeUserProfile)) {
    yield* call(handleApplicationStartupTransientError, "GET_PROFILE_DOWN");
    return;
  }
  yield* put(startupTransientError(startupTransientErrorInitialState));

  // eslint-disable-next-line functional/no-let
  let userProfile = maybeUserProfile.value;

  // If user logged in with different credentials, but this device still has
  // user data loaded, then delete data keeping current session (user already
  // logged in)
  if (
    pot.isSome(lastLoggedInProfileState) &&
    lastLoggedInProfileState.value.fiscal_code !== userProfile.fiscal_code
  ) {
    // Delete all data while keeping current session:
    // Delete the current unlock code from the Keychain
    yield* call(deletePin);
    // Delete all onboarding data
    yield* put(clearOnboarding());
    yield* put(clearCache());
  }

  // Retrieve the configured unlock code from the keychain
  const maybeStoredPin: SagaCallReturnType<typeof getPin> = yield* call(getPin);

  // Start watching for requests of refresh the profile
  yield* fork(watchProfileRefreshRequestsSaga, backendClient.getProfile);

  // Start watching for requests of alternative profile
  yield* fork(watchProfileRequest, backendClient.getProfileAlternative);

  // Start watching for requests about session and support token
  yield* fork(
    watchCheckSessionSaga,
    backendClient.getSession,
    backendClient.getSupportToken
  );

  // Start watching for requests of abort the onboarding
  const watchAbortOnboardingSagaTask = yield* fork(watchAbortOnboardingSaga);

  yield* put(startupLoadSuccess(StartupStatusEnum.ONBOARDING));
  if (!handleSessionExpiration) {
    yield* call(waitForMainNavigator);
  }

  // yield* delay(0 as Millisecond);
  const hasPreviousSessionAndPin =
    previousSessionToken && O.isSome(maybeStoredPin);
  if (hasPreviousSessionAndPin && showIdentificationModal) {
    // we ask the user to identify using the unlock code.
    // FIXME: This is an unsafe cast caused by a wrongly described type.
    const identificationResult: SagaCallReturnType<
      typeof startAndReturnIdentificationResult
    > = yield* call(startAndReturnIdentificationResult, maybeStoredPin.value);

    if (identificationResult === IdentificationResult.pinreset) {
      // If we are here the user had chosen to reset the unlock code
      yield* put(startApplicationInitialization());
      return;
    }

    if (!handleSessionExpiration) {
      yield* call(setLanguageFromProfileIfExists);
    }

    const isFastLoginEnabled = yield* select(isFastLoginEnabledSelector);
    if (isFastLoginEnabled) {
      // At application startup, the state of the refresh token is "idle".
      // If we got a 401 in the above getSession we start a token refresh.
      // If we succeed, we can continue with the application startup and
      // we could skip this step.
      const lastTokenRefreshState = yield* select(tokenRefreshSelector);
      if (lastTokenRefreshState.kind !== "success") {
        yield* put(
          refreshSessionToken.request({
            withUserInteraction: false,
            showIdentificationModalAtStartup: false,
            showLoader: true
          })
        );
        return;
      }
    }
  }

  // Ask to accept ToS if there is a new available version
  yield* call(checkAcceptedTosSaga, userProfile);

  if (!handleSessionExpiration) {
    yield* call(setLanguageFromProfileIfExists);
  }
  // check if the user expressed preference about mixpanel, if not ask for it
  yield* call(askMixpanelOptIn);

  // workaround to send keychainError for Pixel devices
  // TODO: REMOVE AFTER FIXING https://pagopa.atlassian.net/jira/software/c/projects/IABT/boards/92?modal=detail&selectedIssue=IABT-1441
  yield* call(trackKeychainGetFailure, keychainError);
  yield* call(clearKeychainError);

  // track if the Android device has StrongBox
  yield* call(handleIsKeyStrongboxBacked, keyInfo.keyTag);

  yield* call(checkConfiguredPinSaga);
  yield* call(checkAcknowledgedFingerprintSaga);

  yield* fork(watchEmailValidationSaga);

  if (!hasPreviousSessionAndPin || userProfile.email === undefined) {
    yield* call(checkAcknowledgedEmailSaga, userProfile);
  }

  userProfile = (yield* call(checkEmailSaga)) ?? userProfile;

  // check if the user must set preferences for push notifications (e.g. reminders)
  yield* call(checkNotificationsPreferencesSaga, userProfile);

  const isFirstOnboarding = isProfileFirstOnBoarding(userProfile);
  yield* call(askServicesPreferencesModeOptin, isFirstOnboarding);

  if (isFirstOnboarding) {
    // Show the thank-you screen for the onboarding
    yield* call(completeOnboardingSaga);
  }

  // Stop the watchAbortOnboardingSaga
  yield* cancel(watchAbortOnboardingSagaTask);

  // Start the notification installation update as early as
  // possible to begin receiving push notifications
  yield* call(updateInstallationSaga, backendClient.createOrUpdateInstallation);

  // This saga is called before the startup status is set to authenticated to avoid flashing
  // the home screen when the user is taken to the alert screen in case of identities that don't match.
  yield* call(checkItWalletIdentitySaga);

  yield* put(startupLoadSuccess(StartupStatusEnum.AUTHENTICATED));
  //
  // User is autenticated, session token is valid
  //

  // Start wathing new wallet sagas
  yield* fork(watchNewWalletSaga);

  if (zendeskEnabled) {
    yield* fork(watchZendeskGetSessionSaga, backendClient.getSession);
  }

  // Here we can be sure that the session information is loaded and valid
  const bpdToken = maybeSessionInformation.value.bpdToken as string;
  if (cdcEnabled) {
    // Start watching for cdc actions
    yield* fork(watchBonusCdcSaga, bpdToken);
  }

  // Start watching for cgn actions
  yield* fork(watchBonusCgnSaga, sessionToken);

  if (euCovidCertificateEnabled) {
    // Start watching for EU Covid Certificate actions
    yield* fork(watchEUCovidCertificateSaga, sessionToken);
  }

  const pnEnabled: ReturnType<typeof isPnEnabledSelector> = yield* select(
    isPnEnabledSelector
  );

  if (pnEnabled) {
    // Start watching for PN actions
    yield* fork(watchPnSaga, sessionToken);
  }

  const idPayTestEnabled: ReturnType<typeof isIdPayTestEnabledSelector> =
    yield* select(isIdPayTestEnabledSelector);

  if (idPayTestEnabled) {
    // Start watching for IDPay actions
    yield* fork(watchIDPaySaga, bpdToken);
  }

  // Start watching for trial system saga
  yield* fork(watchTrialSystemSaga, sessionToken);

  // Start watching for itw saga
  yield* fork(watchItwSaga);

  // Here we can be sure that the session information is loaded and valid
  const walletToken = maybeSessionInformation.value.walletToken as string;
  // Start watching for Wallet V3 actions
  yield* fork(watchPaymentsSaga, walletToken);

  const isPagoPATestEnabled: ReturnType<typeof isPagoPATestEnabledSelector> =
    yield* select(isPagoPATestEnabledSelector);

  yield* fork(
    watchWalletSaga,
    sessionToken,
    walletToken,
    isPagoPATestEnabled ? pagoPaApiUrlPrefixTest : pagoPaApiUrlPrefix
  );

  // Check that profile is up to date (e.g. inbox enabled)
  yield* call(checkProfileEnabledSaga, userProfile);

  if (isSessionRefreshed) {
    // Only if the user are logging in check the account removal status and,
    // if is PENDING show an alert to notify him.
    const checkUserDeletePendingTask: any = yield* takeLatest(
      loadUserDataProcessing.success,
      function* (
        loadUserDataProcessingSuccess: ActionType<
          typeof loadUserDataProcessing.success
        >
      ) {
        const maybeDeletePending = pipe(
          loadUserDataProcessingSuccess.payload.value,
          O.fromNullable,
          O.filter(
            uc =>
              uc.choice === UserDataProcessingChoiceEnum.DELETE &&
              uc.status === UserDataProcessingStatusEnum.PENDING
          )
        );
        type leftOrRight = "left" | "right";
        const alertChoiceChannel = channel<leftOrRight>();
        const isSettingsVisibleAndHideProfile = yield* select(
          isSettingsVisibleAndHideProfileSelector
        );
        if (O.isSome(maybeDeletePending)) {
          Alert.alert(
            I18n.t("startup.userDeletePendingAlert.title"),
            isSettingsVisibleAndHideProfile
              ? I18n.t("startup.userDeletePendingAlert.message")
              : I18n.t("startup.userDeletePendingAlert.messageLegacy"),
            [
              {
                text: isSettingsVisibleAndHideProfile
                  ? I18n.t("startup.userDeletePendingAlert.cta_1")
                  : I18n.t("startup.userDeletePendingAlert.cta_1_legacy"),
                style: "cancel",
                onPress: () => {
                  alertChoiceChannel.put("left");
                }
              },
              {
                text: I18n.t("startup.userDeletePendingAlert.cta_2"),
                style: "default",
                onPress: () => {
                  alertChoiceChannel.put("right");
                }
              }
            ],
            { cancelable: false }
          );
          const action: leftOrRight = yield* take(alertChoiceChannel);
          if (action === "left") {
            yield* call(navigateToPrivacyScreen);
          }
          yield* cancel(checkUserDeletePendingTask);
        }
      }
    );

    yield* put(
      loadUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    );
  }

  // Watch for checking the user email notifications preferences
  yield* fork(watchEmailNotificationPreferencesSaga);

  // Check if we have a pending notification message
  yield* call(handlePendingMessageStateIfAllowedSaga, true);

  // This tells the security advice bottomsheet that it can be shown
  yield* put(setSecurityAdviceReadyToShow(true));

  yield* put(
    applicationInitialized({
      actionsToWaitFor: [walletPaymentHandlersInitialized]
    })
  );
}

/**
 * Wait until the {@link NavigationService} is initialized.
 * The NavigationService is initialized when is called {@link RootContainer} componentDidMount and the ref is set with setTopLevelNavigator
 */
function* waitForNavigatorServiceInitialization() {
  // eslint-disable-next-line functional/no-let
  let isNavigatorReady: ReturnType<
    typeof NavigationService.getIsNavigationReady
  > = yield* call(NavigationService.getIsNavigationReady);

  // eslint-disable-next-line functional/no-let
  let timeoutLogged = false;

  const startTime = performance.now();

  // before continuing we must wait for the navigatorService to be ready
  while (!isNavigatorReady) {
    const elapsedTime = performance.now() - startTime;
    if (!timeoutLogged && elapsedTime >= warningWaitNavigatorTime) {
      timeoutLogged = true;

      yield* call(mixpanelTrack, "NAVIGATION_SERVICE_INITIALIZATION_TIMEOUT");
    }
    yield* delay(navigatorPollingTime);
    isNavigatorReady = yield* call(NavigationService.getIsNavigationReady);
  }

  const initTime = performance.now() - startTime;

  yield* call(mixpanelTrack, "NAVIGATION_SERVICE_INITIALIZATION_COMPLETED", {
    elapsedTime: initTime
  });
}

function* waitForMainNavigator() {
  // eslint-disable-next-line functional/no-let
  let isMainNavReady = yield* call(NavigationService.getIsMainNavigatorReady);

  // eslint-disable-next-line functional/no-let
  let timeoutLogged = false;
  const startTime = performance.now();

  // before continuing we must wait for the main navigator tack to be ready
  while (!isMainNavReady) {
    const elapsedTime = performance.now() - startTime;
    if (!timeoutLogged && elapsedTime >= warningWaitNavigatorTime) {
      timeoutLogged = true;

      yield* call(mixpanelTrack, "MAIN_NAVIGATOR_STACK_READY_TIMEOUT");
    }
    yield* delay(navigatorPollingTime);
    isMainNavReady = yield* call(NavigationService.getIsMainNavigatorReady);
  }

  const initTime = performance.now() - startTime;

  yield* call(mixpanelTrack, "MAIN_NAVIGATOR_STACK_READY_OK", {
    elapsedTime: initTime
  });
}

export function* startupSaga(): IterableIterator<ReduxSagaEffect> {
  // Wait until the IngressScreen gets mounted
  yield* takeLatest(
    getType(startApplicationInitialization),
    initializeApplicationSaga
  );
}

export const testWaitForNavigatorServiceInitialization = isTestEnv
  ? waitForNavigatorServiceInitialization
  : undefined;
