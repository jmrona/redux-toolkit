import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetching: false,
  hasError: false,
  errorMessage: null,
  name: null,
  username: null,
  email: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsFetching: (state, action) => {
      return {
        ...state,
        isFetching: action.payload,
        hasError: false,
        errorMessage: null,
      };
    },
    setHasError: (state, action) => {
      const { error, message } = action.payload;

      return {
        ...state,
        hasError: error,
        errorMessage: message,
      };
    },
    addUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { addUser, changeEmail, setIsFetching, setHasError } = userSlice.actions;
export default userSlice.reducer;
