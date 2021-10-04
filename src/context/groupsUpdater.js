import React, { useReducer, createContext } from "react";

const initialState = {
  noOfGroups: 0,
};
const GroupUpdaterContext = createContext({
  noOfGroups: 0,
  updateNumberOfGroups: (operation) => {},
});

function GroupUpdaterReducer(state, action) {
  switch (action.type) {
    case "CREATE_OPERATION":
      return {
        ...state,
        noOfGroups: action.payload,
      };
    default:
      return state;
  }
}

function GroupUpdaterProvider(props) {
  const [state, dispatch] = useReducer(GroupUpdaterReducer, initialState);

  function updateNumberOfGroups(operation) {
    let noOfGroups =
      operation === "ADD" ? state.noOfGroups + 1 : state.noOfGroups - 1;
    dispatch({
      type: "CREATE_OPERATION",
      payload: noOfGroups,
    });
  }

  return (
    <GroupUpdaterContext.Provider
      value={{
        noOfGroups: state.noOfGroups,
        updateNumberOfGroups,
      }}
      {...props}
    />
  );
}

export { GroupUpdaterContext, GroupUpdaterProvider };
