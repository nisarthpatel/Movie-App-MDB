import { Card, CardContent, Skeleton, Box } from "@mui/material";

const SkeletonMovieCard = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Skeleton
        variant="rectangular"
        height={300}
        animation="wave"
        className="skeleton-loader"
      />
      <CardContent>
        <Skeleton height={28} width="80%" animation="wave" />
        <Box sx={{ mt: 1 }}>
          <Skeleton height={20} width="40%" animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkeletonMovieCard;
