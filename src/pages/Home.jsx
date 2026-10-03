import MovieCard from "../components/MovieCard.jsx";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api.js";
import "../css/Home.css";
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);
  async function handleSearch(event) {
    event.preventDefault();
    if(!searchQuery.trim()) return;
    if(loading) return;
    setLoading(true);
    try{
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
    }
    catch(error){
      console.log(error);
      setError("Failed to search movies...");
    }
    finally{
      setLoading(false);
    };
  };
  function updateSearch(event) {
    setSearchQuery(event.target.value);
  };
  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          onChange={updateSearch}
          value={searchQuery}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="movies-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          movies.map((movie) => <MovieCard movie={movie} key={movie.id} />)
        )}
      </div>
    </div>
  );
}
export default Home;
