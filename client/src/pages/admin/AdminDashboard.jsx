import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" mb={6}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
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
                Total Users
              </Typography>
              <Typography variant="h3" fontWeight="600" color="text.primary">
                {stats?.totalUsers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Registered users on platform
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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
                Total Stores
              </Typography>
              <Typography variant="h3" fontWeight="600" color="text.primary">
                {stats?.totalStores || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Active stores listed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
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
              <Typography variant="h3" fontWeight="600" color="text.primary">
                {stats?.totalRatings || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Ratings submitted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
