import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  active: [],
};

export const pokemonSlice = createSlice({
  name: "pokemon",
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
    getAllPokemon: (state, action) => {
      return {
        ...state,
        list: [...action.payload.results],
      };
    },
    getPokemonSelected: (state, action) => {
      return {
        ...state,
        active: [action.payload],
      };
    },
  },
});

export const { setIsFetching, setHasError, getAllPokemon, getPokemonSelected } = pokemonSlice.actions;
export default pokemonSlice.reducer;
