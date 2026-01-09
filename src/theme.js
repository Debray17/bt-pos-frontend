import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    // Color Palette
    palette: {
        primary: {
            main: '#2563EB',
            light: '#3B82F6',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#64748B',
            light: '#94A3B8',
            dark: '#475569',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#10B981',
            light: '#D1FAE5',
            dark: '#059669',
        },
        warning: {
            main: '#F59E0B',
            light: '#FEF3C7',
            dark: '#D97706',
        },
        error: {
            main: '#EF4444',
            light: '#FEE2E2',
            dark: '#DC2626',
        },
        info: {
            main: '#3B82F6',
            light: '#DBEAFE',
            dark: '#2563EB',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
            disabled: '#94A3B8',
        },
        divider: '#E2E8F0',
    },

    // Typography
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none', // No uppercase buttons
            fontWeight: 500,
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: '#64748B',
        },
    },

    // Shape
    shape: {
        borderRadius: 10,
    },

    // Shadows (Softer, more minimal)
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    ],

    // Component Overrides
    components: {
        // Button
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'transform 150ms ease',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },

        // Card
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E2E8F0',
                },
            },
        },

        // Paper
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },

        // TextField
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                            borderColor: '#E2E8F0',
                            borderWidth: '1.5px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#94A3B8',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#2563EB',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },

        // Table
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#F8FAFC',
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#475569',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    },
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E2E8F0',
                    padding: '14px 16px',
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#F8FAFC',
                    },
                },
            },
        },

        // Chip
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
            },
        },

        // Dialog
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                },
            },
        },

        // AppBar
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                },
            },
        },

        // Drawer
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    border: 'none',
                    backgroundColor: '#FFFFFF',
                },
            },
        },

        // List Item
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '4px 8px',
                    '&.Mui-selected': {
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        '&:hover': {
                            backgroundColor: '#DBEAFE',
                        },
                    },
                },
            },
        },

        // Tooltip
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1E293B',
                    fontSize: '0.75rem',
                    borderRadius: 6,
                    padding: '8px 12px',
                },
            },
        },

        // Snackbar / Alert
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
    },
});

export default theme;