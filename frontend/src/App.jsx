import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import NotesListPage from './pages/NotesListPage';
import AdminUploadPage from './pages/AdminUploadPage';
import NoteViewPage from './pages/NoteViewPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public marketing pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App pages */}
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/view/:id"
            element={
              <ProtectedRoute>
                <NoteViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
