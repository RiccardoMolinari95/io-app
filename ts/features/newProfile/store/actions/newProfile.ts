/**
 * Action types and action creator related to the Profile.
 */
import {
  ActionType,
  createAction,
  createStandardAction
} from "typesafe-actions";
import NewProfileData from "../../types";

export const newProfileLoadRequest = createStandardAction(
  "NEW_PROFILE_LOAD_REQUEST"
)();
export const newProfileLoadSuccess = createStandardAction(
  "NEW_PROFILE_LOAD_SUCCESS"
)<NewProfileData>();

export const newProfileLoadFailure = createAction(
  "NEW_PROFILE_LOAD_FAILURE",
  resolve => (error: Error) => resolve(error, { error: true })
);

export type NewProfileActions =
  | ActionType<typeof newProfileLoadRequest>
  | ActionType<typeof newProfileLoadSuccess>
  | ActionType<typeof newProfileLoadFailure>;
