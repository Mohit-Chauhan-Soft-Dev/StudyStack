import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Card, Stack, Button, Avatar } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Layout from '../components/layout/Layout';
import { statsService } from '../services/statsService';

const values = [
  {
    icon: <FlagOutlinedIcon />,
    title: 'Our mission',
    desc: 'Make trustworthy, exam-ready study material accessible and affordable for every student, everywhere.',
  },
  {
    icon: <GroupsOutlinedIcon />,
    title: 'Built with students',
    desc: 'Every feature, from search to checkout, is shaped by feedback from the students who use it daily.',
  },
  {
    icon: <EmojiObjectsOutlinedIcon />,
    title: 'Quality first',
    desc: 'We favour clarity and accuracy over volume — notes on StudyStack are meant to be actually used, not just downloaded.',
  },
  {
    icon: <ShieldOutlinedIcon />,
    title: 'Fair to creators',
    desc: 'Note creators are paid fairly and their work is protected from unauthorised redistribution.',
  },
];

function formatCount(n) {
  if (n === null || n === undefined) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
  return String(n) + "+";
}

export default function AboutPage() {
  const [studentsCount, setStudentsCount] = useState(null);
  const [notesCount, setNotesCount] = useState(null);

  useEffect(() => {
    statsService.getUsersCount()
      .then(setStudentsCount)
      .catch(() => setStudentsCount(null));

    statsService.getNotesCount()
      .then(setNotesCount)
      .catch(() => setNotesCount(null));
  }, []);

  const stats = [
    { value: formatCount(studentsCount), label: 'Students learning' },
    { value: formatCount(notesCount), label: 'Notes published' },
    // { value: '40+', label: 'Subjects covered' },
    // { value: '4.8/5', label: 'Average rating' },
  ];

  return (
    <Layout>
      <Box sx={{ background: 'linear-gradient(180deg, #f4eeff 0%, #faf9fc 60%)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 }, textAlign: 'center', px: 3 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}>
            About StudyStack
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary' }}>
            We started StudyStack with a simple idea: finding good notes
            before an exam shouldn&apos;t feel like a scavenger hunt.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 }, px: 3 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
              Our story
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                StudyStack began as a small collection of notes shared between
                classmates before final exams. As more students asked for
                access, it became clear there was a real need for a single,
                reliable place to find well-organised, exam-focused notes.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Today, StudyStack connects students with notes created by
                toppers, tutors, and subject experts — with a fast, secure
                checkout so you can go from browsing to studying in minutes.
              </Typography>
            </Stack>
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              component={RouterLink}
              to="/contact"
              endIcon={<ArrowForwardIcon />}
            >
              Get in touch
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {stats.map((s) => (
                <Grid key={s.label} size={{ xs: 6 }}>
                  <Card variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 9 }, px: 3 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 5, fontSize: { xs: '1.6rem', md: '2rem' } }}>
            What we stand for
          </Typography>
          <Grid container spacing={3}>
            {values.map((v) => (
              <Grid key={v.title} size={{ xs: 12, sm: 6, md: 3 }}>
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
                    {v.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {v.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {v.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 7, md: 9 }, textAlign: 'center', px: 3 }}>
        <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontWeight: 800 }}>
          SS
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
          Want to join us on this journey?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Whether you want to publish notes or just have a question, we&apos;d
          love to hear from you.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/contact" endIcon={<ArrowForwardIcon />}>
          Contact Us
        </Button>
      </Container>
    </Layout>
  );
}
