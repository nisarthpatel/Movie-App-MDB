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
  Badge,
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
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
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
  // Track scroll position for transparent to solid transition
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
    // {
    //   name: "Watchlist",
    //   path: "/watchlist",
    //   icon: (
    //     <Badge badgeContent={watchlistCount} color="secondary">
    //       <BookmarkIcon />
    //     </Badge>
    //   ),
    // },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (drawerOpen) setDrawerOpen(false);
  };

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
            color: "inherit",
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              marginRight: 1.5,
            }}
          >
            WM
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              display: { xs: "none", sm: "block" },
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
              color="inherit"
              startIcon={item.icon}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                fontWeight: isActive(item.path) ? 600 : 400,
                borderBottom: isActive(item.path)
                  ? `2px solid ${theme.palette.secondary.main}`
                  : "none",
                "&:hover": {
                  borderBottom: `2px solid ${theme.palette.secondary.light}`,
                },
              }}
            >
              {item.name}
            </Button>
          ))}

          {/* <Tooltip title="Search Movies">
            <IconButton
              color="inherit"
              sx={{ ml: 1 }}
              onClick={() => handleNavigation("/search")}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip> */}

          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
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
          sx: { width: 240, bgcolor: theme.palette.background.default },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
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
                "&.Mui-selected": {
                  bgcolor: theme.palette.action.selected,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}

          <ListItem
            button
            onClick={() => handleNavigation("/search")}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search Movies" />
          </ListItem>

          <ListItem
            button
            onClick={toggleTheme}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? "Light Mode" : "Dark Mode"} />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
