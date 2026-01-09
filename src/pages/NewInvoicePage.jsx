import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    MenuItem,
    IconButton,
    InputAdornment,
    Chip,
    Avatar,
    Tooltip,
    Divider,
    Fade,
    Collapse,
    Alert,
    alpha,
    useTheme,
    Card,
    CardContent,
    Switch,
    Badge,
    Autocomplete,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

// Icons
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

import api from '../api';

function NewInvoicePage() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [isCredit, setIsCredit] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [items, setItems] = useState([]);
    const [saving, setSaving] = useState(false);

    // Load customers and products
    useEffect(() => {
        async function loadData() {
            try {
                const [customersRes, productsRes] = await Promise.all([
                    api.get('/customers'),
                    api.get('/products'),
                ]);
                setCustomers(customersRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error('Error loading data', err);
            } finally {
                setLoadingProducts(false);
            }
        }
        loadData();
    }, []);

    // Add product to invoice
    function addProductToInvoice(product) {
        if (!product) return;

        setItems((prev) => {
            const existing = prev.find((i) => i.productId === product._id);
            if (existing) {
                return prev.map((i) =>
                    i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [
                ...prev,
                {
                    productId: product._id,
                    productName: product.name,
                    price: product.salePrice,
                    quantity: 1,
                    stock: product.stock,
                },
            ];
        });

        // Clear selection after adding
        setSelectedProduct(null);
    }

    function updateQuantity(productId, delta) {
        setItems((prev) =>
            prev.map((i) => {
                if (i.productId === productId) {
                    const newQty = i.quantity + delta;
                    if (newQty <= 0) return i;
                    return { ...i, quantity: newQty };
                }
                return i;
            })
        );
    }

    function setQuantity(productId, quantity) {
        const q = Number(quantity);
        if (isNaN(q) || q <= 0) return;
        setItems((prev) =>
            prev.map((i) => (i.productId === productId ? { ...i, quantity: q } : i))
        );
    }

    function removeItem(productId) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    const selectedCustomer = customers.find((c) => c._id === customerId);

    // Get available products (not already in cart or filter by stock)
    const availableProducts = products.filter((p) => p.stock > 0);

    // Check if product is already in cart
    const isInCart = (productId) => items.some((i) => i.productId === productId);

    // Get quantity in cart for a product
    const getCartQuantity = (productId) => {
        const item = items.find((i) => i.productId === productId);
        return item ? item.quantity : 0;
    };

    async function handleSaveInvoice() {
        if (items.length === 0) {
            alert('Add at least one product.');
            return;
        }
        if (isCredit && !customerId) {
            alert('Select a customer for credit sale.');
            return;
        }

        const payload = {
            customerId: customerId || undefined,
            customerName: customerName || undefined,
            isCredit,
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        };

        setSaving(true);
        try {
            await api.post('/invoices', payload);
            navigate('/invoices');
        } catch (err) {
            console.error('Error saving invoice', err);
            alert(err.response?.data?.message || 'Error saving invoice');
        } finally {
            setSaving(false);
        }
    }

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
                        <Typography variant="h4" fontWeight={700} color="text.primary">
                            New Invoice
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a new sales invoice
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Left Column - Customer & Products */}
                <Grid item size={{xs:12, lg:8}}>
                    {/* Customer Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
                                <PersonRoundedIcon sx={{ color: 'primary.main' }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    Customer Details
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Select or enter customer information
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={2.5}>
                            <Grid item size={{xs:12, md:6}}>
                                <TextField
                                    select
                                    label="Select Customer"
                                    fullWidth
                                    value={customerId}
                                    onChange={(e) => {
                                        setCustomerId(e.target.value);
                                        if (!e.target.value) setIsCredit(false);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value="">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StorefrontRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <span>Walk-in Customer</span>
                                        </Box>
                                    </MenuItem>
                                    {customers.map((c) => (
                                        <MenuItem key={c._id} value={c._id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <span>{c.name}</span>
                                                {c.balance > 0 && (
                                                    <Chip
                                                        label={`Owes Nu. ${c.balance.toFixed(0)}`}
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                        sx={{ ml: 1, height: 22, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item size={{xs:12, md:6 }}> 
                                <TextField
                                    label="Customer Name (Optional Override)"
                                    fullWidth
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter name for receipt"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonAddRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* Credit Sale Toggle */}
                            <Grid item size={{xs:12}}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: isCredit
                                            ? alpha(theme.palette.warning.main, 0.08)
                                            : alpha(theme.palette.grey[500], 0.05),
                                        border: '1px solid',
                                        borderColor: isCredit
                                            ? alpha(theme.palette.warning.main, 0.3)
                                            : 'divider',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <CreditCardRoundedIcon
                                            sx={{
                                                color: isCredit ? 'warning.main' : 'text.secondary',
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                Credit Sale
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Amount will be added to customer's balance
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Switch
                                        checked={isCredit}
                                        onChange={(e) => setIsCredit(e.target.checked)}
                                        disabled={!customerId}
                                        color="warning"
                                    />
                                </Box>
                                {!customerId && isCredit === false && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                        💡 Select a customer to enable credit sale
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Product Selection Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <InventoryRoundedIcon sx={{ color: 'success.main' }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    Add Products
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Select products from dropdown to add to invoice
                                </Typography>
                            </Box>
                        </Box>

                        {/* Product Dropdown */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Autocomplete
                                fullWidth
                                value={selectedProduct}
                                onChange={(event, newValue) => {
                                    setSelectedProduct(newValue);
                                }}
                                options={products}
                                getOptionLabel={(option) => option.name || ''}
                                loading={loadingProducts}
                                isOptionEqualToValue={(option, value) => option._id === value?._id}
                                filterOptions={(options, { inputValue }) => {
                                    return options.filter(
                                        (option) =>
                                            option.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
                                            option.sku?.toLowerCase().includes(inputValue.toLowerCase())
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Product"
                                        placeholder="Search or select a product..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <CategoryRoundedIcon sx={{ color: 'text.secondary' }} />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => {
                                    const inCart = isInCart(option._id);
                                    const cartQty = getCartQuantity(option._id);
                                    const isOutOfStock = option.stock <= 0;
                                    const isLowStock = option.stock <= option.minStock && option.stock > 0;

                                    return (
                                        <ListItem
                                            {...props}
                                            key={option._id}
                                            sx={{
                                                py: 1.5,
                                                opacity: isOutOfStock ? 0.5 : 1,
                                                bgcolor: inCart ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: inCart
                                                        ? alpha(theme.palette.success.main, 0.1)
                                                        : alpha(theme.palette.primary.main, 0.05),
                                                },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    sx={{
                                                        bgcolor: inCart
                                                            ? alpha(theme.palette.success.main, 0.1)
                                                            : alpha(theme.palette.primary.main, 0.1),
                                                        color: inCart ? 'success.main' : 'primary.main',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {inCart ? (
                                                        <CheckCircleRoundedIcon />
                                                    ) : (
                                                        option.name?.charAt(0)?.toUpperCase()
                                                    )}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {option.name}
                                                        </Typography>
                                                        {inCart && (
                                                            <Chip
                                                                label={`${cartQty} in cart`}
                                                                size="small"
                                                                color="success"
                                                                sx={{ height: 20, fontSize: '0.65rem' }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <Typography variant="caption" fontWeight={600} color="primary.main">
                                                            Nu. {option.salePrice?.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">•</Typography>
                                                        {option.sku && (
                                                            <>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    SKU: {option.sku}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.disabled">•</Typography>
                                                            </>
                                                        )}
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                isOutOfStock
                                                                    ? 'Out of Stock'
                                                                    : isLowStock
                                                                        ? `Low: ${option.stock}`
                                                                        : `Stock: ${option.stock}`
                                                            }
                                                            color={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
                                                            variant="outlined"
                                                            sx={{ height: 18, fontSize: '0.6rem' }}
                                                        />
                                                    </Box>
                                                }
                                            />
                                            <Typography variant="body2" fontWeight={700} color="text.primary">
                                                Nu. {option.salePrice?.toFixed(2)}
                                            </Typography>
                                        </ListItem>
                                    );
                                }}
                                noOptionsText={
                                    <Box sx={{ py: 2, textAlign: 'center' }}>
                                        <ErrorOutlineRoundedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            No products found
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    '& .MuiAutocomplete-listbox': {
                                        maxHeight: 350,
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={() => addProductToInvoice(selectedProduct)}
                                disabled={!selectedProduct || selectedProduct.stock <= 0}
                                startIcon={<AddRoundedIcon />}
                                sx={{
                                    px: 3,
                                    borderRadius: 2,
                                    minWidth: 140,
                                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                }}
                            >
                                Add
                            </Button>
                        </Box>

                        {/* Quick Add - Product Grid (Optional) */}
                        {products.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    Quick Add
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {products.slice(0, 8).map((product) => {
                                        const inCart = isInCart(product._id);
                                        const isOutOfStock = product.stock <= 0;

                                        return (
                                            <Chip
                                                key={product._id}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <span>{product.name}</span>
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            sx={{ opacity: 0.7 }}
                                                        >
                                                            Nu. {product.salePrice}
                                                        </Typography>
                                                    </Box>
                                                }
                                                onClick={() => addProductToInvoice(product)}
                                                disabled={isOutOfStock}
                                                icon={
                                                    inCart ? (
                                                        <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                                                    ) : (
                                                        <AddRoundedIcon sx={{ fontSize: 16 }} />
                                                    )
                                                }
                                                variant={inCart ? 'filled' : 'outlined'}
                                                color={inCart ? 'success' : 'default'}
                                                sx={{
                                                    height: 36,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        bgcolor: inCart
                                                            ? 'success.main'
                                                            : alpha(theme.palette.primary.main, 0.1),
                                                        borderColor: 'primary.main',
                                                    },
                                                }}
                                            />
                                        );
                                    })}
                                    {products.length > 8 && (
                                        <Chip
                                            label={`+${products.length - 8} more`}
                                            variant="outlined"
                                            sx={{ height: 36, cursor: 'default' }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Invoice Items Table */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Invoice Items
                            </Typography>
                            {items.length > 0 && (
                                <Chip
                                    icon={<ShoppingCartRoundedIcon sx={{ fontSize: 16 }} />}
                                    label={`${totalItems} items`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>

                        {items.length === 0 ? (
                            <Box
                                sx={{
                                    py: 6,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    bgcolor: alpha(theme.palette.grey[500], 0.04),
                                    borderRadius: 2,
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                }}
                            >
                                <AddShoppingCartRoundedIcon
                                    sx={{ fontSize: 48, color: 'text.disabled' }}
                                />
                                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                                    No items added yet
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Select products from the dropdown above
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="center" width={60}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <Fade in timeout={300} key={item.productId}>
                                                <TableRow
                                                    sx={{
                                                        '&:last-child td': { border: 0 },
                                                    }}
                                                >
                                                    {/* Product */}
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
                                                                    fontSize: '0.85rem',
                                                                }}
                                                            >
                                                                {item.productName?.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {item.productName}
                                                                </Typography>
                                                                {item.stock !== undefined && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Stock: {item.stock}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    {/* Price */}
                                                    <TableCell align="center">
                                                        <Typography variant="body2" fontWeight={500}>
                                                            Nu. {item.price.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Quantity Controls */}
                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                bgcolor: alpha(theme.palette.grey[500], 0.08),
                                                                borderRadius: 2,
                                                                p: 0.5,
                                                            }}
                                                        >
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => updateQuantity(item.productId, -1)}
                                                                disabled={item.quantity <= 1}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                        color: 'error.main',
                                                                    },
                                                                }}
                                                            >
                                                                <RemoveRoundedIcon fontSize="small" />
                                                            </IconButton>
                                                            <TextField
                                                                value={item.quantity}
                                                                onChange={(e) => setQuantity(item.productId, e.target.value)}
                                                                size="small"
                                                                inputProps={{
                                                                    min: 1,
                                                                    style: {
                                                                        width: 40,
                                                                        textAlign: 'center',
                                                                        padding: '4px 0',
                                                                    },
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        bgcolor: 'background.paper',
                                                                    },
                                                                    '& fieldset': { border: 'none' },
                                                                }}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => updateQuantity(item.productId, 1)}
                                                                disabled={item.stock && item.quantity >= item.stock}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                        color: 'success.main',
                                                                    },
                                                                }}
                                                            >
                                                                <AddRoundedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>

                                                    {/* Subtotal */}
                                                    <TableCell align="right">
                                                        <Typography variant="body2" fontWeight={700}>
                                                            Nu. {(item.price * item.quantity).toFixed(2)}
                                                        </Typography>
                                                    </TableCell>

                                                    {/* Remove */}
                                                    <TableCell align="center">
                                                        <Tooltip title="Remove item">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => removeItem(item.productId)}
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                        color: 'error.main',
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteRoundedIcon fontSize="small" />
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
                </Grid>

                {/* Right Column - Order Summary */}
                <Grid item size={{xs:12, lg:4}}>
                    <Box sx={{ position: 'sticky', top: 24 }}>
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
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Badge badgeContent={totalItems} color="primary">
                                        <ShoppingCartRoundedIcon sx={{ color: 'primary.main' }} />
                                    </Badge>
                                    <Typography variant="h6" fontWeight={600}>
                                        Order Summary
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Summary Content */}
                            <Box sx={{ p: 2.5 }}>
                                {/* Customer Info */}
                                {(customerId || customerName) && (
                                    <Box
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.grey[500], 0.05),
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            Customer
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {customerName || selectedCustomer?.name || 'Walk-in Customer'}
                                        </Typography>
                                        {isCredit && (
                                            <Chip
                                                icon={<CreditCardRoundedIcon sx={{ fontSize: 14 }} />}
                                                label="Credit Sale"
                                                size="small"
                                                color="warning"
                                                sx={{ mt: 1, height: 24, fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Box>
                                )}

                                {/* Items Summary */}
                                {items.length > 0 && (
                                    <Box sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
                                        {items.map((item) => (
                                            <Box
                                                key={item.productId}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    py: 1,
                                                    borderBottom: '1px dashed',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="body2"
                                                        noWrap
                                                        sx={{ maxWidth: 150 }}
                                                    >
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Nu. {item.price.toFixed(2)} × {item.quantity}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    Nu. {(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <Divider sx={{ my: 2 }} />

                                {/* Total */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3,
                                    }}
                                >
                                    <Typography variant="h6" fontWeight={600}>
                                        Total
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        color="primary.main"
                                    >
                                        Nu. {total.toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Save Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={saving || items.length === 0}
                                    onClick={handleSaveInvoice}
                                    startIcon={!saving && <SaveRoundedIcon />}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                                        },
                                        '&.Mui-disabled': {
                                            bgcolor: 'action.disabledBackground',
                                        },
                                    }}
                                >
                                    {saving ? 'Saving Invoice...' : 'Save Invoice'}
                                </Button>

                                {/* Warning for Credit */}
                                {isCredit && items.length > 0 && (
                                    <Alert
                                        severity="warning"
                                        icon={<WarningAmberRoundedIcon />}
                                        sx={{
                                            mt: 2,
                                            borderRadius: 2,
                                            '& .MuiAlert-message': {
                                                fontSize: '0.75rem',
                                            },
                                        }}
                                    >
                                        Nu. {total.toFixed(2)} will be added to {selectedCustomer?.name || 'customer'}'s balance
                                    </Alert>
                                )}

                                {/* Empty Cart Message */}
                                {items.length === 0 && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: 'block',
                                            textAlign: 'center',
                                            mt: 2,
                                        }}
                                    >
                                        Select products to create an invoice
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        {/* Quick Stats */}
                        {items.length > 0 && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.success.main, 0.05),
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.success.main, 0.2),
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item size={{xs:6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Items
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {totalItems}
                                        </Typography>
                                    </Grid>
                                    <Grid item size={{xs:6}}>
                                        <Typography variant="caption" color="text.secondary">
                                            Products
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {items.length}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default NewInvoicePage;