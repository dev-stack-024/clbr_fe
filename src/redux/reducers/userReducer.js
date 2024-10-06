// src/redux/reducers/userReducer.js
const initialState = {
    user: null,
    loading: false,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'USER_LOGIN_SUCCESS':
        return {
          ...state,
          user: action.payload,
        };
      case 'USER_LOGOUT':
        return {
          ...state,
          user: null,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  