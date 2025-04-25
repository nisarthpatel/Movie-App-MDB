import BookmarkIcon from "@mui/icons-material/Bookmark";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { WatchlistContext } from "./watchlist/WatchlistContext";

const NavBar = ({ toggleTheme, isDarkMode }) => {
  const { watchlist } = useContext(WatchlistContext);
  const watchlistCount = watchlist.length;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/", icon: <HomeIcon /> },
    { name: "Edit Movies", path: "/edit-movie", icon: <EditIcon /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (drawerOpen) setDrawerOpen(false);
  };

  const textColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <AppBar
      position="sticky"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled
          ? theme.palette.mode === "dark"
            ? "linear-gradient(90deg, #121212 0%, #1a1a2e 100%)"
            : "linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)"
          : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.3s ease",
        color: textColor,
      }}
    >
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: textColor,
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              marginRight: 1.5,
              color: "#ffffff",
            }}
          >
            WM
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              display: { xs: "none", sm: "block" },
              color: textColor,
            }}
          >
            Watch Movies
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {navItems.map((item) => (
            <Button
              key={item.name}
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                fontWeight: isActive(item.path) ? 600 : 400,
                borderBottom: isActive(item.path)
                  ? `2px solid ${theme.palette.secondary.main}`
                  : "none",
                color: textColor,
                "&:hover": {
                  borderBottom: `2px solid ${theme.palette.secondary.light}`,
                },
              }}
            >
              {item.name}
            </Button>
          ))}

          <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton sx={{ ml: 1, color: textColor }} onClick={toggleTheme}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ color: textColor }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: theme.palette.background.default,
            color: textColor,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: textColor }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 2 }}>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 1,
                mb: 1,
                color: textColor,
                "&.Mui-selected": {
                  bgcolor: theme.palette.action.selected,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: textColor }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} sx={{ color: textColor }} />
            </ListItem>
          ))}

          <ListItem
            button
            onClick={() => handleNavigation("/search")}
            sx={{ borderRadius: 1, mb: 1, color: textColor }}
          >
            <ListItemIcon sx={{ color: textColor }}>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search Movies" sx={{ color: textColor }} />
          </ListItem>

          <ListItem
            button
            onClick={toggleTheme}
            sx={{ borderRadius: 1, mb: 1, color: textColor }}
          >
            <ListItemIcon sx={{ color: textColor }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText
              primary={isDarkMode ? "Light Mode" : "Dark Mode"}
              sx={{ color: textColor }}
            />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
