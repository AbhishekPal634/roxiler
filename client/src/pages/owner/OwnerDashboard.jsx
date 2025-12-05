import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/store-owner/dashboard");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>No store data found.</Typography>
      </Container>
    );
  }

  const { store, ratingsFromUsers } = data;

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" mb={1}>
        {store.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={6}>
        {store.address}
      </Typography>

      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="500"
                mb={2}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Average Rating
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Typography variant="h3" fontWeight="600" color="text.primary">
                  {store.averageRating}
                </Typography>
                <StarIcon sx={{ color: "#fbbf24", fontSize: "2rem" }} />
              </Box>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Based on {store.totalRatings} ratings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="500"
                mb={2}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Total Ratings
              </Typography>
              <Typography
                variant="h3"
                fontWeight="600"
                color="text.primary"
                mt={2}
              >
                {store.totalRatings}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Total submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="600" color="text.primary" mb={4}>
        Recent Ratings
      </Typography>

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratingsFromUsers.map((rating) => (
                <TableRow key={rating.ratingId} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {rating.userName}
                  </TableCell>
                  <TableCell>{rating.userEmail}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography>{rating.rating}</Typography>
                      <StarIcon sx={{ color: "#fbbf24", fontSize: "1.2rem" }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(rating.submittedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {ratingsFromUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">
                      No ratings yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default OwnerDashboard;
