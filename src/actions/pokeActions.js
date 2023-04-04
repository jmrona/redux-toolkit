import { pokemonSlice } from "../reducers/pokeReducer";
import { API } from "../services/fetch";

export const getAllPokemons = () => (dispatch, getState) => {
  return API({
    endpoint: "https://pokeapi.co/api/v2/pokemon",
    name: pokemonSlice.name,
    actions: [pokemonSlice.actions.setIsFetching, pokemonSlice.actions.getAllPokemon, pokemonSlice.actions.setHasError],
  });
};
