import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { rootReducer } from "./reducers/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware(), logger];
  },
});
