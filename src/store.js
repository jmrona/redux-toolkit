import { configureStore } from "@reduxjs/toolkit";
import pokeReducer from "./reducers/pokeReducer";
import userReducer from "./reducers/userReducer";

export const store = configureStore({
  reducer: {
    pokemons: pokeReducer,
    user: userReducer,
  },
});
