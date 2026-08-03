import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: '#150f22', color: 'rgba(255,255,255,0.82)', mt: 'auto' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 }, px: { xs: 3, md: 3 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #47bfff 100%)',
                }}
              >
                <SchoolIcon sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                StudyStack
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ maxWidth: 320, color: 'rgba(255,255,255,0.6)' }}>
              A curated marketplace for high-quality, exam-ready study notes —
              built by students, reviewed for students.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5 }}>
              Product
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/notes" underline="hover" color="inherit" variant="body2">
                Browse Notes
              </Link>
              <Link component={RouterLink} to="/login" underline="hover" color="inherit" variant="body2">
                Sign Up
              </Link>
              <Link component={RouterLink} to="/login" underline="hover" color="inherit" variant="body2">
                Login
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link component={RouterLink} to="/about" underline="hover" color="inherit" variant="body2">
                About Us
              </Link>
              <Link component={RouterLink} to="/contact" underline="hover" color="inherit" variant="body2">
                Contact
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5 }}>
              Get in touch
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  mohit.chauhan.050607@gmail.com
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Remote-first · India
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: { xs: 4, md: 5 } }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {year} StudyStack. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Terms of Service
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
