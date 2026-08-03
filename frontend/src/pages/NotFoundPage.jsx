import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Layout from '../components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout footer={false}>
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 10,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '5rem', md: '7rem' },
            fontWeight: 800,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #7c3aed 0%, #47bfff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" component={RouterLink} to="/" startIcon={<HomeOutlinedIcon />}>
            Back to Home
          </Button>
          <Button variant="outlined" component={RouterLink} to="/notes">
            Browse Notes
          </Button>
        </Stack>
      </Container>
    </Layout>
  );
}
