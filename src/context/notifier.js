import React, { useReducer, createContext } from "react";

const initialState = {
  notifArray: [],
};

const NotifierContext = createContext({
  notifArray: [],
  createNotification: (userData) => {},
  removeNotification: (id) => {},
});

function notifierReducer(state, action) {
  switch (action.type) {
    case "CREATE_NOTIFICATION":
      return {
        ...state,
        notifArray: [...state.notifArray, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifArray: [...action.payload],
      };
    default:
      return state;
  }
}

function NotifierProvider(props) {
  const [state, dispatch] = useReducer(notifierReducer, initialState);

  function createNotification(userData) {
    dispatch({
      type: "CREATE_NOTIFICATION",
      payload: userData,
    });
  }
  function removeNotification(id) {
    const notifArray = state.notifArray.filter((notif) => {
      return notif !== id;
    });
    dispatch({
      type: "REMOVE_NOTIFICATION",
      payload: notifArray,
    });
  }

  return (
    <NotifierContext.Provider
      value={{
        notifArray: state.notifArray,
        createNotification,
        removeNotification,
      }}
      {...props}
    />
  );
}

export { NotifierContext, NotifierProvider };
