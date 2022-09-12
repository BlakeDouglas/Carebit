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
  userData: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobilePlatform: "",
  },
  physData: {
    physName: "",
    physPhone: "",
    physStreet: "",
    physCity: "",
    physState: "",
    physZip: "",
  },
};

// Handles the actions in actions.js
export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return { ...state, userData: action.payload };
    case "SET_TOKEN_DATA":
      return { ...state, tokenData: action.payload };
    case "SET_PHYSICIAN_DATA":
      return { ...state, physData: action.payload };
    default:
      return state;
  }
};
