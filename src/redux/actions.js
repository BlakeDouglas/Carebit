export const setTokenData = (tokenData) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_TOKEN_DATA",
      payload: tokenData,
    });
  };
};

export const setSelectedUser = (selectedUser) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_SELECTED_USER",
      payload: selectedUser,
    });
  };
};

export const resetData = () => {
  return async (dispatch) => {
    dispatch({
      type: "RESET_DATA",
    });
  };
};

export const resetSelectedData = () => {
  return async (dispatch) => {
    dispatch({
      type: "RESET_SELECTED_DATA",
    });
  };
};
