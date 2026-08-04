import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StarIcon from '@mui/icons-material/Star';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    icon: <MenuBookOutlinedIcon />,
    title: 'Exam-ready notes',
    desc: 'Every note is written and organised by toppers and subject experts so you spend less time searching and more time learning.',
  },
  {
    icon: <PaymentsOutlinedIcon />,
    title: 'Secure checkout',
    desc: 'Pay instantly with UPI, cards or netbanking through a fully secured, PCI-compliant payment gateway.',
  },
  {
    icon: <BoltOutlinedIcon />,
    title: 'Instant access',
    desc: 'The moment your payment is confirmed, your notes unlock — no waiting, no email chasing.',
  },
  {
    icon: <SecurityOutlinedIcon />,
    title: 'Protected content',
    desc: 'Notes are streamed securely to your account only, keeping creators\u2019 work protected from redistribution.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create your free account',
    desc: 'Sign up in seconds with just your email — no long forms, no clutter.',
  },
  {
    step: '02',
    title: 'Browse & pick your notes',
    desc: 'Explore notes across subjects, curated and priced by their creators.',
  },
  {
    step: '03',
    title: 'Pay & study instantly',
    desc: 'Checkout securely and get instant, lifetime access to view your notes online.',
  },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f4eeff 0%, #faf9fc 60%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, md: 3 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ py: { xs: 7, md: 11 } }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                icon={<VerifiedOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Trusted by students across India"
                size="small"
                sx={{
                  mb: 2.5,
                  bgcolor: 'rgba(124,58,237,0.08)',
                  color: 'primary.dark',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.1rem', sm: '2.6rem', md: '3.25rem' },
                  lineHeight: 1.12,
                  mb: 2.5,
                }}
              >
                Study smarter with notes that actually get you result.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary', mb: 4, maxWidth: 560 }}>
                StudyStack is a marketplace of high-quality, exam-focused notes —
                buy once, access anywhere, and skip the hours of searching for
                reliable study material.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  size="large"
                  variant="contained"
                  component={RouterLink}
                  to={user ? '/notes' : '/login'}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.4, px: 3.5 }}
                >
                  {user ? 'Browse Notes' : 'Get Started Free'}
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  component={RouterLink}
                  to="/about"
                  sx={{ py: 1.4, px: 3.5 }}
                >
                  Learn More
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 4.5 }}>
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 34, height: 34, fontSize: 13 } }}>
                  <Avatar sx={{ bgcolor: '#7c3aed' }}>A</Avatar>
                  <Avatar sx={{ bgcolor: '#0ea5e9' }}>P</Avatar>
                  <Avatar sx={{ bgcolor: '#16a34a' }}>S</Avatar>
                  <Avatar sx={{ bgcolor: '#d97706' }}>K</Avatar>
                </AvatarGroup>
                <Box>
                  <Stack direction="row" spacing={0.3}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} sx={{ fontSize: 16, color: '#f59e0b' }} />
                    ))}
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Loved by learners preparing for their next big exam
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 30px 60px -20px rgba(124, 58, 237, 0.35)',
                  background: '#fff',
                }}
              >
                <Stack spacing={2}>
                  {[
                    { title: 'Organic Chemistry — Full Notes', price: '₹199', tag: 'Bestseller' },
                    { title: 'Data Structures & Algorithms', price: '₹199', tag: 'New' },
                    { title: 'Microeconomics — Semester 1', price: '₹99', tag: 'Popular' },
                  ].map((item) => (
                    <Card
                      key={item.title}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {item.title}
                        </Typography>
                        <Chip label={item.tag} size="small" sx={{ mt: 0.5, height: 20, fontSize: 11 }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {item.price}
                      </Typography>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 }, px: { xs: 3, md: 3 } }}>
        <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: { xs: 5, md: 7 } }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: 1.5 }}>
            Everything you need, nothing you don&apos;t
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Built for students who want reliable notes and a checkout
            experience that just works.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(124,58,237,0.08)',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 }, px: { xs: 3, md: 3 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 2 }}>
                How StudyStack works
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                From sign up to studying, the entire flow takes less than a
                couple of minutes.
              </Typography>
              {!user && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/login"
                  endIcon={<ArrowForwardIcon />}
                >
                  Create your account
                </Button>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                {steps.map((s) => (
                  <Stack key={s.step} direction="row" spacing={2.5}>
                    <Typography
                      variant="h4"
                      sx={{ color: 'rgba(124,58,237,0.25)', fontWeight: 800, minWidth: 56 }}
                    >
                      {s.step}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.desc}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 }, px: { xs: 3, md: 3 } }}>
        <Card
          sx={{
            p: { xs: 4, md: 7 },
            borderRadius: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6d28d9 0%, #0ea5e9 100%)',
            color: '#fff',
            border: 'none',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Ready to upgrade the way you study?
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3.5, maxWidth: 520, mx: 'auto' }}>
            Join StudyStack today and get instant access to a growing library
            of exam-ready notes.
          </Typography>
          <Button
            size="large"
            variant="contained"
            component={RouterLink}
            to={user ? '/notes' : '/login'}
            sx={{
              bgcolor: '#fff',
              color: 'primary.dark',
              px: 4,
              '&:hover': { bgcolor: '#f3f0ff' },
            }}
            endIcon={<CloudUploadOutlinedIcon />}
          >
            {user ? 'Explore Notes' : 'Sign Up — It\u2019s Free'}
          </Button>
        </Card>
      </Container>
    </Layout>
  );
}
