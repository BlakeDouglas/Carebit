export const setUserData = (userData) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_USER_DATA",
      payload: userData,
    });
  };
};

export const setTokenData = (tokenData) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_TOKEN_DATA",
      payload: tokenData,
    });
  };
};