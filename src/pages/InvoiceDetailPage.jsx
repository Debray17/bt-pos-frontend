import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    Skeleton,
    alpha,
    useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

// Icons
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';

import api from '../api';

function InvoiceDetailPage() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const printRef = useRef();

    const [invoice, setInvoice] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInvoice() {
            try {
                setLoading(true);
                const res = await api.get(`/invoices/${id}`);
                setInvoice(res.data);

                // Load customer details if customerId exists
                if (res.data.customerId) {
                    try {
                        const customerRes = await api.get(`/customers/${res.data.customerId}`);
                        setCustomer(customerRes.data);
                    } catch (err) {
                        console.log('Customer not found');
                    }
                }
            } catch (err) {
                console.error('Error loading invoice', err);
            } finally {
                setLoading(false);
            }
        }
        loadInvoice();
    }, [id]);

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Get initials
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Print handler
    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    // Loading State
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
                <Skeleton variant="rounded" height={500} sx={{ borderRadius: 3 }} />
            </Box>
        );
    }

    if (!invoice) {
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
                <ReceiptLongRoundedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.primary" gutterBottom>
                    Invoice not found
                </Typography>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/invoices')}
                    sx={{ mt: 2 }}
                >
                    Back to Invoices
                </Button>
            </Box>
        );
    }

    const subtotal = invoice.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
    const totalItems = invoice.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate('/invoices')}
                    sx={{
                        mb: 2,
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: 'primary.main',
                        },
                    }}
                >
                    Back to Invoices
                </Button>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            <ReceiptLongRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="h4" fontWeight={700} color="text.primary">
                                    Invoice #{invoice.invoiceNumber}
                                </Typography>
                                {invoice.isCredit ? (
                                    <Chip
                                        icon={<CreditCardRoundedIcon sx={{ fontSize: 16 }} />}
                                        label="Credit"
                                        size="small"
                                        color="warning"
                                        sx={{ fontWeight: 600 }}
                                    />
                                ) : (
                                    <Chip
                                        icon={<PaidRoundedIcon sx={{ fontSize: 16 }} />}
                                        label="Paid"
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: 600 }}
                                    />
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Created on {formatDate(invoice.date)} at {formatTime(invoice.date)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Tooltip title="Share">
                            <IconButton
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                }}
                            >
                                <ShareRoundedIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadRoundedIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Download
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PrintRoundedIcon />}
                            onClick={handlePrint}
                            sx={{
                                borderRadius: 2,
                                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            Print
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Invoice Content */}
            <Paper
                ref={printRef}
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                {/* Invoice Header */}
                <Box
                    sx={{
                        p: 4,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Grid container spacing={4}>
                        {/* From - Shop Details */}
                        <Grid item size={{xs:12, md:6}}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <StorefrontRoundedIcon sx={{ color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        BT POS
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Your Trusted Store
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Chubachu, Thimphu
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Phone: +975 1711512
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: gyan@gmail.com
                            </Typography>
                        </Grid>

                        {/* To - Customer Details */}
                        <Grid item size={{xs:12, md:6}}>
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    color="text.secondary"
                                    fontWeight={600}
                                    sx={{ mb: 1.5, display: 'block' }}
                                >
                                    Bill To
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                                    <Avatar
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {getInitials(invoice.customerName)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            {invoice.customerName || 'Walk-in Customer'}
                                        </Typography>
                                        {customer && (
                                            <Chip
                                                label={`Balance: Nu. ${customer.balance?.toFixed(2) || '0.00'}`}
                                                size="small"
                                                color={customer.balance > 0 ? 'warning' : 'success'}
                                                variant="outlined"
                                                sx={{ height: 22, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                {customer && (
                                    <>
                                        {customer.phone && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <PhoneRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {customer.phone}
                                                </Typography>
                                            </Box>
                                        )}
                                        {customer.address && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOnRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {customer.address}
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}

                                {!customer && !invoice.customerId && (
                                    <Typography variant="body2" color="text.secondary">
                                        No customer details available
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Invoice Details Bar */}
                <Box
                    sx={{
                        px: 4,
                        py: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                    }}
                >
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Invoice Number
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                            #{invoice.invoiceNumber}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Invoice Date
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {formatDate(invoice.date)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Invoice Time
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {formatTime(invoice.date)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Payment Status
                        </Typography>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={invoice.isCredit ? 'warning.main' : 'success.main'}
                        >
                            {invoice.isCredit ? 'Credit (Unpaid)' : 'Paid'}
                        </Typography>
                    </Box>
                </Box>

                {/* Items Table */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>
                                    Quantity
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Unit Price
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>
                                    Amount
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items?.map((item, index) => (
                                <TableRow key={item.productId || index} hover>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {index + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                {item.productName?.charAt(0) || 'P'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {item.productName || 'Product'}
                                                </Typography>
                                                {item.productId && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {item.productId.slice(-6).toUpperCase()}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`× ${item.quantity}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 600, minWidth: 50 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">
                                            Nu. {item.price?.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={700}>
                                            Nu. {(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Summary Section */}
                <Box sx={{ p: 4 }}>
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.grey[500], 0.04),
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                {/* Subtotal */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Subtotal ({totalItems} items)
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        Nu. {subtotal.toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Tax (if any) */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1.5,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Tax
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        Nu. 0.00
                                    </Typography>
                                </Box>

                                {/* Discount (if any) */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        Discount
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500} color="success.main">
                                        - Nu. 0.00
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Total */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600}>
                                        Total
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} color="primary.main">
                                        Nu. {invoice.total?.toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Payment Status */}
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 1.5,
                                        borderRadius: 1.5,
                                        bgcolor: invoice.isCredit
                                            ? alpha(theme.palette.warning.main, 0.1)
                                            : alpha(theme.palette.success.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                    }}
                                >
                                    {invoice.isCredit ? (
                                        <>
                                            <CreditCardRoundedIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                                            <Typography variant="body2" fontWeight={600} color="warning.main">
                                                Added to Customer Credit
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleRoundedIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                            <Typography variant="body2" fontWeight={600} color="success.main">
                                                Payment Received
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Thank you for your business!
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        This is a computer-generated invoice and does not require a signature.
                    </Typography>
                </Box>
            </Paper>

            {/* Customer Link (if exists) */}
            {customer && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        component={RouterLink}
                        to={`/customers/${customer._id}`}
                        variant="outlined"
                        startIcon={<PersonRoundedIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        View Customer Details
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default InvoiceDetailPage;