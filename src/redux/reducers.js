// This is the default state, in which should be included default settings
const initialState = {
  tokenData: {
    access_token: "",
    caregiveeID: null,
    caregiverID: null,
    phone: "",
    type: "",
    userID: null,
  },

  // TODO: Need to remove requestID, sender, status from the /login response. Not sure about /getRequest
  selectedUser: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    // type: "",

    caregiverID: "",

    caregiveeID: "",
    physName: "",
    physPhone: "",
    healthProfile: null,
  },
};

// Handles the actions in actions.js
export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN_DATA":
      return { ...state, tokenData: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    case "RESET_DATA":
      return initialState;
    case "RESET_SELECTED_DATA":
      return { ...state, selectedUser: initialState.selectedUser };
    default:
      return state;
  }
};
