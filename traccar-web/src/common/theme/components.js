export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        color: '#FFFFFF',
        transition: 'all 0.2s ease',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(169, 180, 194, 0.3)',
          borderWidth: '1px',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(58, 134, 255, 0.5)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#3A86FF',
          borderWidth: '2px',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: '#EF4444',
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeMedium: {
        height: '40px',
        borderRadius: '12px',
        fontWeight: 600,
        textTransform: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      contained: ({ theme }) => ({
        backgroundColor: '#3A86FF',
        color: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
        '&:hover': {
          backgroundColor: '#2563EB',
          boxShadow: '0 6px 16px rgba(58, 134, 255, 0.4)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 8px rgba(58, 134, 255, 0.3)',
        },
        '&:disabled': {
          backgroundColor: '#6B7280',
          color: '#9CA3AF',
          boxShadow: 'none',
          transform: 'none',
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: '#3A86FF',
        color: '#3A86FF',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(58, 134, 255, 0.1)',
          borderColor: '#2563EB',
          color: '#2563EB',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&:disabled': {
          borderColor: '#6B7280',
          color: '#9CA3AF',
        },
      }),
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.table?.border || theme.palette.divider,
        color: theme.palette.text.primary,
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
      head: ({ theme }) => ({
        backgroundColor: theme.palette.table?.header || theme.palette.background.paper,
        color: theme.palette.text.primary,
        fontWeight: 600,
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.table?.striped?.primary || theme.palette.background.paper,
        },
        '&:nth-of-type(even)': {
          backgroundColor: theme.palette.table?.striped?.secondary || theme.palette.background.default,
        },
        '&:hover': {
          backgroundColor: theme.palette.table?.hover || theme.palette.action.hover,
        },
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        },
      }),
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: 'rgba(58, 134, 255, 0.1)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(58, 134, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(58, 134, 255, 0.3)',
          },
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: '#A9B4C2',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        '&.Mui-focused': {
          color: '#3A86FF',
        },
        '&.Mui-error': {
          color: '#EF4444',
        },
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      }),
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        marginBottom: '8px',
        '&:before': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        borderRadius: '8px 8px 0 0',
        '&:hover': {
          backgroundColor: 'rgba(58, 134, 255, 0.05)',
        },
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        color: theme.palette.text.primary,
        borderRadius: '0 0 8px 8px',
      }),
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: '#2A2F3C',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }),
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
};
