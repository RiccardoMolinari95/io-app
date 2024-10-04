import { createStore } from "redux";
import * as pot from "@pagopa/ts-commons/lib/pot";
import { applicationChangeState } from "../../../../store/actions/application";
import { appReducer } from "../../../../store/reducers";
import {
  newProfileLoadFailure,
  newProfileLoadRequest,
  newProfileLoadSuccess
} from "../actions/newProfile";
import NewProfileData from "../../types";

const mockProfileData: NewProfileData = {
  name: "Carla",
  familyName: "Danti",
  fiscalCode: "DNTCRL65S67M126L",
  email: "carladanti@gmail.com",
  dateOfBirth: new Date("1965-10-27")
};

const mockError = new Error("Error fetching profile");

describe("newProfile reducer", () => {
  it("It should start with an empty initial state ", () => {
    const globalState = appReducer(undefined, applicationChangeState("active"));
    expect(globalState.newProfile).toStrictEqual(pot.none);
  });

  it("It should set state to loading when requesting profile data", () => {
    const globalState = appReducer(undefined, applicationChangeState("active"));
    const store = createStore(appReducer, globalState as any);
    store.dispatch(newProfileLoadRequest());
    expect(store.getState().newProfile).toStrictEqual(pot.noneLoading);
  });

  it("It should load profile data successfully", () => {
    const globalState = appReducer(undefined, applicationChangeState("active"));
    const store = createStore(appReducer, globalState as any);
    store.dispatch(newProfileLoadSuccess(mockProfileData));
    expect(store.getState().newProfile).toStrictEqual(
      pot.some(mockProfileData)
    );
  });

  it("It should set error state when profile load fails ", () => {
    const globalState = appReducer(undefined, applicationChangeState("active"));
    const store = createStore(appReducer, globalState as any);
    store.dispatch(newProfileLoadFailure(mockError));
    expect(store.getState().newProfile).toStrictEqual(pot.noneError(mockError));
  });
});
