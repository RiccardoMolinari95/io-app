import * as matchers from "redux-saga-test-plan/matchers";
import * as E from "fp-ts/lib/Either";
import { expectSaga } from "redux-saga-test-plan";
import NewProfileData from "../../types";
import { loadNewProfile } from "..";
import {
  newProfileLoadFailure,
  newProfileLoadRequest,
  newProfileLoadSuccess
} from "../../store/actions/newProfile";
import { BackendClient } from "../../../../api/__mocks__/backend";

const mockProfileData: NewProfileData = {
  name: "Carla",
  familyName: "Danti",
  fiscalCode: "DNTCRL65S67M126L",
  email: "carladanti@gmail.com",
  dateOfBirth: new Date("1965-10-27")
};

describe("loadNewProfile Saga", () => {
  const mockGetNewProfile = BackendClient.getNewProfile;

  it("should successfully handle loading the new profile", () => {
    const mockResponse = E.right({
      status: 200,
      value: {
        name: "Carla",
        family_name: "Danti",
        fiscal_code: "DNTCRL65S67M126L",
        email: "carladanti@gmail.com",
        date_of_birth: "1965-10-27"
      }
    });

    return expectSaga(loadNewProfile, mockGetNewProfile)
      .provide([[matchers.call.fn(mockGetNewProfile), mockResponse]])
      .dispatch(newProfileLoadRequest())
      .put(newProfileLoadSuccess(mockProfileData))
      .run();
  });

  it("should handle an error when loading the new profile", () => {
    const mockError = new Error("Something went wrong");
    const mockErrorResponse = E.left(mockError);

    return expectSaga(loadNewProfile, mockGetNewProfile)
      .provide([[matchers.call.fn(mockGetNewProfile), mockErrorResponse]])
      .dispatch(newProfileLoadRequest())
      .put(newProfileLoadFailure(mockError))
      .run();
  });
});
