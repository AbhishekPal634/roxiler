import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError("Name must be between 20 and 60 characters");
      setShowError(true);
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 16) {
      setError("Password must be between 8 and 16 characters");
      setShowError(true);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      setShowError(true);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must contain at least one special character");
      setShowError(true);
      return;
    }

    if (formData.address.length > 400) {
      setError("Address must not exceed 400 characters");
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup(formData);
      navigate("/user/stores");
    } catch (error) {
      console.error("Signup failed", error);
      const errorMsg =
        error.response?.data?.errors?.join(", ") ||
        error.response?.data?.message ||
        "Signup failed. Please try again.";
      setError(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Container maxWidth="sm">
        <Paper elevation={0} className="border border-gray-200">
          <Box sx={{ p: 5 }}>
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                fontWeight="600"
                color="text.primary"
                mb={1}
              >
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join us to rate your favorite stores
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  fullWidth
                  helperText="20-60 characters"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  fullWidth
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  fullWidth
                  helperText="8-16 characters, must include uppercase and special character"
                />

                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  multiline
                  rows={3}
                  fullWidth
                  helperText="Max 400 characters"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  fullWidth
                  sx={{ mt: 1, py: 1.5 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Box>
            </form>

            <Box
              textAlign="center"
              mt={4}
              pt={3}
              borderTop="1px solid"
              borderColor="divider"
            >
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

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
    </div>
  );
};

export default Signup;
