import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import '../css/Home.css'
import { searchMovies, getPopularMovies } from "../services/api";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            }
            catch (error) {
                console.log(error);
                setError("Failed to Load Movies")
            }
            finally {
                setLoading(false);
            }
        }
        loadPopularMovies();
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!searchQuery.trim()) return;
        if(loading) return;


        setLoading(true);
        try{
            const searchResults = await searchMovies(searchQuery);
            setMovies(searchResults);
            setError(null);
        }
        catch (error){
            setError("Failed To Search Movies...");
            console.log(error);
        }
        finally{
            setLoading(false);
        }
        
        // setSearchQuery("");
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" className="search-input" placeholder="Search for movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button type="submit" className="search-btn">Submit</button>
            </form>

            {error && <div className="error-message"> {error} </div>}

            {loading ? <div className="loading">Loading...</div> : <div className="movies-grid">
                {movies.map(movie => <MovieCard movie={movie} key={movie.id} />)}
            </div>}

        </div>
    );
};

export default Home;