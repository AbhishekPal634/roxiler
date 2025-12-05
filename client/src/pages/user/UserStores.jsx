import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Snackbar,
  Alert,
  TextField,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchStores = async () => {
    try {
      const response = await api.get("/user/stores");
      setStores(response.data.data);
      setFilteredStores(response.data.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    let result = [...stores];

    // Filter by search
    if (search) {
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    setFilteredStores(result);
  }, [search, sortBy, sortOrder, stores]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 0);
    setIsOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedStore || rating === 0) return;

    try {
      if (selectedStore.userRating) {
        // Update existing rating
        await api.put("/user/ratings", {
          store_id: selectedStore.id,
          rating: rating,
        });
        setSuccess("Rating updated successfully!");
      } else {
        // Submit new rating
        await api.post("/user/ratings", {
          store_id: selectedStore.id,
          rating: rating,
        });
        setSuccess("Rating submitted successfully!");
      }

      setShowSuccess(true);
      setIsOpen(false);
      fetchStores();
    } catch (error) {
      console.error("Error submitting rating:", error);
      const errorMsg = error.response?.data?.message || error.message;
      setError("Failed to submit rating: " + errorMsg);
      setShowError(true);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
    ) : (
      <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" mb={4}>
        Stores
      </Typography>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", p: 3, mb: 4 }}
      >
        <TextField
          placeholder="Search by store name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          fullWidth
        />
      </Paper>

      {/* Stores Table */}
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => handleSort("name")}
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <Box display="flex" alignItems="center">
                    Store Name
                    <SortIcon field="name" />
                  </Box>
                </TableCell>
                <TableCell
                  onClick={() => handleSort("address")}
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <Box display="flex" alignItems="center">
                    Address
                    <SortIcon field="address" />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Average Rating
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Your Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={1}
                    >
                      <Typography fontWeight="bold">{store.rating}</Typography>
                      <StarIcon sx={{ color: "#fbbf24", fontSize: "1.2rem" }} />
                      <Typography variant="body2" color="text.secondary">
                        ({store.totalRatings})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {store.userRating ? (
                      <Rating value={store.userRating} readOnly size="small" />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not rated
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleRateClick(store)}
                      sx={{ px: 3 }}
                    >
                      {store.userRating ? "Update Rating" : "Rate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Rate {selectedStore?.name}
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            py={3}
          >
            <Typography variant="body1" fontWeight="500">
              How would you rate this store?
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{ fontSize: "3rem" }}
            />
            <Typography variant="h5" fontWeight="bold">
              {rating} / 5
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={rating === 0}
            sx={{ px: 4 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserStores;
