import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Fade,
    Skeleton,
    LinearProgress,
    alpha,
    useTheme,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';

import api from '../api';

function Dashboard() {
    const theme = useTheme();
    const [summary, setSummary] = useState(null);
    const [lowStock, setLowStock] = useState([]);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function loadData() {
        try {
            const [summaryRes, lowStockRes, invoicesRes, customersRes] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/low-stock'),
                api.get('/invoices'),
                api.get('/customers'),
            ]);
            setSummary(summaryRes.data);
            setLowStock(lowStockRes.data);
            // Get last 5 invoices
            setRecentInvoices(invoicesRes.data.slice(0, 5));
            // Get top customers by balance
            const sorted = [...customersRes.data]
                .filter((c) => c.balance > 0)
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5);
            setTopCustomers(sorted);
        } catch (err) {
            console.error('Error loading dashboard', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
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

    // Stat Card Component
    const StatCard = ({ icon, title, value, subtitle, color, bgGradient, trend, trendValue }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${alpha(color, 0.2)}`,
                    borderColor: alpha(color, 0.3),
                },
            }}
        >
            {/* Background Gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: bgGradient,
                    opacity: 0.1,
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ zIndex: 1 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ mb: 0.5 }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {subtitle}
                        </Typography>
                    )}
                    {trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            {trend === 'up' ? (
                                <TrendingUpRoundedIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            ) : (
                                <TrendingDownRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                            )}
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                color={trend === 'up' ? 'success.main' : 'error.main'}
                            >
                                {trendValue}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                vs yesterday
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 24px ${alpha(color, 0.3)}`,
                    }}
                >
                    {React.cloneElement(icon, { sx: { color: 'white', fontSize: 28 } })}
                </Box>
            </Box>
        </Paper>
    );

    // Quick Action Button
    const QuickAction = ({ icon, label, to, color }) => (
        <Button
            component={RouterLink}
            to={to}
            variant="outlined"
            startIcon={icon}
            fullWidth
            sx={{
                py: 2,
                px: 2.5,
                borderRadius: 2,
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'divider',
                color: 'text.primary',
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: color,
                    bgcolor: alpha(color, 0.05),
                    color: color,
                    transform: 'translateX(4px)',
                },
            }}
        >
            {label}
        </Button>
    );

    // Loading State
    if (loading) {
        return (
            <Box>
                {/* Header Skeleton */}
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width="40%" height={40} />
                    <Skeleton variant="text" width="30%" height={24} />
                </Box>

                {/* Stats Skeleton */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item size={{xs:12, sm:6, md:3}} key={i}>
                            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>

                {/* Content Skeleton */}
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!summary) {
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
                <ErrorOutlineRoundedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" color="text.primary" gutterBottom>
                    Error loading dashboard
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={handleRefresh}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Welcome Header */}
            <Box
                sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            {getGreeting()}!
                        </Typography>
                        <WavingHandRoundedIcon sx={{ color: '#f9a825', fontSize: 32 }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your shop today
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Date & Time */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: 2,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CalendarTodayRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            <Typography variant="body2" fontWeight={500}>
                                {new Date().toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Refresh Button */}
                    <Tooltip title="Refresh data">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                },
                            }}
                        >
                            <RefreshRoundedIcon
                                sx={{
                                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                    },
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<LocalAtmRoundedIcon />}
                        title="Sales Today"
                        value={`Nu. ${summary.totalSalesToday?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`}
                        subtitle="Total revenue today"
                        color={theme.palette.success.main}
                        bgGradient={`linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`}
                        trend="up"
                        trendValue="+12%"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<ReceiptLongRoundedIcon />}
                        title="Invoices Today"
                        value={summary.invoiceCountToday || 0}
                        subtitle="Orders processed"
                        color={theme.palette.primary.main}
                        bgGradient={`linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<WarningAmberRoundedIcon />}
                        title="Low Stock"
                        value={summary.lowStockCount || 0}
                        subtitle={summary.lowStockCount > 0 ? 'Need attention' : 'All stocked'}
                        color={summary.lowStockCount > 0 ? theme.palette.warning.main : theme.palette.success.main}
                        bgGradient={
                            summary.lowStockCount > 0
                                ? `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
                                : `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                        }
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<AccountBalanceWalletRoundedIcon />}
                        title="Outstanding Credit"
                        value={`Nu. ${summary.outstandingTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}`}
                        subtitle="Total receivables"
                        color={theme.palette.error.main}
                        bgGradient={`linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`}
                    />
                </Grid>
            </Grid>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item size={{xs:12, lg:8}}>
                    {/* Low Stock Products */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                            mb: 3,
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                p: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: lowStock.length > 0
                                    ? alpha(theme.palette.warning.main, 0.05)
                                    : alpha(theme.palette.success.main, 0.03),
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: lowStock.length > 0
                                            ? alpha(theme.palette.warning.main, 0.1)
                                            : alpha(theme.palette.success.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {lowStock.length > 0 ? (
                                        <WarningAmberRoundedIcon sx={{ color: 'warning.main' }} />
                                    ) : (
                                        <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        Low Stock Alert
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {lowStock.length > 0
                                            ? `${lowStock.length} products need restocking`
                                            : 'All products are well stocked'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                component={RouterLink}
                                to="/products"
                                variant="text"
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{ fontWeight: 500 }}
                            >
                                View All
                            </Button>
                        </Box>

                        {/* Table */}
                        {lowStock.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'success.main' }} />
                                <Typography variant="body1" fontWeight={500} color="text.primary">
                                    All products are stocked!
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    No products below minimum stock level
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Current Stock</TableCell>
                                            <TableCell align="center">Min Stock</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lowStock.slice(0, 5).map((product, index) => {
                                            const stockPercentage = (product.stock / product.minStock) * 100;
                                            const isOutOfStock = product.stock === 0;

                                            return (
                                                <Fade in timeout={300 + index * 50} key={product._id}>
                                                    <TableRow
                                                        hover
                                                        sx={{ '&:last-child td': { border: 0 } }}
                                                    >
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 40,
                                                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                                        color: 'warning.main',
                                                                        fontWeight: 600,
                                                                        fontSize: '0.9rem',
                                                                    }}
                                                                >
                                                                    {product.name?.charAt(0)}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight={600}>
                                                                        {product.name}
                                                                    </Typography>
                                                                    {product.sku && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            SKU: {product.sku}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={700}
                                                                color={isOutOfStock ? 'error.main' : 'warning.main'}
                                                            >
                                                                {product.stock}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body2" color="text.secondary">
                                                                {product.minStock}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                                                                size="small"
                                                                color={isOutOfStock ? 'error' : 'warning'}
                                                                sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </Fade>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>

                    {/* Recent Invoices */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
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
                                    <ReceiptLongRoundedIcon sx={{ color: 'primary.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        Recent Invoices
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Latest transactions
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                component={RouterLink}
                                to="/invoices"
                                variant="text"
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{ fontWeight: 500 }}
                            >
                                View All
                            </Button>
                        </Box>

                        {/* Table */}
                        {recentInvoices.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <ReceiptLongRoundedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                <Typography variant="body1" fontWeight={500} color="text.primary">
                                    No invoices yet
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/invoices/new"
                                    variant="outlined"
                                    startIcon={<AddRoundedIcon />}
                                    sx={{ mt: 1 }}
                                >
                                    Create Invoice
                                </Button>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Invoice</TableCell>
                                            <TableCell>Customer</TableCell>
                                            <TableCell align="center">Type</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentInvoices.map((inv, index) => (
                                            <Fade in timeout={300 + index * 50} key={inv._id}>
                                                <TableRow
                                                    hover
                                                    sx={{ '&:last-child td': { border: 0 } }}
                                                >
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                #{inv.invoiceNumber}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(inv.date)} • {formatTime(inv.date)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                                    color: 'secondary.main',
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {getInitials(inv.customerName)}
                                                            </Avatar>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {inv.customerName || 'Walk-in'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {inv.isCredit ? (
                                                            <Chip
                                                                icon={<CreditCardRoundedIcon sx={{ fontSize: 14 }} />}
                                                                label="Credit"
                                                                size="small"
                                                                color="warning"
                                                                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 500 }}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                icon={<CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
                                                                label="Paid"
                                                                size="small"
                                                                color="success"
                                                                variant="outlined"
                                                                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 500 }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={700}>
                                                            Nu. {inv.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </Fade>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>

                {/* Right Column */}
                <Grid item size={{xs:12, lg:4}}>
                    {/* Quick Actions */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            mb: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5 }}>
                            Quick Actions
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <QuickAction
                                icon={<AddRoundedIcon />}
                                label="New Invoice"
                                to="/invoices/new"
                                color={theme.palette.primary.main}
                            />
                            <QuickAction
                                icon={<InventoryRoundedIcon />}
                                label="Add Product"
                                to="/products"
                                color={theme.palette.success.main}
                            />
                            <QuickAction
                                icon={<PersonAddRoundedIcon />}
                                label="Add Customer"
                                to="/customers"
                                color={theme.palette.info.main}
                            />
                            <QuickAction
                                icon={<ReceiptLongRoundedIcon />}
                                label="View Invoices"
                                to="/invoices"
                                color={theme.palette.warning.main}
                            />
                        </Box>
                    </Paper>

                    {/* Top Customers (Outstanding) */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                p: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                bgcolor: alpha(theme.palette.error.main, 0.03),
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <PeopleAltRoundedIcon sx={{ color: 'error.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Top Debtors
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Highest outstanding
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* List */}
                        {topCustomers.length === 0 ? (
                            <Box
                                sx={{
                                    py: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <CheckCircleRoundedIcon sx={{ fontSize: 40, color: 'success.main' }} />
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    No outstanding credits
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2 }}>
                                {topCustomers.map((customer, index) => (
                                    <Box
                                        key={customer._id}
                                        component={RouterLink}
                                        to={`/customers/${customer._id}`}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 1.5,
                                            borderRadius: 2,
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            },
                                            '&:not(:last-child)': {
                                                mb: 1,
                                            },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 1,
                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'error.main',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {getInitials(customer.name)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {customer.name}
                                                </Typography>
                                                {customer.phone && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {customer.phone}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={`Nu. ${customer.balance.toLocaleString('en-IN')}`}
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Box>
                                ))}

                                <Button
                                    component={RouterLink}
                                    to="/customers"
                                    fullWidth
                                    variant="text"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    sx={{ mt: 1, fontWeight: 500 }}
                                >
                                    View All Customers
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* Store Summary Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background Pattern */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -40,
                                right: -40,
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                bgcolor: alpha('#fff', 0.1),
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -30,
                                left: -30,
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha('#fff', 0.05),
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <StorefrontRoundedIcon sx={{ fontSize: 28 }} />
                                <Typography variant="h6" fontWeight={600}>
                                    BT POS
                                </Typography>
                            </Box>

                            <Divider sx={{ borderColor: alpha('#fff', 0.2), my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Products
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {summary.totalProducts || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Customers
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {summary.totalCustomers || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Invoices
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {summary.totalInvoices || 0}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;