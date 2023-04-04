import { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./actions/userActions";
import { getAllPokemons } from "./actions/pokeActions";

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllPokemons());
  }, []);

  return (
    <div className='App'>
      <h1>Hi! {user.username}</h1>
      <div className='card'>{user.email}</div>
    </div>
  );
}

export default App;
