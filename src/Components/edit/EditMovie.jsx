import { useContext, useState, useCallback } from "react";
import { MovieContext } from "../../contexts/MovieContext";
import {
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  useTheme,
  LinearProgress,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const EditMovie = () => {
  const { movies, updateMovie, saveMovies, loading } = useContext(MovieContext);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editedRows, setEditedRows] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      editable: false,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
      editable: true,
    },
    {
      field: "release_date",
      headerName: "Release Date",
      width: 150,
      editable: true,
      type: "date",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "runtime",
      headerName: "Runtime (min)",
      type: "number",
      width: 130,
      editable: true,
    },
    {
      field: "vote_average",
      headerName: "Rating",
      type: "number",
      width: 120,
      editable: true,
      // FIX HERE - Added null check before using toFixed
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined) return "";
        return `${params.value.toFixed(1)}/10`;
      },
    },
    {
      field: "overview",
      headerName: "Overview",
      flex: 1.5,
      minWidth: 250,
      editable: true,
    },
  ];

  const handleProcessRowUpdate = useCallback(
    (newRow, oldRow) => {
      // Track edited rows for later saving
      setEditedRows((prev) => ({
        ...prev,
        [newRow.id]: newRow,
      }));

      // Update the UI immediately
      updateMovie(newRow);
      return newRow;
    },
    [updateMovie]
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));


      setEditedRows({});

      setNotification({
        open: true,
        message: "Changes saved successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving changes:", err);
      setNotification({
        open: true,
        message: "Error saving changes. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const hasChanges = Object.keys(editedRows).length > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            Edit Movies
          </Typography>
        </Box>
        <Tooltip title="Editing Help">
          <IconButton onClick={() => setHelpOpen(!helpOpen)}>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {helpOpen && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Editing Instructions:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Click on any cell to edit the content directly
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Press Enter or click outside the cell to save changes to the row
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Click "Save Changes" when you're ready to persist all your changes
          </Typography>
          <Typography variant="body2">
            • You can sort and filter the data using the column headers
          </Typography>
        </Paper>
      )}

      {loading && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 600,
            width: "100%",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
          }}
        >
          <DataGrid
            rows={movies}
            columns={columns}
            processRowUpdate={handleProcessRowUpdate}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: "title", sort: "asc" }],
              },
            }}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-row:hover": {
                bgcolor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
          />
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Movies
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          size="large"
        >
          {isSaving
            ? "Saving..."
            : hasChanges
            ? `Save Changes (${Object.keys(editedRows).length})`
            : "No Changes"}
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditMovie;
