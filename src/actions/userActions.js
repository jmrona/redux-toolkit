import { userSlice } from "../reducers/userReducer";
import { API } from "../services/fetch";

export const fetchUser = () => (dispatch, getState) => {
  return API({
    endpoint: "users/1",
    name: userSlice.name,
    actions: [userSlice.actions.setIsFetching, userSlice.actions.addUser, userSlice.actions.setHasError],
    mustValidateToken: false,
  });
};
