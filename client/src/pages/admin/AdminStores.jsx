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
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const fetchData = async () => {
    try {
      const storesRes = await api.get("/admin/stores");
      setStores(storesRes.data.data);
      setFilteredStores(storesRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "Failed to fetch stores: " +
          (error.response?.data?.message || error.message)
      );
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...stores];

    // Filter by search
    if (search) {
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.email.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleAddStore = async () => {
    // Client-side validation
    if (!newStore.name.trim()) {
      setError("Store name is required");
      setShowError(true);
      return;
    }
    if (!newStore.email.trim()) {
      setError("Email is required");
      setShowError(true);
      return;
    }
    if (!newStore.address.trim()) {
      setError("Address is required");
      setShowError(true);
      return;
    }
    if (!newStore.password) {
      setError("Password is required");
      setShowError(true);
      return;
    }

    try {
      const response = await api.post("/admin/stores", newStore);

      // Store credentials to display
      setCredentials(response.data.data.credentials);
      setShowCredentials(true);

      setSuccess("Store created successfully!");
      setShowSuccess(true);
      setIsOpen(false);
      setNewStore({ name: "", email: "", address: "", password: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating store:", error);
      const errorMsg =
        error.response?.data?.errors?.join(", ") ||
        error.response?.data?.message ||
        error.message;
      setError("Failed to add store: " + errorMsg);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="600" color="text.primary">
          Manage Stores
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setIsOpen(true)}
          sx={{ px: 4 }}
        >
          Add Store
        </Button>
      </Box>

      {/* Search */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", p: 3, mb: 4 }}
      >
        <TextField
          placeholder="Search by name, email, or address..."
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
                  onClick={() => handleSort("email")}
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <Box display="flex" alignItems="center">
                    Email
                    <SortIcon field="email" />
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
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No stores found. Click "Add Store" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{store.name}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>
                      {store.rating
                        ? parseFloat(store.rating).toFixed(1)
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Store Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Add New Store
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={2}>
            <TextField
              label="Store Name"
              value={newStore.name}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newStore.email}
              onChange={(e) =>
                setNewStore({ ...newStore, email: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Address"
              value={newStore.address}
              onChange={(e) =>
                setNewStore({ ...newStore, address: e.target.value })
              }
              multiline
              rows={3}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newStore.password}
              onChange={(e) =>
                setNewStore({ ...newStore, password: e.target.value })
              }
              helperText="8-16 characters, at least one uppercase letter and one special character"
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddStore} variant="contained" sx={{ px: 4 }}>
            Create Store
          </Button>
        </DialogActions>
      </Dialog>

      {/* Credentials Display Dialog */}
      <Dialog
        open={showCredentials}
        onClose={() => setShowCredentials(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Store Owner Credentials
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please share these credentials with the store owner. They will not
            be shown again.
          </Alert>
          <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Owner Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {credentials?.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {credentials?.email}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Password
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight="500"
                    fontFamily="monospace"
                  >
                    {credentials?.password}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowCredentials(false)}
            variant="contained"
            sx={{ px: 4 }}
          >
            Close
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

export default AdminStores;
