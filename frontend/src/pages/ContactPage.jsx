import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import SendIcon from '@mui/icons-material/Send';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import { contactService } from '../services/contactService';

const contactDetails = [
  {
    icon: <EmailOutlinedIcon />,
    title: 'Email us',
    value: 'mohit.chauhan.050607@gmail.com',
  },
  {
    icon: <ScheduleOutlinedIcon />,
    title: 'Response time',
    value: 'Within 24 hours, Mon–Sat',
  },
  {
    icon: <LocationOnOutlinedIcon />,
    title: 'Based in',
    value: 'Remote-first · India',
  },
];

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactService.sendMessage(form);
      toast.success('Thanks! Your message has been sent.');
      setForm(initialForm);
    } catch (error) {
      const data = error.response?.data;
      const msg = typeof data === 'string' ? data : data?.message;
      toast.error(msg || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f4eeff 0%, #faf9fc 60%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 9 }, textAlign: 'center', px: 3 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1.5 }}>
            Get in touch
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary' }}>
            Questions, feedback, or want to publish your notes on StudyStack?
            Send us a message.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 }, px: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              {contactDetails.map((c) => (
                <Card key={c.title} variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(124,58,237,0.08)',
                        color: 'primary.main',
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {c.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {c.value}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      multiline
                      rows={5}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      endIcon={<SendIcon />}
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}
