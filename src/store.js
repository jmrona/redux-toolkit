import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { offline } from "@redux-offline/redux-offline";
import offlineConfig from "@redux-offline/redux-offline/lib/defaults";

import { rootReducer } from "./reducers/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware(), logger, offline(offlineConfig)];
  },
});
