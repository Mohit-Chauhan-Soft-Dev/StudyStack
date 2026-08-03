import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, footer = true }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      {footer && <Footer />}
    </Box>
  );
}
