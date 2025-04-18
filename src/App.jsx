import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import { WatchlistProvider } from "./Components/watchlist/WatchlistContext";
import { MovieProvider } from "./contexts/MovieContext";
// import { WatchlistContext } from "./Components/watchlist/WatchlistContext";

// Lazy load components for code splitting
const HomePage = lazy(() => import("./Components/homepage/HomePage"));
const EditMovie = lazy(() => import("./Components/edit/EditMovie"));
const MovieDetails = lazy(() =>
  import("./Components/moviedetails/MovieDetails")
);
const WatchlistPage = lazy(() =>
  import("./Components/watchlist/Watchlist")
);

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

// NotFound component
const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        404
      </Typography>
      <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
        Page not found
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        startIcon={<HomeIcon />}
      >
        Back to Home
      </Button>
    </Box>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const [watchlistCount, setWatchlistCount] = useState(0);

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: isDarkMode ? "#f48fb1" : "#dc004e",
      },
      background: {
        default: isDarkMode ? "#121212" : "#f5f5f5",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
    },
  });

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  // Keep track of watchlist count for the badge in NavBar
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    if (savedWatchlist) {
      try {
        const watchlist = JSON.parse(savedWatchlist);
        setWatchlistCount(watchlist.length);
      } catch (error) {
        console.error("Error parsing watchlist:", error);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MovieProvider>
        <WatchlistProvider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <NavBar
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
              watchlistCount={watchlistCount}
            />
            <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 4 }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/edit-movie" element={<EditMovie />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  {/* <Route path="/watchlist" element={<WatchlistPage />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Box>
            <Footer />
          </Box>
        </WatchlistProvider>
      </MovieProvider>
    </ThemeProvider>
  );
};

export default App;
