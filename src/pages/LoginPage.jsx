import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    Fade,
    Collapse,
    alpha,
    useTheme,
    Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Icons
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

const ADMIN_SECRET_PIN = '130806'; 
const MAX_PIN_ATTEMPTS = 3;

function LoginPage() {
    const theme = useTheme();
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Mode: 'login' | 'pin-verify' | 'register'
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [secretPin, setSecretPin] = useState('');
    const [pinAttempts, setPinAttempts] = useState(0);
    const [pinLocked, setPinLocked] = useState(false);
    const [pinVerified, setPinVerified] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    }

    function handlePinChange(e) {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setSecretPin(value);
        setError('');
    }

    function handleVerifyPin(e) {
        e.preventDefault();

        if (pinLocked) {
            setError('Too many attempts. Please try again later.');
            return;
        }

        if (secretPin === ADMIN_SECRET_PIN) {
            setPinVerified(true);
            setMode('register');
            setSecretPin('');
            setError('');
        } else {
            const newAttempts = pinAttempts + 1;
            setPinAttempts(newAttempts);

            if (newAttempts >= MAX_PIN_ATTEMPTS) {
                setPinLocked(true);
                setError('Access locked. Too many failed attempts.');
                // Auto unlock after 5 minutes
                setTimeout(() => {
                    setPinLocked(false);
                    setPinAttempts(0);
                }, 5 * 60 * 1000);
            } else {
                setError(`Invalid PIN. ${MAX_PIN_ATTEMPTS - newAttempts} attempts remaining.`);
            }
            setSecretPin('');
        }
    }

    function handleSwitchToRegister() {
        setMode('pin-verify');
        setError('');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    }

    function handleBackToLogin() {
        setMode('login');
        setError('');
        setPinVerified(false);
        setSecretPin('');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Validation for registration
        if (mode === 'register') {
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (!pinVerified) {
                setError('PIN verification required');
                return;
            }
        }

        setSaving(true);
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Request failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                p: 2,
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.4,
                    background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }}
            />

            <Fade in timeout={500}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 420,
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Top Gradient Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        }}
                    />

                    {/* Logo & Branding */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            <StorefrontRoundedIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            BT POS
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {mode === 'login' && 'Welcome back! Sign in to continue'}
                            {mode === 'pin-verify' && 'Enter admin PIN to access registration'}
                            {mode === 'register' && 'Create your admin account'}
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    <Collapse in={!!error}>
                        <Alert
                            severity="error"
                            icon={<ErrorRoundedIcon />}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-message': { fontWeight: 500 },
                            }}
                        >
                            {error}
                        </Alert>
                    </Collapse>

                    {/* PIN Verification Form */}
                    {mode === 'pin-verify' && (
                        <Fade in timeout={300}>
                            <Box component="form" onSubmit={handleVerifyPin}>
                                {/* Security Badge */}
                                <Box
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.warning.main, 0.08),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.warning.main, 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    <ShieldRoundedIcon sx={{ color: 'warning.main' }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} color="text.primary">
                                            Admin Access Required
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Enter the secret PIN to create a new account
                                        </Typography>
                                    </Box>
                                </Box>

                                <TextField
                                    label="Secret PIN"
                                    type="password"
                                    value={secretPin}
                                    onChange={handlePinChange}
                                    fullWidth
                                    required
                                    disabled={pinLocked}
                                    placeholder="Enter 6-digit PIN"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <KeyRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                {/* Attempt Indicator */}
                                {pinAttempts > 0 && !pinLocked && (
                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={`${MAX_PIN_ATTEMPTS - pinAttempts} attempts remaining`}
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                        />
                                    </Box>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={pinLocked || secretPin.length < 4}
                                    startIcon={<ShieldRoundedIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                        },
                                    }}
                                >
                                    Verify PIN
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        or
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleBackToLogin}
                                    startIcon={<ArrowBackRoundedIcon />}
                                    sx={{
                                        py: 1.3,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        </Fade>
                    )}

                    {/* Login Form */}
                    {mode === 'login' && (
                        <Fade in timeout={300}>
                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="you@example.com"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2.5 }}
                                />

                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="Enter your password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffRoundedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityRoundedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={saving}
                                    startIcon={!saving && <LoginRoundedIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                        },
                                    }}
                                >
                                    {saving ? 'Signing in...' : 'Sign In'}
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Don't have an account?
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleSwitchToRegister}
                                    startIcon={<PersonAddRoundedIcon />}
                                    sx={{
                                        py: 1.3,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                    }}
                                >
                                    Create Account
                                </Button>
                            </Box>
                        </Fade>
                    )}

                    {/* Register Form (After PIN Verification) */}
                    {mode === 'register' && (
                        <Fade in timeout={300}>
                            <Box component="form" onSubmit={handleSubmit}>
                                {/* Success Badge */}
                                <Box
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.success.main, 0.08),
                                        border: '1px solid',
                                        borderColor: alpha(theme.palette.success.main, 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                    }}
                                >
                                    <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            PIN Verified Successfully
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            You can now create your admin account
                                        </Typography>
                                    </Box>
                                </Box>

                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="Enter your full name"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2.5 }}
                                />

                                <TextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="you@example.com"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2.5 }}
                                />

                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="Min. 6 characters"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffRoundedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityRoundedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2.5 }}
                                />

                                <TextField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="Re-enter password"
                                    error={form.confirmPassword && form.password !== form.confirmPassword}
                                    helperText={
                                        form.confirmPassword && form.password !== form.confirmPassword
                                            ? 'Passwords do not match'
                                            : ''
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRoundedIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showConfirmPassword ? (
                                                        <VisibilityOffRoundedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityRoundedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                {/* Password Requirements */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        Password requirements:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                        <Chip
                                            size="small"
                                            label="6+ characters"
                                            color={form.password.length >= 6 ? 'success' : 'default'}
                                            variant={form.password.length >= 6 ? 'filled' : 'outlined'}
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                        <Chip
                                            size="small"
                                            label="Passwords match"
                                            color={
                                                form.password &&
                                                    form.confirmPassword &&
                                                    form.password === form.confirmPassword
                                                    ? 'success'
                                                    : 'default'
                                            }
                                            variant={
                                                form.password &&
                                                    form.confirmPassword &&
                                                    form.password === form.confirmPassword
                                                    ? 'filled'
                                                    : 'outlined'
                                            }
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={
                                        saving ||
                                        form.password !== form.confirmPassword ||
                                        form.password.length < 6
                                    }
                                    startIcon={!saving && <PersonAddRoundedIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                        },
                                    }}
                                >
                                    {saving ? 'Creating Account...' : 'Create Account'}
                                </Button>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        or
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleBackToLogin}
                                    startIcon={<ArrowBackRoundedIcon />}
                                    sx={{
                                        py: 1.3,
                                        borderRadius: 2,
                                        fontWeight: 500,
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        </Fade>
                    )}

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="caption" color="text.disabled">
                            © 2026 BT POS. All rights reserved.
                        </Typography>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}

export default LoginPage;