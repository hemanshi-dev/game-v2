import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Game } from "../../types";
import { getGames } from "../../services/api";

interface GamesState {
  items: Game[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

const initialState: GamesState = {
  items: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

// Async thunk — fetch page 1
export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (page: number) => {
    const data = await getGames(page, 20);
    return { data, page };
  },
);

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    resetGames(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        if (action.meta.arg === 1) {
          state.isLoading = true;
          state.error = null;
        } else {
          state.isLoadingMore = true;
        }
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        state.isLoading = false;
        state.isLoadingMore = false;
        state.page = page;
        state.hasMore = data.length >= 20;

        if (page === 1) {
          state.items = data;
        } else {
          // Avoid duplicates
          const existingIds = new Set(state.items.map((g) => g._id));
          const newItems = data.filter((g) => !existingIds.has(g._id));
          state.items = [...state.items, ...newItems];
        }
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.error.message ?? "Failed to load games";
      });
  },
});

export const { resetGames } = gamesSlice.actions;
export default gamesSlice.reducer;
