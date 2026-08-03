import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Card,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import toast from 'react-hot-toast';
import { noteService } from '../services/noteService';
import Layout from '../components/layout/Layout';

export default function AdminUploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);

      await noteService.uploadNote(data);
      toast.success('Note uploaded successfully!');
      setFormData({ title: '', description: '', price: '', file: null });
      navigate('/notes');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout footer={false}>
      <Box
        sx={{
          flexGrow: 1,
          background: 'linear-gradient(180deg, #f4eeff 0%, #faf9fc 60%)',
          py: { xs: 5, md: 7 },
          px: 2,
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #7c3aed 0%, #47bfff 100%)',
                color: '#fff',
              }}
            >
              <UploadFileOutlinedIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Upload New Note
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Add a new PDF note to the StudyStack library
            </Typography>
          </Stack>

          <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                required
              />
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<PictureAsPdfOutlinedIcon />}
                sx={{ mt: 2, mb: formData.file ? 1 : 2, py: 1.3 }}
              >
                Upload PDF
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".pdf"
                  hidden
                />
              </Button>
              {formData.file && (
                <Chip
                  icon={<PictureAsPdfOutlinedIcon sx={{ fontSize: 16 }} />}
                  label={formData.file.name}
                  sx={{ mb: 2, maxWidth: '100%' }}
                  onDelete={() => setFormData({ ...formData, file: null })}
                />
              )}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? 'Uploading...' : 'Upload Note'}
              </Button>
            </Box>
          </Card>
        </Container>
      </Box>
    </Layout>
  );
}
