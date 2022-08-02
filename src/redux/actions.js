export const Login = (username, password) => {
  return async (dispatch) => {
    let authToken = false;
    fetch("https://www.carebit.xyz/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        authToken = true;
        return json;
      })
      .catch((error) => {
        console.log(error);
        authToken = false;
      });
    // Only if valid
    dispatch({
      type: "LOGIN",
      payload: authToken,
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
