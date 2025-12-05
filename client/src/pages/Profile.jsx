import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const Profile = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword) {
      setError("All fields are required");
      setShowError(true);
      return;
    }

    try {
      const endpoint =
        user.role === "store_owner"
          ? "/store-owner/password"
          : "/user/password";
      await api.put(endpoint, passwords);
      setSuccess("Password updated successfully!");
      setShowSuccess(true);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.message ||
        err.message;
      setError("Failed to update password: " + errorMsg);
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" fontWeight="600" color="text.primary" mb={6}>
        Profile
      </Typography>

      {/* User Info */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", p: 4, mb: 4 }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Account Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Name
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {user?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {user?.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Address
            </Typography>
            <Typography variant="body1" fontWeight="500">
              {user?.address}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Update Password */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", p: 4 }}
      >
        <Typography variant="h6" fontWeight="600" mb={3}>
          Update Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleUpdatePassword}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <TextField
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, currentPassword: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            helperText="8-16 characters, at least one uppercase letter and one special character"
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ px: 4, alignSelf: "flex-start" }}
          >
            Update Password
          </Button>
        </Box>
      </Paper>

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

export default Profile;
