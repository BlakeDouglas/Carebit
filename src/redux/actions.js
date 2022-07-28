export const Login = (username, password) => {
  return async (dispatch) => {
    let token = true;
    // call api here?

    // Call dispatch(username, password) in account creation/login screen
    // Then, code right here <- gets called
    // Send username/password to API right here
    // Use results to set token
    console.log(username + " " + password);
    dispatch({
      type: "LOGIN",
      payload: token,
    });
  };
};

export const setCareType = (type) => {
  return async (dispatch) => {
    let careType = type;
    dispatch({
      type: "SET_CARE_TYPE",
      payload: careType,
    });
  };
};
