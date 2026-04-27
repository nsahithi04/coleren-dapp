import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import storageSession from "redux-persist/es/storage/session";
import userReducer from "./userSlice";

export const buildStore = () => {
  const userPersistConfig = {
    key: "user",
    storage: storage,
  };

  const rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
  });

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};

const { store, persistor } = buildStore();

export { store, persistor };
