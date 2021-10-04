import React, { useReducer, createContext } from "react";
const initialState = {
  groupData: { groupId: null, groupOwnerId: null },
};

if (localStorage.getItem("groupClickedData")) {
  const retrivedData = localStorage.getItem("groupClickedData");
  //convert the string to an object
  const groupData = JSON.parse(retrivedData);
  initialState.groupData = groupData;
}

const GroupSelectorContext = createContext({
  groupData: { groupId: null, groupOwnerId: null },
  createGroupSelection: (groupId, groupOwnerId) => {},
});

function groupSelectorReducer(state, action) {
  switch (action.type) {
    case "SELECT_GROUP":
      return {
        ...state,
        groupData: {
          groupId: action.payload.groupId,
          groupOwnerId: action.payload.groupOwnerId,
        },
      };

    default:
      return state;
  }
}

function GroupSelectorProvider(props) {
  const [state, dispatch] = useReducer(groupSelectorReducer, initialState);

  function createGroupSelection(groupId, groupOwnerId) {
    //create an object with the groupId and groupOwnerId
    const groupData = { groupId, groupOwnerId };
    //save the groupData to the local storage
    localStorage.setItem("groupClickedData", JSON.stringify(groupData));
    dispatch({
      type: "SELECT_GROUP",
      payload: { groupId, groupOwnerId },
    });
  }

  return (
    <GroupSelectorContext.Provider
      value={{ groupData: state.groupData, createGroupSelection }}
      {...props}
    />
  );
}

export { GroupSelectorContext, GroupSelectorProvider };
