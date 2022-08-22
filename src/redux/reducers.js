// This is the default state, in which should be included default settings
const initialState = {
  tokenData: {
    access_token: "",
    caregiveeId: "",
    caregiverId: null,
    refresh_token: "",
    type: "",
    userId: null,
  },
  userData: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobilePlatform: "",
  },
  physicianData: {
    physicianName: "",
    physicianPhone: "",
    physicianStreet: "",
    physicianCity: "",
    physicianState: "",
    physicianZipCode: "",
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
      return { ...state, physicianData: action.payload };
    default:
      return state;
  }
};
