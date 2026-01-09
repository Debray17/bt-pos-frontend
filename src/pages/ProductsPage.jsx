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
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import api from '../api';

function ProductsPage() {
    const theme = useTheme();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuProduct, setMenuProduct] = useState(null);

    const [form, setForm] = useState({
        name: '',
        sku: '',
        salePrice: '',
        stock: '',
        minStock: '',
    });

    async function loadProducts() {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Error loading products', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    function openAddDialog() {
        setEditing(null);
        setForm({
            name: '',
            sku: '',
            salePrice: '',
            stock: '',
            minStock: '',
        });
        setOpenDialog(true);
    }

    function startEdit(product) {
        setEditing(product);
        setForm({
            name: product.name || '',
            sku: product.sku || '',
            salePrice: product.salePrice ?? '',
            stock: product.stock ?? '',
            minStock: product.minStock ?? '',
        });
        setOpenDialog(true);
        handleMenuClose();
    }

    function closeDialog() {
        setOpenDialog(false);
        setEditing(null);
        setForm({
            name: '',
            sku: '',
            salePrice: '',
            stock: '',
            minStock: '',
        });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: form.name,
            sku: form.sku || undefined,
            salePrice: Number(form.salePrice),
            stock: form.stock === '' ? 0 : Number(form.stock),
            minStock: form.minStock === '' ? 0 : Number(form.minStock),
        };

        try {
            if (editing) {
                await api.put(`/products/${editing._id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            await loadProducts();
            closeDialog();
        } catch (err) {
            console.error('Error saving product', err);
            alert(err.response?.data?.message || 'Error saving product');
        } finally {
            setSubmitting(false);
        }
    }

    function confirmDelete(product) {
        setDeleteTarget(product);
        setOpenDeleteDialog(true);
        handleMenuClose();
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            await api.delete(`/products/${deleteTarget._id}`);
            await loadProducts();
            setOpenDeleteDialog(false);
            setDeleteTarget(null);
        } catch (err) {
            console.error('Error deleting product', err);
        }
    }

    function handleMenuOpen(event, product) {
        setAnchorEl(event.currentTarget);
        setMenuProduct(product);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        setMenuProduct(null);
    }

    // Filter products based on search
    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock <= p.minStock).length;
    const totalValue = products.reduce((sum, p) => sum + p.salePrice * p.stock, 0);

    // Get stock status
    const getStockStatus = (product) => {
        if (product.stock === 0) return 'out';
        if (product.stock <= product.minStock) return 'low';
        return 'good';
    };

    // Stat Card Component
    const StatCard = ({ icon, label, value, color, bgColor, subtitle }) => (
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
                        Products
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your inventory and product catalog
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={openAddDialog}
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
                    Add Product
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <StatCard
                        icon={<InventoryRoundedIcon />}
                        label="Total Products"
                        value={totalProducts}
                        color={theme.palette.primary.main}
                        bgColor={alpha(theme.palette.primary.main, 0.1)}
                        subtitle={`${filteredProducts.length} shown`}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <StatCard
                        icon={<WarningAmberRoundedIcon />}
                        label="Low Stock Alert"
                        value={lowStockProducts}
                        color={lowStockProducts > 0 ? theme.palette.warning.main : theme.palette.success.main}
                        bgColor={alpha(lowStockProducts > 0 ? theme.palette.warning.main : theme.palette.success.main, 0.1)}
                        subtitle={lowStockProducts > 0 ? 'Need attention' : 'All stocked'}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:4}}>
                    <StatCard
                        icon={<TrendingUpRoundedIcon />}
                        label="Inventory Value"
                        value={`Nu. ${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        color={theme.palette.success.main}
                        bgColor={alpha(theme.palette.success.main, 0.1)}
                    />
                </Grid>
            </Grid>

            {/* Product List Section */}
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
                        placeholder="Search products by name or SKU..."
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
                                <Skeleton variant="rounded" width={44} height={44} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="40%" height={24} />
                                    <Skeleton variant="text" width="20%" height={20} />
                                </Box>
                                <Skeleton variant="rounded" width={60} height={28} />
                                <Skeleton variant="rounded" width={60} height={28} />
                                <Skeleton variant="circular" width={32} height={32} />
                            </Box>
                        ))}
                    </Box>
                ) : filteredProducts.length === 0 ? (
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
                            <InventoryRoundedIcon
                                sx={{ fontSize: 40, color: 'primary.main' }}
                            />
                        </Box>
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                            {searchQuery ? 'No products found' : 'No products yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Add your first product to get started'}
                        </Typography>
                        {!searchQuery && (
                            <Button
                                variant="outlined"
                                startIcon={<AddRoundedIcon />}
                                onClick={openAddDialog}
                                sx={{ mt: 1 }}
                            >
                                Add Product
                            </Button>
                        )}
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Min Stock</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center" width={60}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product, index) => {
                                    const stockStatus = getStockStatus(product);

                                    return (
                                        <Fade in timeout={300 + index * 50} key={product._id}>
                                            <TableRow
                                                hover
                                                sx={{
                                                    '&:last-child td': { border: 0 },
                                                }}
                                            >
                                                {/* Product Name with Avatar */}
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
                                                                borderRadius: 2,
                                                            }}
                                                            variant="rounded"
                                                        >
                                                            {product.name?.charAt(0)?.toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                                color="text.primary"
                                                            >
                                                                {product.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {product._id?.slice(-6).toUpperCase()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* SKU */}
                                                <TableCell>
                                                    {product.sku ? (
                                                        <Chip
                                                            icon={<QrCodeRoundedIcon sx={{ fontSize: 16 }} />}
                                                            label={product.sku}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled">
                                                            —
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* Price */}
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color="text.primary"
                                                    >
                                                        Nu. {product.salePrice?.toFixed(2)}
                                                    </Typography>
                                                </TableCell>

                                                {/* Stock */}
                                                <TableCell align="center">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color={
                                                            stockStatus === 'out'
                                                                ? 'error.main'
                                                                : stockStatus === 'low'
                                                                    ? 'warning.main'
                                                                    : 'text.primary'
                                                        }
                                                    >
                                                        {product.stock}
                                                    </Typography>
                                                </TableCell>

                                                {/* Min Stock */}
                                                <TableCell align="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.minStock}
                                                    </Typography>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell align="center">
                                                    {stockStatus === 'out' ? (
                                                        <Chip
                                                            icon={<ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                                                            label="Out of Stock"
                                                            size="small"
                                                            color="error"
                                                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                                                        />
                                                    ) : stockStatus === 'low' ? (
                                                        <Chip
                                                            icon={<WarningAmberRoundedIcon sx={{ fontSize: 16 }} />}
                                                            label="Low Stock"
                                                            size="small"
                                                            color="warning"
                                                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />}
                                                            label="In Stock"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, product)}
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
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                        minWidth: 160,
                        borderRadius: 2,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    },
                }}
            >
                <MenuItem onClick={() => startEdit(menuProduct)} sx={{ gap: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 'auto' }}>
                        <EditRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => confirmDelete(menuProduct)}
                    sx={{ gap: 1.5, color: 'error.main' }}
                >
                    <ListItemIcon sx={{ minWidth: 'auto', color: 'error.main' }}>
                        <DeleteRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Add/Edit Product Dialog */}
            <Dialog
                open={openDialog}
                onClose={closeDialog}
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
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {editing ? (
                                <EditRoundedIcon sx={{ color: 'primary.main' }} />
                            ) : (
                                <AddRoundedIcon sx={{ color: 'primary.main' }} />
                            )}
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {editing ? 'Edit Product' : 'Add New Product'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {editing ? 'Update product details' : 'Enter product details below'}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={closeDialog} size="small">
                        <CloseRoundedIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {/* Product Name */}
                            <TextField
                                label="Product Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="e.g., iPhone 15 Pro"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* SKU */}
                            <TextField
                                label="SKU (Optional)"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                fullWidth
                                placeholder="e.g., IP15P-256-BLK"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <QrCodeRoundedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Price */}
                            <TextField
                                label="Sale Price"
                                name="salePrice"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                                value={form.salePrice}
                                onChange={handleChange}
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

                            {/* Stock & Min Stock Row */}
                            <Grid container spacing={2}>
                                <Grid item xs={6} size={{xs:6}}>
                                    <TextField
                                        label="Current Stock"
                                        name="stock"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={form.stock}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="0"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <InventoryRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item size={{sx:6}}>
                                    <TextField
                                        label="Min Stock Alert"
                                        name="minStock"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={form.minStock}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="0"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <WarningAmberRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Info Box */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.08),
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.info.main, 0.2),
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    💡 <strong>Tip:</strong> Set a minimum stock level to receive alerts when inventory runs low.
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                        <Button
                            onClick={closeDialog}
                            variant="outlined"
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting || !form.name || !form.salePrice}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            {submitting
                                ? editing
                                    ? 'Updating...'
                                    : 'Adding...'
                                : editing
                                    ? 'Update Product'
                                    : 'Add Product'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DeleteRoundedIcon sx={{ color: 'error.main' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Delete Product
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                This action cannot be undone
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete{' '}
                        <strong style={{ color: theme.palette.text.primary }}>
                            {deleteTarget?.name}
                        </strong>
                        ? This will permanently remove the product from your inventory.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.4)}`,
                        }}
                    >
                        Delete Product
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ProductsPage;