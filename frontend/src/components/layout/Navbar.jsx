import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../hooks/useAuth';

const publicLinks = [
  { label: 'Home', to: '/' },
  { label: 'Browse Notes', to: '/notes' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function Brand({ onClick }) {
  return (
    <Box
      component={RouterLink}
      to="/"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #47bfff 100%)',
          color: '#fff',
        }}
      >
        <SchoolIcon fontSize="small" />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
        StudyStack
      </Typography>
    </Box>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 });

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const initials = (user?.sub || user?.username || '?').slice(0, 1).toUpperCase();

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          bgcolor: trigger ? 'rgba(255,255,255,0.92)' : 'background.paper',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
          <Toolbar disableGutters sx={{ minHeight: 68, gap: 2 }}>
            <Brand />

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {publicLinks.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    color: location.pathname === link.to ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === link.to ? 700 : 500,
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {user?.role === 'ADMIN' && (
                <Button
                  component={RouterLink}
                  to="/admin/upload"
                  startIcon={<UploadFileIcon fontSize="small" />}
                  sx={{ ml: 0.5 }}
                >
                  Upload
                </Button>
              )}

              {!user ? (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  sx={{ ml: 1.5 }}
                >
                  Login / Sign Up
                </Button>
              ) : (
                <>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                    <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
                      {initials}
                    </Avatar>
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {user?.sub || user?.username || 'Account'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.role}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Brand onClick={() => setMobileOpen(false)} />
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ flexGrow: 1 }}>
            {publicLinks.map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  selected={location.pathname === link.to}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            {user?.role === 'ADMIN' && (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/admin/upload"
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary="Upload Notes" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            {!user ? (
              <Button
                fullWidth
                variant="contained"
                component={RouterLink}
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                Login / Sign Up
              </Button>
            ) : (
              <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
