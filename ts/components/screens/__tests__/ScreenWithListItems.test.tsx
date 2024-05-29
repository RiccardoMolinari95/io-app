import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { createStore } from "redux";
import ScreenWithListItems, {
  PropsScreenWithListItems
} from "../ScreenWithListItems";
import { appReducer } from "../../../store/reducers";
import { applicationChangeState } from "../../../store/actions/application";
import { renderScreenWithNavigationStoreContext } from "../../../utils/testWrapper";

describe("ScreenWithListItems", () => {
  const mockAction = jest.fn();

  const defaultProps: PropsScreenWithListItems = {
    title: "Test Title",
    subtitle: "Test Subtitle",
    renderItems: [
      { label: "Item 1", value: "Value 1", testID: "item-1" },
      { label: "Item 2", value: "Value 2", testID: "item-2" }
    ],
    listItemHeaderLabel: "List Header",
    primaryActionProps: {
      label: "Press me",
      accessibilityLabel: "Press me button",
      onPress: mockAction,
      testID: "action-button",
      fullWidth: true
    },
    isHeaderVisible: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { toJSON, getByText, getByTestId } = renderComponent(defaultProps);

      expect(getByText("Test Title")).toBeTruthy();
      expect(getByText("Test Subtitle")).toBeTruthy();
      expect(getByText("List Header")).toBeTruthy();
      expect(getByText("Item 1")).toBeTruthy();
      expect(getByText("Value 1")).toBeTruthy();
      expect(getByText("Item 2")).toBeTruthy();
      expect(getByText("Value 2")).toBeTruthy();
      expect(getByText("Press me")).toBeTruthy();
      expect(getByTestId("action-button")).toBeTruthy();

      // Snapshot test
      expect(toJSON()).toMatchSnapshot();
    });

    it("renders subtitle as array correctly", () => {
      const propsWithArraySubtitle: PropsScreenWithListItems = {
        ...defaultProps,
        subtitle: [
          {
            text: "Subtitle Part 1",
            style: {
              textAlign: "center"
            }
          },
          {
            text: "Subtitle Part 2 Bold",
            style: {
              textAlign: "center"
            },
            weight: "SemiBold"
          }
        ]
      };
      const { getByText, toJSON } = renderComponent(propsWithArraySubtitle);

      expect(getByText("Subtitle Part 1")).toBeTruthy();
      expect(getByText("Subtitle Part 2 Bold")).toBeTruthy();

      // Snapshot test
      expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly without optional props", () => {
      const propsWithoutOptional: PropsScreenWithListItems = {
        renderItems: [],
        primaryActionProps: {
          label: "Press me",
          accessibilityLabel: "Press me button",
          onPress: mockAction,
          testID: "action-button",
          fullWidth: true
        }
      };
      const { queryByText, toJSON } = renderComponent(propsWithoutOptional);

      expect(queryByText("Test Title")).toBeNull();
      expect(queryByText("Test Subtitle")).toBeNull();
      expect(queryByText("List Header")).toBeNull();

      // Snapshot test
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("Actions", () => {
    it("calls the action on button press", () => {
      const { getByTestId } = renderComponent(defaultProps);

      fireEvent.press(getByTestId("action-button"));
      expect(mockAction).toHaveBeenCalled();
    });
  });
});

const renderComponent = (props: PropsScreenWithListItems) => {
  const initialState = appReducer(undefined, applicationChangeState("active"));
  const store = createStore(appReducer, initialState as any);
  return renderScreenWithNavigationStoreContext(
    () => <ScreenWithListItems {...props} />,
    "DUMMY",
    {},
    store
  );
};
