import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Box className="max-w-7xl mx-auto w-full">
        <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 600,
              textDecoration: "none",
              color: "text.primary",
              flexGrow: 0,
              mr: "auto",
            }}
          >
            StoreRating
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            {user.role === "admin" && (
              <>
                <Button
                  component={Link}
                  to="/admin/dashboard"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/admin/users"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Users
                </Button>
                <Button
                  component={Link}
                  to="/admin/stores"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Stores
                </Button>
              </>
            )}

            {user.role === "store_owner" && (
              <>
                <Button
                  component={Link}
                  to="/owner/dashboard"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  to="/owner/profile"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Profile
                </Button>
              </>
            )}

            {user.role === "user" && (
              <>
                <Button
                  component={Link}
                  to="/user/stores"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Stores
                </Button>
                <Button
                  component={Link}
                  to="/profile"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  Profile
                </Button>
              </>
            )}

            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                borderLeft: "1px solid",
                borderColor: "divider",
                pl: 3,
              }}
            >
              {user.name}
            </Typography>

            <Button
              variant="outlined"
              size="medium"
              onClick={handleLogout}
              sx={{ px: 3 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;
