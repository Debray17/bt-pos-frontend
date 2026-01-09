import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Button,
    Box,
    TextField,
    InputAdornment,
    Chip,
    Avatar,
    IconButton,
    Fade,
    alpha,
    useTheme,
    Skeleton,
    ToggleButton,
    ToggleButtonGroup,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';

import api from '../api';

function InvoicesPage() {
    const theme = useTheme();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'paid'
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuInvoice, setMenuInvoice] = useState(null);

    async function loadInvoices() {
        setLoading(true);
        try {
            const res = await api.get('/invoices');
            setInvoices(res.data);
        } catch (err) {
            console.error('Error loading invoices', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadInvoices();
    }, []);

    function handleMenuOpen(event, invoice) {
        setAnchorEl(event.currentTarget);
        setMenuInvoice(invoice);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        setMenuInvoice(null);
    }

    // Filter invoices
    const filteredInvoices = invoices.filter((inv) => {
        const matchesSearch =
            inv.invoiceNumber?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterType === 'all' ||
            (filterType === 'credit' && inv.isCredit) ||
            (filterType === 'paid' && !inv.isCredit);

        return matchesSearch && matchesFilter;
    });

    // Calculate stats
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const creditSales = invoices.filter((inv) => inv.isCredit);
    const totalCreditAmount = creditSales.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const paidSales = invoices.filter((inv) => !inv.isCredit);

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

    // Get initials from name
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
    const StatCard = ({ icon, label, value, subtitle, color, bgColor }) => (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                    borderColor: color,
                    boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
                },
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {label}
                </Typography>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Paper>
    );

    return (
        <Box>
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 4,
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color="text.primary"
                        gutterBottom
                    >
                        Invoices
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and track all your sales invoices
                    </Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/invoices/new"
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
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
                    New Invoice
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<ReceiptLongRoundedIcon />}
                        label="Total Invoices"
                        value={totalInvoices}
                        subtitle={`${filteredInvoices.length} shown`}
                        color={theme.palette.primary.main}
                        bgColor={alpha(theme.palette.primary.main, 0.1)}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        label="Total Revenue"
                        value={`Nu. ${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                        color={theme.palette.success.main}
                        bgColor={alpha(theme.palette.success.main, 0.1)}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<CreditCardRoundedIcon />}
                        label="Credit Sales"
                        value={creditSales.length}
                        subtitle={`Nu. ${totalCreditAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                        color={theme.palette.warning.main}
                        bgColor={alpha(theme.palette.warning.main, 0.1)}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        icon={<PaidRoundedIcon />}
                        label="Paid Sales"
                        value={paidSales.length}
                        subtitle="Completed"
                        color={theme.palette.info.main}
                        bgColor={alpha(theme.palette.info.main, 0.1)}
                    />
                </Grid>
            </Grid>

            {/* Invoice List Section */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                {/* Search & Filter Bar */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        placeholder="Search by invoice # or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            minWidth: { sm: 320 },
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper',
                            },
                        }}
                    />

                    <ToggleButtonGroup
                        value={filterType}
                        exclusive
                        onChange={(e, value) => value && setFilterType(value)}
                        size="small"
                        sx={{
                            bgcolor: 'background.paper',
                            '& .MuiToggleButton-root': {
                                px: 2,
                                py: 0.75,
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&.Mui-selected': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                                    },
                                },
                            },
                        }}
                    >
                        <ToggleButton value="all">
                            All ({invoices.length})
                        </ToggleButton>
                        <ToggleButton value="credit">
                            Credit ({creditSales.length})
                        </ToggleButton>
                        <ToggleButton value="paid">
                            Paid ({paidSales.length})
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Table */}
                {loading ? (
                    // Loading Skeleton
                    <Box sx={{ p: 3 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Skeleton variant="rounded" width={44} height={44} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="30%" height={24} />
                                    <Skeleton variant="text" width="20%" height={20} />
                                </Box>
                                <Skeleton variant="rounded" width={80} height={28} />
                                <Skeleton variant="rounded" width={80} height={28} />
                                <Skeleton variant="circular" width={32} height={32} />
                            </Box>
                        ))}
                    </Box>
                ) : filteredInvoices.length === 0 ? (
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
                            {searchQuery || filterType !== 'all'
                                ? 'No invoices found'
                                : 'No invoices yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {searchQuery || filterType !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Create your first invoice to get started'}
                        </Typography>
                        {!searchQuery && filterType === 'all' && (
                            <Button
                                component={RouterLink}
                                to="/invoices/new"
                                variant="outlined"
                                startIcon={<AddRoundedIcon />}
                                sx={{ mt: 1 }}
                            >
                                Create Invoice
                            </Button>
                        )}
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell align="center">Items</TableCell>
                                    <TableCell align="center">Type</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="center" width={60}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInvoices.map((inv, index) => (
                                    <Fade in timeout={300 + index * 50} key={inv._id}>
                                        <TableRow
                                            hover
                                            sx={{
                                                '&:last-child td': { border: 0 },
                                            }}
                                        >
                                            {/* Invoice Number */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            borderRadius: 2,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <ReceiptLongRoundedIcon
                                                            sx={{ color: 'primary.main', fontSize: 22 }}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            color="text.primary"
                                                        >
                                                            #{inv.invoiceNumber}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {inv._id?.slice(-6).toUpperCase()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Date */}
                                            <TableCell>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        color="text.primary"
                                                    >
                                                        {formatDate(inv.date)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatTime(inv.date)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Customer */}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                            color: 'secondary.main',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {getInitials(inv.customerName)}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {inv.customerName || 'Walk-in Customer'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Items Count */}
                                            <TableCell align="center">
                                                <Chip
                                                    icon={<LocalMallRoundedIcon sx={{ fontSize: 16 }} />}
                                                    label={`${inv.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} items`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem',
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Credit/Paid Status */}
                                            <TableCell align="center">
                                                {inv.isCredit ? (
                                                    <Chip
                                                        icon={<CreditCardRoundedIcon sx={{ fontSize: 16 }} />}
                                                        label="Credit"
                                                        size="small"
                                                        color="warning"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<PaidRoundedIcon sx={{ fontSize: 16 }} />}
                                                        label="Paid"
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                )}
                                            </TableCell>

                                            {/* Total */}
                                            <TableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    color="text.primary"
                                                    sx={{ fontSize: '0.95rem' }}
                                                >
                                                    Nu. {inv.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </Typography>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleMenuOpen(e, inv)}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        },
                                                    }}
                                                >
                                                    <MoreVertRoundedIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Summary Footer */}
                {filteredInvoices.length > 0 && (
                    <Box
                        sx={{
                            p: 2.5,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: alpha(theme.palette.success.main, 0.03),
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Showing {filteredInvoices.length} of {invoices.length} invoices
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total:
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="success.main">
                                Nu. {filteredInvoices
                                    .reduce((sum, inv) => sum + (inv.total || 0), 0)
                                    .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <MenuItem
                    component={RouterLink}
                    to={`/invoices/${menuInvoice?._id}`}
                    onClick={handleMenuClose}
                    sx={{ gap: 1.5 }}
                >
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <VisibilityRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <PrintRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Print Invoice</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <DownloadRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default InvoicesPage;