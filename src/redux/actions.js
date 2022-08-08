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
        if (json.access_token !== undefined) {
          dispatch({
            type: "LOGIN",
            payload: authToken,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        authToken = false;
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

export const Register = (userInfo) => {
  return async (dispatch) => {
    let authToken = false;
    console.log(userInfo);
    fetch("https://www.carebit.xyz/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        authToken = true;
        if (json.access_token !== undefined) {
          dispatch({
            type: "LOGIN",
            payload: authToken,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        authToken = false;
      });
  };
};
