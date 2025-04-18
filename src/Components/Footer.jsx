import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useTheme,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {year} Watch Movies App. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="inherit">
              <GitHubIcon fontSize="small" />
            </Link>
            <Link href="#" color="inherit">
              <LinkedInIcon fontSize="small" />
            </Link>
            <Link href="#" color="inherit">
              <TwitterIcon fontSize="small" />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
