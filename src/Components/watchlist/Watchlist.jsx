import { useContext, useState } from "react";
import { WatchlistContext } from "./WatchlistContext";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tooltip,
  Fade,
  Zoom,
  Divider,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from "@mui/icons-material/Info";
import SortIcon from "@mui/icons-material/Sort";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } =
    useContext(WatchlistContext);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [sortOrder, setSortOrder] = useState("dateAdded"); // dateAdded, name, rating
  const theme = useTheme();

  const handleRemove = (movieId) => {
    removeFromWatchlist(movieId);
  };

  const toggleSortOrder = () => {
    const orders = ["dateAdded", "name", "rating"];
    const currentIndex = orders.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % orders.length;
    setSortOrder(orders[nextIndex]);
  };

  const getSortedWatchlist = () => {
    return [...watchlist].sort((a, b) => {
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "rating") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      } else {
        // Default: dateAdded (newest first)
        return new Date(b.added_at) - new Date(a.added_at);
      }
    });
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case "name":
        return "Sorted by: Title (A-Z)";
      case "rating":
        return "Sorted by: Rating (High-Low)";
      default:
        return "Sorted by: Recently Added";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          My Watchlist
        </Typography>
        {watchlist.length > 0 && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Tooltip title={getSortLabel()}>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={toggleSortOrder}
                size="small"
              >
                {sortOrder === "name"
                  ? "By Title"
                  : sortOrder === "rating"
                  ? "By Rating"
                  : "By Date"}
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              onClick={() => setShowConfirmClear(true)}
              size="small"
            >
              Clear All
            </Button>
          </Box>
        )}
      </Box>

      {watchlist.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
            Your watchlist is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Start adding movies from the home page to build your watchlist
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Browse Movies
          </Button>
        </Box>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} in
            your watchlist
          </Alert>

          <Grid container spacing={3}>
            {getSortedWatchlist().map((movie) => (
              <Zoom
                key={movie.id}
                in={true}
                style={{ transitionDelay: "100ms" }}
              >
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="225"
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/placeholder.png"
                      }
                      alt={movie.title}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        p: 0.5,
                        display: "flex",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          component={Link}
                          to={`/movie/${movie.id}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            "&:hover": {
                              bgcolor: theme.palette.primary.main,
                              color: "black",
                            },
                          }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove from Watchlist">
                        <IconButton
                          onClick={() => handleRemove(movie.id)}
                          size="small"
                          sx={{
                            bgcolor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            "&:hover": {
                              bgcolor: theme.palette.error.main,
                              color: "white",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {movie.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {movie.release_date?.split("-")[0] || "Unknown"}
                        </Typography>
                        {movie.vote_average && (
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: "black",
                              px: 1,
                              borderRadius: 1,
                              fontWeight: "bold",
                            }}
                          >
                            {movie.vote_average.toFixed(1)}
                          </Typography>
                        )}
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        Added: {format(new Date(movie.added_at), "MMM d, yyyy")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Zoom>
            ))}
          </Grid>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
      >
        <DialogTitle>Clear Watchlist?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all {watchlist.length} movies from
            your watchlist? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmClear(false)}>Cancel</Button>
          <Button
            onClick={() => {
              clearWatchlist();
              setShowConfirmClear(false);
            }}
            color="error"
            variant="contained"
          >
            Clear Watchlist
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WatchlistPage;
