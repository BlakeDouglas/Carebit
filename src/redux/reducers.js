// This is the default state, in which should be included default settings
// As an example, auth is false because the user is not logged in by default.
const initialState = {
  authToken: false,
  careType: null,
  // Settings go here
};

// Handles the actions in actions.js
export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, authToken: action.payload };
    case "SET_CARE_TYPE":
      return { ...state, careType: action.payload };
    default:
      return state;
  }
};
