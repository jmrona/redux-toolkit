import { combineReducers } from "@reduxjs/toolkit";
import { pokemonReducer, userReducer } from ".";

export const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  user: userReducer,
});
