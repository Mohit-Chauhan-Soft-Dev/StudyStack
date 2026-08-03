import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { noteService } from '../services/noteService';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Skeleton,
  Stack,
} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { paymentService } from '../services/paymentService';
import Layout from '../components/layout/Layout';

export default function NotesListPage() {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const reponse = await noteService.getAllNotes();
      const data = reponse.data;

      console.log(user.role);

      if (reponse.status === 204) {
        return;
      }

      const notesWithStatus = await Promise.all(
        data.map(async (note) => {
          try {
            const status = await paymentService.checkOrderStatus(note.id);
            return {
              ...note,
              orderStatus: status
            };
          } catch (e) {

            return {
              ...note,
              orderStatus: "NOT_PURCHASED"
            };
          }
        })
      );

      setNotes(notesWithStatus);

    } catch (error) {

      toast.error("Failed to load notes");

    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (note) => {
    setSelectedNote(note);
    setPaymentOpen(true);
  };

  return (
    <Layout>
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 }, px: 3 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: 0.5 }}>
            Available Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse notes uploaded by our contributors and get instant access
            after checkout.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: 3, flexGrow: 1 }}>
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ p: 2.5 }}>
                  <Skeleton variant="rounded" width={44} height={44} sx={{ mb: 2, borderRadius: '12px' }} />
                  <Skeleton width="70%" height={28} />
                  <Skeleton width="100%" />
                  <Skeleton width="90%" sx={{ mb: 2 }} />
                  <Skeleton width="40%" height={32} sx={{ mb: 2 }} />
                  <Skeleton variant="rounded" height={40} />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : notes.length === 0 ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
            <InboxOutlinedIcon sx={{ fontSize: 56, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary">
              No notes available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check back soon — new notes are added regularly.
            </Typography>
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {notes.map((note) => (
              <Grid
                key={note.id}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 35px -18px rgba(20,15,30,0.25)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 3 }}>

                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(124,58,237,0.08)',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      <MenuBookOutlinedIcon />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {note.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2.5, flexGrow: 1 }}
                    >
                      {note.description}
                    </Typography>

                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        ₹{note.price} &nbsp;
                      </Typography>
                      {note.orderStatus === 'PAID' && (
                        <Chip
                          size="small"
                          icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                          label="Purchased"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {user.role === "BUYER" ? (
                      note.orderStatus === "PAID" ? (
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={() => navigate(`/notes/view/${note.id}`)}
                        >
                          View
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handlePurchase(note)}
                        >
                          Purchase
                        </Button>
                      )
                    ) : ''}


                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <PaymentModal
        open={paymentOpen}
        note={selectedNote}
        onClose={() => setPaymentOpen(false)}
      />
    </Layout>
  );
}
