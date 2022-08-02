export const Login = (username, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch("https://www.carebit.xyz/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }

    // Only if valid
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
