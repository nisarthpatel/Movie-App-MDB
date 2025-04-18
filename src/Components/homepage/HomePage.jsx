import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { debounce } from "lodash";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../../contexts/MovieContext";
import "./HomePage.css";

const MovieCard = React.memo(({ movie }) => {
  const theme = useTheme();

  return (
    <Card
      className="fade-in"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Link
        to={`/movie/${movie.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          component="img"
          alt={movie.title}
          height="300"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          sx={{ objectFit: "cover" }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {movie.release_date?.split("-")[0] || "Unknown Year"}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
});

MovieCard.displayName = "MovieCard";

const HomePage = () => {
  const { movies, loading, error, loadMoreMovies, hasMore } =
    useContext(MovieContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const theme = useTheme();
  const observer = useRef();
  const lastMovieElementRef = useRef();

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearchTerm(val);
    }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const sortedFilteredMovies = useMemo(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    if (isSorted) {
      return [...filteredMovies].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filteredMovies;
  }, [movies, searchTerm, isSorted]);

  useEffect(() => {
    if (loading) return;

    const currentObserver = observer.current;

    if (currentObserver) {
      currentObserver.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMovies();
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    const el = lastMovieElementRef.current;
    if (el && hasMore) observer.current.observe(el);

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [loading, hasMore, loadMoreMovies, sortedFilteredMovies.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: theme.palette.primary.main,
          mb: 3,
        }}
      >
        Popular Movies
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
        <TextField
          label="Search Movies"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant="contained"
          startIcon={<SortIcon />}
          onClick={() => setIsSorted(!isSorted)}
          sx={{ height: 56, whiteSpace: "nowrap" }}
        >
          {isSorted ? "Unsort" : "Sort"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sortedFilteredMovies.map((movie, idx) => {
          const isLast = idx === sortedFilteredMovies.length - 1;
          return (
            <Grid
              item
              key={movie.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              ref={isLast ? lastMovieElementRef : null}
              sx={{ mb: 2 }}
            >
              <MovieCard movie={movie} />
            </Grid>
          );
        })}
      </Grid>

      {sortedFilteredMovies.length === 0 && !loading && (
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            No movies found matching {inputValue}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Try a different search term or clear the search.
          </Typography>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {showScrollTop && (
        <Button
          variant="contained"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            minWidth: 0,
            width: 50,
            height: 50,
            borderRadius: "50%",
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Button>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
