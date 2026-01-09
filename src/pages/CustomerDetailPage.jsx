import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    IconButton,
    InputAdornment,
    Chip,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    alpha,
    useTheme,
    Skeleton,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate } from 'react-router-dom';

// Icons
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import api from '../api';

function CustomerDetailPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ amount: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    async function loadData() {
        try {
            setLoading(true);
            const [custRes, ledgerRes] = await Promise.all([
                api.get(`/customers/${id}`),
                api.get(`/customers/${id}/ledger`),
            ]);
            setCustomer(custRes.data);
            setLedger(ledgerRes.data);
        } catch (err) {
            console.error('Error loading customer detail', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [id]);

    function handlePaymentChange(e) {
        const { name, value } = e.target;
        setPaymentForm((f) => ({ ...f, [name]: value }));
    }

    async function handlePaymentSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/customers/${id}/payments`, {
                amount: Number(paymentForm.amount),
                description: paymentForm.description || undefined,
            });
            setPaymentForm({ amount: '', description: '' });
            setOpenPaymentDialog(false);
            await loadData();
        } catch (err) {
            console.error('Error recording payment', err);
            alert(err.response?.data?.message || 'Error recording payment');
        } finally {
            setSubmitting(false);
        }
    }

    // Get initials from name
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    // Format date nicely
    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Calculate totals
    const totalDebit = ledger.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalCredit = ledger.reduce((sum, e) => sum + (e.credit || 0), 0);

    // Loading Skeleton
    if (loading) {
        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="30%" height={32} />
                        <Skeleton variant="text" width="20%" height={20} />
                    </Box>
                </Box>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3].map((i) => (
                        <Grid item size={{xs:12, sm:4}} key={i}>
                            <Skeleton variant="rounded" height={120} />
                        </Grid>
                    ))}
                </Grid>
                <Skeleton variant="rounded" height={400} />
            </Box>
        );
    }

    if (!customer) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Customer not found
                </Typography>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/customers')}
                    sx={{ mt: 2 }}
                >
                    Back to Customers
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/customers')}
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: 'primary.main',
                        },
                    }}
                >
                    Back to Customers
                </Button>

                {/* Customer Profile Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 3,
                        }}
                    >
                        {/* Customer Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    bgcolor: 'primary.main',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                                }}
                            >
                                {getInitials(customer.name)}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    color="text.primary"
                                    gutterBottom
                                >
                                    {customer.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        alignItems: 'center',
                                    }}
                                >
                                    {customer.phone && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <PhoneRoundedIcon
                                                sx={{ fontSize: 18, color: 'text.secondary' }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {customer.phone}
                                            </Typography>
                                        </Box>
                                    )}
                                    {customer.address && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <LocationOnRoundedIcon
                                                sx={{ fontSize: 18, color: 'text.secondary' }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {customer.address}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button
                                variant="contained"
                                startIcon={<PaymentsRoundedIcon />}
                                onClick={() => setOpenPaymentDialog(true)}
                                sx={{
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: 2,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    '&:hover': {
                                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                    },
                                }}
                            >
                                Record Payment
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Current Balance */}
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: customer.balance > 0
                                ? alpha(theme.palette.error.main, 0.3)
                                : customer.balance < 0
                                    ? alpha(theme.palette.success.main, 0.3)
                                    : 'divider',
                            bgcolor: customer.balance > 0
                                ? alpha(theme.palette.error.main, 0.05)
                                : customer.balance < 0
                                    ? alpha(theme.palette.success.main, 0.05)
                                    : 'background.paper',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight={500}
                                    gutterBottom
                                >
                                    Current Balance
                                </Typography>
                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    color={
                                        customer.balance > 0
                                            ? 'error.main'
                                            : customer.balance < 0
                                                ? 'success.main'
                                                : 'text.primary'
                                    }
                                >
                                    Nu. {Math.abs(customer.balance || 0).toFixed(2)}
                                </Typography>
                                <Chip
                                    label={
                                        customer.balance > 0
                                            ? 'To Receive'
                                            : customer.balance < 0
                                                ? 'To Pay'
                                                : 'Settled'
                                    }
                                    size="small"
                                    color={
                                        customer.balance > 0
                                            ? 'error'
                                            : customer.balance < 0
                                                ? 'success'
                                                : 'default'
                                    }
                                    variant="outlined"
                                    sx={{ mt: 1, fontWeight: 500 }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: customer.balance > 0
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : customer.balance < 0
                                            ? alpha(theme.palette.success.main, 0.1)
                                            : alpha(theme.palette.grey[500], 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountBalanceWalletRoundedIcon
                                    sx={{
                                        color: customer.balance > 0
                                            ? 'error.main'
                                            : customer.balance < 0
                                                ? 'success.main'
                                                : 'text.secondary',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Total Debit (Purchases) */}
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: alpha(theme.palette.error.main, 0.3),
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight={500}
                                    gutterBottom
                                >
                                    Total Purchases
                                </Typography>
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    Nu. {totalDebit.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {ledger.filter(e => e.debit > 0).length} transactions
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingUpRoundedIcon sx={{ color: 'error.main' }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Total Credit (Payments) */}
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                borderColor: alpha(theme.palette.success.main, 0.3),
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight={500}
                                    gutterBottom
                                >
                                    Total Payments
                                </Typography>
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    Nu. {totalCredit.toFixed(2)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {ledger.filter(e => e.credit > 0).length} transactions
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingDownRoundedIcon sx={{ color: 'success.main' }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Ledger Section */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                {/* Section Header */}
                <Box
                    sx={{
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <HistoryRoundedIcon sx={{ color: 'primary.main' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Transaction History
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {ledger.length} total entries
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Table */}
                {ledger.length === 0 ? (
                    // Empty State
                    <Box
                        sx={{
                            py: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ReceiptLongRoundedIcon
                                sx={{ fontSize: 40, color: 'primary.main' }}
                            />
                        </Box>
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                            No transactions yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            This customer's transaction history will appear here
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Debit</TableCell>
                                    <TableCell align="right">Credit</TableCell>
                                    <TableCell align="right">Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ledger.map((entry, index) => (
                                    <Fade in timeout={300 + index * 50} key={entry._id}>
                                        <TableRow
                                            hover
                                            sx={{
                                                '&:last-child td': { border: 0 },
                                            }}
                                        >
                                            {/* Date & Time */}
                                            <TableCell>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        color="text.primary"
                                                    >
                                                        {formatDate(entry.date)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTime(entry.date)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Description */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 1.5,
                                                            bgcolor: entry.debit > 0
                                                                ? alpha(theme.palette.error.main, 0.1)
                                                                : alpha(theme.palette.success.main, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        {entry.debit > 0 ? (
                                                            <ReceiptLongRoundedIcon
                                                                sx={{ fontSize: 18, color: 'error.main' }}
                                                            />
                                                        ) : (
                                                            <CreditCardRoundedIcon
                                                                sx={{ fontSize: 18, color: 'success.main' }}
                                                            />
                                                        )}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {entry.description || (entry.debit > 0 ? 'Purchase' : 'Payment')}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {entry.debit > 0 ? 'Invoice' : 'Payment Received'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Debit */}
                                            <TableCell align="right">
                                                {entry.debit > 0 ? (
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color="error.main"
                                                    >
                                                        + Nu. {entry.debit.toFixed(2)}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.disabled">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Credit */}
                                            <TableCell align="right">
                                                {entry.credit > 0 ? (
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color="success.main"
                                                    >
                                                        - Nu. {entry.credit.toFixed(2)}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body2" color="text.disabled">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            {/* Balance After */}
                                            <TableCell align="right">
                                                <Chip
                                                    label={`Nu. ${Math.abs(entry.balanceAfter || 0).toFixed(2)}`}
                                                    size="small"
                                                    variant="outlined"
                                                    color={
                                                        entry.balanceAfter > 0
                                                            ? 'error'
                                                            : entry.balanceAfter < 0
                                                                ? 'success'
                                                                : 'default'
                                                    }
                                                    sx={{ fontWeight: 600, minWidth: 80 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Record Payment Dialog */}
            <Dialog
                open={openPaymentDialog}
                onClose={() => setOpenPaymentDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PaymentsRoundedIcon sx={{ color: 'success.main' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Record Payment
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                for {customer.name}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setOpenPaymentDialog(false)} size="small">
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handlePaymentSubmit}>
                    <DialogContent sx={{ pt: 2 }}>
                        {/* Current Balance Info */}
                        <Box
                            sx={{
                                p: 2,
                                mb: 3,
                                borderRadius: 2,
                                bgcolor: customer.balance > 0
                                    ? alpha(theme.palette.error.main, 0.08)
                                    : alpha(theme.palette.success.main, 0.08),
                                border: '1px solid',
                                borderColor: customer.balance > 0
                                    ? alpha(theme.palette.error.main, 0.2)
                                    : alpha(theme.palette.success.main, 0.2),
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Current Outstanding
                            </Typography>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color={customer.balance > 0 ? 'error.main' : 'success.main'}
                            >
                                Nu. {Math.abs(customer.balance || 0).toFixed(2)}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1 }}
                                >
                                    {customer.balance > 0 ? 'to receive' : 'to pay'}
                                </Typography>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Payment Amount"
                                name="amount"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                value={paymentForm.amount}
                                onChange={handlePaymentChange}
                                fullWidth
                                required
                                placeholder="0.00"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography color="text.secondary" fontWeight={500}>
                                                Nu. 
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Description (Optional)"
                                name="description"
                                value={paymentForm.description}
                                onChange={handlePaymentChange}
                                fullWidth
                                placeholder="e.g., Cash payment, Bank transfer..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                        <Button
                            onClick={() => setOpenPaymentDialog(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || !paymentForm.amount}
                            color="success"
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: `0 4px 14px ${alpha(theme.palette.success.main, 0.4)}`,
                            }}
                        >
                            {submitting ? 'Saving...' : 'Save Payment'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default CustomerDetailPage;