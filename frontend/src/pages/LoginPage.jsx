import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import {
  Container,
  Box,
  TextField,
  Button,
  Card,
  Typography,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import Layout from '../components/layout/Layout';

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Email verification (OTP) step, shown after signup or when login is
  // blocked because the account hasn't verified its email yet.
  const [verifyingEmail, setVerifyingEmail] = useState(null);
  const [otp, setOtp] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationSentAt, setVerificationSentAt] = useState(null);
  const [verificationElapsed, setVerificationElapsed] = useState(0);
  const CODE_TTL = 120; // seconds
  const [verificationRemaining, setVerificationRemaining] = useState(CODE_TTL);
  const [verificationExpired, setVerificationExpired] = useState(false);

  useEffect(() => {
    if (!verificationSentAt) {
      setVerificationElapsed(0);
      setVerificationRemaining(CODE_TTL);
      setVerificationExpired(false);
      return;
    }
    const update = () => {
      const elapsed = Math.floor((Date.now() - verificationSentAt) / 1000);
      const remaining = Math.max(0, CODE_TTL - elapsed);
      setVerificationElapsed(elapsed);
      setVerificationRemaining(remaining);
      setVerificationExpired(remaining === 0);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [verificationSentAt]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    return data.message || fallback;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      toast.success('Login successful!');
      navigate('/notes');
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email first.');
        setVerifyingEmail(formData.email);
        setVerificationSentAt(Date.now());
      } else {
        toast.error(getErrorMessage(error, 'Login failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      toast.success('Signup successful! Please check your email for a verification code.');
      setVerifyingEmail(formData.email);
      setVerificationSentAt(Date.now());
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    try {
      await authService.verifyEmail(verifyingEmail, otp);
      toast.success('Email verified! You can now log in.');
      setVerifyingEmail(null);
        setVerificationSentAt(null);
      setOtp('');
      setTab(0);
      setFormData((prev) => ({ ...prev, email: verifyingEmail, password: '' }));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Verification failed'));
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const message = await authService.resendOtp(verifyingEmail);
      toast.success(message || 'Verification code sent');
      setVerificationSentAt(Date.now());
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not resend code'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Layout footer={false}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #f4eeff 0%, #faf9fc 60%)',
          py: { xs: 6, md: 8 },
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
              {verifyingEmail ? <MarkEmailReadIcon /> : <SchoolIcon />}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {verifyingEmail ? 'Verify your email' : 'Welcome to StudyStack'}
            </Typography>
            {verifyingEmail ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {`Enter the 6-digit code we sent to ${verifyingEmail}`}
                </Typography>
                {verificationSentAt && (
                  <>
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                      {`Code sent: ${new Date(verificationSentAt).toLocaleString()}`}
                    </Typography>
                    {!verificationExpired ? (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                        {`Time left: ${String(Math.floor(verificationRemaining / 60)).padStart(2, '0')}:${String(verificationRemaining % 60).padStart(2, '0')}`}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="error" sx={{ textAlign: 'center', display: 'block' }}>
                        {'Code expired'}
                      </Typography>
                    )}
                  </>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {'Login or create an account to browse and purchase notes'}
              </Typography>
            )}
          </Stack>

          <Card sx={{ width: '100%', p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
            {verifyingEmail ? (
              <Box component="form" onSubmit={handleVerifyEmail} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Verification Code"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  margin="normal"
                  required
                  autoFocus
                  slotProps={{
                    htmlInput: { maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  disabled={verifyLoading || verificationExpired}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                  >
                    {resendLoading ? 'Sending...' : 'Resend code'}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setVerifyingEmail(null);
                      setOtp('');
                      setVerificationSentAt(null);
                    }}
                  >
                    Back
                  </Button>
                </Stack>
              </Box>
            ) : (
              <>
                <Tabs
                  value={tab}
                  onChange={(e, newValue) => setTab(newValue)}
                  variant="fullWidth"
                  sx={{ mb: 1 }}
                >
                  <Tab label="Login" />
                  <Tab label="Sign Up" />
                </Tabs>

                {tab === 0 && (
                  <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      required
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((show) => !show)}
                                edge="end"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button
                      fullWidth
                      name="login"
                      variant="contained"
                      size="large"
                      sx={{ mt: 3 }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Box>
                )}

                {tab === 1 && (
                  <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      required
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((show) => !show)}
                                edge="end"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      margin="normal"
                      required
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword((show) => !show)}
                                edge="end"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ mt: 3 }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Container>
      </Box>
    </Layout>
  );
}
