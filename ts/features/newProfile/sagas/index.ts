import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { call, put, takeLatest } from "typed-redux-saga/macro";
import { getType } from "typesafe-actions";
import { ReduxSagaEffect, SagaCallReturnType } from "../../../types/utils";
import { withRefreshApiCall } from "../../fastLogin/saga/utils";
import { readablePrivacyReport } from "../../../utils/reporters";
import { convertUnknownToError } from "../../../utils/errors";
import { BackendClient } from "../../../api/backend";
import {
  newProfileLoadFailure,
  newProfileLoadRequest,
  newProfileLoadSuccess
} from "../store/actions/newProfile";
import NewProfileData from "../types";

export function* loadNewProfile(
  getNewProfile: ReturnType<typeof BackendClient>["getNewProfile"]
): Generator<
  ReduxSagaEffect,
  O.Option<NewProfileData>,
  SagaCallReturnType<typeof getNewProfile>
> {
  try {
    const response = (yield* call(
      withRefreshApiCall,
      getNewProfile({})
    )) as unknown as SagaCallReturnType<typeof getNewProfile>;

    if (E.isLeft(response)) {
      throw Error(readablePrivacyReport(response.left));
    }
    if (response.right.status === 200) {
      const responseData = response.right.value;
      const newProfileData: NewProfileData = {
        name: responseData.name,
        familyName: responseData.family_name,
        fiscalCode: responseData.fiscal_code,
        email: responseData.email || "Email not found",
        dateOfBirth: responseData.date_of_birth
          ? new Date(responseData.date_of_birth)
          : undefined
      };
      yield* put(newProfileLoadSuccess(newProfileData));
      return O.some(newProfileData);
    }

    throw Error(`response status ${response.right.status}`);
  } catch (e) {
    yield* put(newProfileLoadFailure(convertUnknownToError(e)));
  }
  return O.none;
}

export function* watchNewProfileRequest(
  getNewProfile: ReturnType<typeof BackendClient>["getNewProfile"]
): Iterator<ReduxSagaEffect> {
  yield* takeLatest(
    getType(newProfileLoadRequest),
    loadNewProfile,
    getNewProfile
  );
}
