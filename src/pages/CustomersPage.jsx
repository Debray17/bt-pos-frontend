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
    Link,
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';

// Icons
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import api from '../api';

function CustomersPage() {
    const theme = useTheme();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [submitting, setSubmitting] = useState(false);

    async function loadCustomers() {
        try {
            setLoading(true);
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error('Error loading customers', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/customers', form);
            setForm({ name: '', phone: '', address: '' });
            setOpenDialog(false);
            loadCustomers();
        } catch (err) {
            console.error('Error creating customer', err);
            alert(err.response?.data?.message || 'Error creating customer');
        } finally {
            setSubmitting(false);
        }
    }

    // Filter customers based on search
    const filteredCustomers = customers.filter(
        (c) =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const totalCustomers = customers.length;
    const totalCredit = customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
    const totalDebit = customers.reduce((sum, c) => sum + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);

    // Stat Card Component
    const StatCard = ({ icon, label, value, color, bgColor }) => (
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
            </Box>
        </Paper>
    );

    // Get initials from name
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    // Get color based on balance
    const getBalanceColor = (balance) => {
        if (balance > 0) return 'error';
        if (balance < 0) return 'success';
        return 'default';
    };

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
                        Customers
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your customer database and track balances
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<PersonAddRoundedIcon />}
                    onClick={() => setOpenDialog(true)}
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
                    Add Customer
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12, sm:6, md:4}}> 
                    <StatCard
                        icon={<PeopleAltRoundedIcon />}
                        label="Total Customers"
                        value={totalCustomers}
                        color={theme.palette.primary.main}
                        bgColor={alpha(theme.palette.primary.main, 0.1)}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        label="Total Receivable"
                        value={`Nu. ${totalCredit.toFixed(2)}`}
                        color={theme.palette.error.main}
                        bgColor={alpha(theme.palette.error.main, 0.1)}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <StatCard
                        icon={<TrendingDownRoundedIcon />}
                        label="Total Payable"
                        value={`Nu. ${totalDebit.toFixed(2)}`}
                        color={theme.palette.success.main}
                        bgColor={alpha(theme.palette.success.main, 0.1)}
                    />
                </Grid>
            </Grid>

            {/* Customer List Section */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                }}
            >
                {/* Search Bar */}
                <Box
                    sx={{
                        p: 2.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                    }}
                >
                    <TextField
                        placeholder="Search customers by name, phone, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            maxWidth: 400,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper',
                            },
                        }}
                    />
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
                                <Skeleton variant="circular" width={44} height={44} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Box>
                                <Skeleton variant="rounded" width={80} height={32} />
                            </Box>
                        ))}
                    </Box>
                ) : filteredCustomers.length === 0 ? (
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
                            <GroupsRoundedIcon
                                sx={{ fontSize: 40, color: 'primary.main' }}
                            />
                        </Box>
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                            {searchQuery ? 'No customers found' : 'No customers yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Add your first customer to get started'}
                        </Typography>
                        {!searchQuery && (
                            <Button
                                variant="outlined"
                                startIcon={<AddRoundedIcon />}
                                onClick={() => setOpenDialog(true)}
                                sx={{ mt: 1 }}
                            >
                                Add Customer
                            </Button>
                        )}
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell align="right">Balance</TableCell>
                                    <TableCell align="center" width={60}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers.map((c, index) => (
                                    <Fade in timeout={300 + index * 50} key={c._id}>
                                        <TableRow
                                            hover
                                            sx={{
                                                cursor: 'pointer',
                                                '&:last-child td': { border: 0 },
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: 'primary.main',
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        {getInitials(c.name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Link
                                                            component={RouterLink}
                                                            to={`/customers/${c._id}`}
                                                            underline="none"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'text.primary',
                                                                '&:hover': {
                                                                    color: 'primary.main',
                                                                },
                                                            }}
                                                        >
                                                            {c.name}
                                                        </Link>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ display: 'block' }}
                                                        >
                                                            Customer ID: {c._id?.slice(-6).toUpperCase()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneRoundedIcon
                                                        sx={{ fontSize: 18, color: 'text.secondary' }}
                                                    />
                                                    <Typography variant="body2">
                                                        {c.phone || '—'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnRoundedIcon
                                                        sx={{ fontSize: 18, color: 'text.secondary' }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {c.address || '—'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`Nu. ${Math.abs(c.balance || 0).toFixed(2)}`}
                                                    size="small"
                                                    color={getBalanceColor(c.balance)}
                                                    variant={c.balance === 0 ? 'outlined' : 'filled'}
                                                    sx={{
                                                        fontWeight: 600,
                                                        minWidth: 80,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        component={RouterLink}
                                                        to={`/customers/${c._id}`}
                                                        size="small"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            '&:hover': {
                                                                color: 'primary.main',
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            },
                                                        }}
                                                    >
                                                        <ArrowForwardRoundedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Add Customer Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
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
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <PersonAddRoundedIcon sx={{ color: 'primary.main' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Add New Customer
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Enter customer details below
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setOpenDialog(false)} size="small">
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Customer Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="Enter full name"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Phone Number"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Enter phone number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                fullWidth
                                placeholder="Enter address"
                                multiline
                                rows={2}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                            <LocationOnRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || !form.name}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            {submitting ? 'Adding...' : 'Add Customer'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default CustomersPage;