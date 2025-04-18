import { createContext, useState, useEffect, useCallback } from "react";

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Load watchlist from localStorage on initial load
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error("Error parsing watchlist from localStorage:", error);
        setWatchlist([]);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add movie to watchlist
  const addToWatchlist = useCallback((movie) => {
    setWatchlist((prev) => {
      // Check if movie is already in watchlist
      if (prev.some((item) => item.id === movie.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          added_at: new Date().toISOString(),
        },
      ];
    });
  }, []);

  // Remove movie from watchlist
  const removeFromWatchlist = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  // Check if a movie is in the watchlist
  const isInWatchlist = useCallback(
    (movieId) => {
      return watchlist.some((movie) => movie.id === movieId);
    },
    [watchlist]
  );

  // Clear the entire watchlist
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
