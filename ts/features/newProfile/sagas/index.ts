import * as E from "fp-ts/lib/Either";
import { call, put, takeLatest } from "typed-redux-saga/macro";
import { getType } from "typesafe-actions";
import { ReduxSagaEffect } from "../../../types/utils";
import { convertUnknownToError } from "../../../utils/errors";
import { BackendClient } from "../../../api/backend";
import {
  newProfileLoadFailure,
  newProfileLoadRequest,
  newProfileLoadSuccess
} from "../store/actions/newProfile";
import NewProfileData from "../types";

export function* loadNewProfile(getNewProfile: BackendClient["getNewProfile"]) {
  try {
    const response = yield* call(getNewProfile, {});

    if (E.isLeft(response)) {
      throw new Error("Something went wrong");
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
    }
  } catch (error) {
    yield* put(newProfileLoadFailure(convertUnknownToError(error)));
  }
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
