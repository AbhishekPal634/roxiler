import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowUpward,
  ArrowDownward,
  Visibility,
} from "@mui/icons-material";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [roleFilter, setRoleFilter] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    // Filter by search
    if (search) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          (user.address &&
            user.address.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by role
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
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

    setFilteredUsers(result);
  }, [search, sortBy, sortOrder, roleFilter, users]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleAddUser = async () => {
    // Validation
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.address ||
      !newUser.role
    ) {
      setError("All fields are required");
      setShowError(true);
      return;
    }

    try {
      await api.post("/admin/users", newUser);
      setSuccess("User created successfully!");
      setShowSuccess(true);
      setIsAddOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      fetchUsers();
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        err.message;
      setError("Failed to create user: " + errorMsg);
      setShowError(true);
    }
  };

  const handleViewDetails = async (user) => {
    try {
      const response = await api.get(`/admin/users/${user.id}`);
      setSelectedUser(response.data.data);
      setIsDetailsOpen(true);
    } catch (err) {
      setError("Failed to fetch user details");
      setShowError(true);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "store_owner":
        return "primary";
      case "user":
        return "success";
      default:
        return "default";
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
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Typography variant="h4" fontWeight="600" color="text.primary">
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddOpen(true)}
          size="large"
          sx={{ px: 4 }}
        >
          Add User
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", mb: 4 }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 300, flexGrow: 1 }}
          />
          <TextField
            select
            label="Filter by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* Users Table */}
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
                    Name
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
                <TableCell
                  onClick={() => handleSort("role")}
                  sx={{ cursor: "pointer", fontWeight: 600 }}
                >
                  <Box display="flex" alignItems="center">
                    Role
                    <SortIcon field="role" />
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.replace("_", " ")}
                      size="small"
                      color={getRoleColor(user.role)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(user)}
                      sx={{ color: "primary.main" }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add User Dialog */}
      <Dialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Add New User
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={2}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              helperText="20-60 characters"
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              helperText="8-16 characters, at least one uppercase letter and one special character"
              required
              fullWidth
            />
            <TextField
              label="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              multiline
              rows={3}
              helperText="Maximum 400 characters"
              required
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
              fullWidth
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsAddOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddUser} variant="contained" sx={{ px: 4 }}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Card variant="outlined" sx={{ bgcolor: "grey.50", mt: 2 }}>
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedUser.name}
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
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedUser.address}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Role
                    </Typography>
                    <Chip
                      label={selectedUser.role.replace("_", " ")}
                      size="small"
                      color={getRoleColor(selectedUser.role)}
                      variant="outlined"
                    />
                  </Box>
                  {selectedUser.role === "store_owner" &&
                    selectedUser.store && (
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Store Rating
                        </Typography>
                        <Typography variant="h5" fontWeight="600">
                          {selectedUser.store.rating
                            ? selectedUser.store.rating
                            : "N/A"}
                        </Typography>
                      </Box>
                    )}
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsDetailsOpen(false)}
            variant="contained"
            sx={{ px: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
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

export default AdminUsers;
