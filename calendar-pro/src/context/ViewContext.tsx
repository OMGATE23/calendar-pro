"use client";
import React, { ReactNode, createContext, useContext, useReducer } from "react";

export type ViewContext = {
  state: {
    view: "Year" | "Month" | "Week";
  };
  dispatch: React.Dispatch<Action>;
};

export type ViewState = {
  view: "Year" | "Month" | "Week";
};

export type Action = {
  type: "CHANGE_VIEW";
  payload: {
    view: "Year" | "Month" | "Week";
  };
};
const ViewContext = createContext<ViewContext>({
  state: {
    view: "Week",
  },
  dispatch: () => {},
});

export function useViewContext() {
  return useContext(ViewContext);
}

const ViewContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    view: "Week",
  });

  function reducer(state: ViewState, action: Action): ViewState {
    switch (action.type) {
      case "CHANGE_VIEW": {
        if (!["Week", "Month", "Year"].includes(action.payload.view)) {
          return state;
        }
        return { view: action.payload.view };
      }
      default:
        return state;
    }
  }
  return (
    <ViewContext.Provider value={{ state, dispatch }}>
      {children}
    </ViewContext.Provider>
  );
};

export default ViewContextProvider;
