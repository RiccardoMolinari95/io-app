/**
 * A reducer for the new Profile.
 */
import * as pot from "@pagopa/ts-commons/lib/pot";
import { getType } from "typesafe-actions";

import { ProfileError } from "../../../../store/reducers/profileErrorType";
import { GlobalState } from "../../../../store/reducers/types";
import { Action } from "../../../../store/actions/types";
import NewProfileData from "../../types";
import {
  newProfileLoadFailure,
  newProfileLoadRequest,
  newProfileLoadSuccess
} from "../actions/newProfile";

export type NewProfileState = pot.Pot<NewProfileData, ProfileError>;

const INITIAL_STATE: NewProfileState = pot.none;

export const newProfileSelector = (state: GlobalState): NewProfileState =>
  state.newProfile;

const newProfileReducer = (
  state: NewProfileState = INITIAL_STATE,
  action: Action
): NewProfileState => {
  switch (action.type) {
    case getType(newProfileLoadRequest):
      return pot.toLoading(state);

    case getType(newProfileLoadSuccess):
      return pot.some(action.payload);

    case getType(newProfileLoadFailure):
      return pot.toError(state, action.payload);

    default:
      return state;
  }
};

export default newProfileReducer;
