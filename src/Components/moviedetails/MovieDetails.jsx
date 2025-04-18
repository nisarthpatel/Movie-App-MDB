import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MovieContext } from "../../contexts/MovieContext";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";

const MovieDetails = () => {
  const { id } = useParams();
  const { movies } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const movieId = parseInt(id);
    const foundMovie = movies.find((m) => m.id === movieId);

    if (foundMovie) {
      setMovie(foundMovie);
      fetchTrailer(foundMovie.id);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [id, movies]);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const fetchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];

      const trailer = results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );

      if (trailer?.key) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      } else {
        setTrailerUrl("none");
      }
    } catch (err) {
      console.error("Failed to fetch trailer", err);
      setTrailerUrl("none");
    }
  };

  if (loading) {
    return (
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
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h5" gutterBottom>
            Movie not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Grid container>
          {/* Poster */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, md: 0 },
              }}
            >
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "cover",
                  borderRadius: { xs: 1, md: 0 },
                }}
              />
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold" }}
                >
                  {movie.title}
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate("/edit-movie")}
                    sx={{
                      fontWeight: "bold",
                      px: 3,
                      py: 1,
                      textTransform: "none",
                    }}
                  >
                    ✏️ Edit
                  </Button>

                  {trailerUrl && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => window.open(trailerUrl, "_blank")}
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        "&:hover": {
                          backgroundColor: "#b71c1c",
                        },
                        "&:active": {
                          backgroundColor: "#880e4f",
                        },
                      }}
                    >
                      🎬 Watch Trailer
                    </Button>
                  )}
                </Box>
              </Box>

              {movie.tagline && (
                <Typography
                  variant="subtitle1"
                  sx={{ fontStyle: "italic", mb: 2, color: "text.secondary" }}
                >
                  {movie.tagline}
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={movie.release_date?.split("-")[0] || "Unknown Year"}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${movie.runtime || "?"} min`}
                />
                <Chip
                  icon={<StarIcon sx={{ color: "gold" }} />}
                  label={`${movie.vote_average?.toFixed(1) || "?"}/10`}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {movie.overview || "No overview available."}
                </Typography>
              </Box>

              {movie.genres && movie.genres.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Genres
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {movie.genres.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{ bgcolor: theme.palette.primary.dark }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original Language
                  </Typography>
                  <Typography variant="body1">
                    {movie.original_language?.toUpperCase() || "Unknown"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Popularity
                  </Typography>
                  <Typography variant="body1">
                    {movie.popularity?.toFixed(1) || "Unknown"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vote Count
                  </Typography>
                  <Typography variant="body1">
                    {movie.vote_count || "0"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {movie.status || "Unknown"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetails;
