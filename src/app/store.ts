import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "../features/games/gamesSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import searchReducer from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    categories: categoriesReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
