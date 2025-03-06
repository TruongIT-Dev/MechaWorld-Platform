import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authSlice } from "../features/auth/authSlice"
import { userSlice } from "../features/user/userSlice"
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.

const persistConfig = {
  key: "root", 
  storage, 
  whitelist: ["auth", "user"], 
};
// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config

const rootReducer = combineSlices(authSlice, userSlice)

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = preloadedState => {
  const store = configureStore({
    reducer: persistedReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    // middleware: getDefaultMiddleware => {
    //   return getDefaultMiddleware().concat(quotesApiSlice.middleware)
    // },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"], 
        },
      }),
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore();
export const persistor = persistStore(store);