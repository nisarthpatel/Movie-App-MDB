import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  // Enhanced error handling
  const handleApiError = (err) => {
    console.error("API Error:", err);

    const errorMessage =
      err.response?.data?.status_message ||
      err.message ||
      "An unexpected error occurred";

    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Auto-clear error after 5 seconds
  };

  // Extract the fetch movies logic into a reusable function
  const fetchMoviesFromApi = useCallback(
    async (pageNum) => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
          params: {
            api_key: API_KEY,
            page: pageNum,
            language: "en-US",
          },
        });

        return response.data;
      } catch (err) {
        handleApiError(err);
        throw err;
      }
    },
    [API_KEY]
  );

  // Load more movies with enhanced error recovery
  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await fetchMoviesFromApi(page);

      // Get detailed movie info for each movie
      const moviesWithDetails = await Promise.all(
        data.results.map(async (movie) => {
          try {
            const detailsResponse = await axios.get(
              `${BASE_URL}/movie/${movie.id}`,
              {
                params: {
                  api_key: API_KEY,
                  language: "en-US",
                },
              }
            );
            return { ...movie, ...detailsResponse.data };
          } catch (err) {
            console.warn(`Failed to fetch details for movie ${movie.id}`, err);
            return movie;
          }
        })
      );

      // Enhanced deduplication using Set
      setMovies((prevMovies) => {
        const existingIds = new Set(prevMovies.map((movie) => movie.id));
        const uniqueMovies = moviesWithDetails.filter(
          (movie) => !existingIds.has(movie.id)
        );
        return [...prevMovies, ...uniqueMovies];
      });

      // Update page and hasMore
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      // Error is already handled in fetchMoviesFromApi
    } finally {
      setLoading(false);
      setLoadingInitial(false);
    }
  }, [loading, hasMore, page, fetchMoviesFromApi, API_KEY]);

  // Initial load
  useEffect(() => {
    loadMoreMovies();
  }, []);

  // Update a movie
  const updateMovie = useCallback((updatedMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === updatedMovie.id ? { ...movie, ...updatedMovie } : movie
      )
    );
  }, []);
  const saveMovies = useCallback(
    async (updatedMovies) => {
      setLoading(true);
      try {
        // This would typically be an API call to update movies
        // For now, we'll just simulate an API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update local state with the changes
        Object.values(updatedMovies).forEach((movie) => {
          updateMovie(movie);
        });

        return true;
      } catch (err) {
        handleApiError(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateMovie]
  );
  return (
    <MovieContext.Provider
      value={{
        movies,
        loading,
        loadingInitial,
        error,
        loadMoreMovies,
        hasMore,
        updateMovie,
        saveMovies,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
