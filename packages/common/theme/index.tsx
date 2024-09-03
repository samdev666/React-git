import { createTheme } from '@mui/material/styles';
import { baseFontFamily, fontSize, fontWeight } from './style.typography';
import { brandColour, greyScaleColour, otherColour } from './style.palette';
import { respondTo } from './style.layout';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // Extra small devices (up to 767px)
      sm: 768, // Small devices (768px and up)
      md: 1024, // Medium devices (1024px and up)
      lg: 1600, // Large devices (1600px and up)
      xl: 1921, // Extra large devices (1920px and up)
    },
  },
  typography: {
    fontFamily: baseFontFamily,
    h1: {
      fontSize: fontSize.h1,
      fontWeight: fontWeight.semiBold,
    },
    h2: {
      fontSize: fontSize.h2,
      fontWeight: fontWeight.medium,
    },
    h3: {
      fontSize: fontSize.h3,
      fontWeight: fontWeight.medium,
    },
    h4: {
      fontSize: fontSize.h4,
      fontWeight: fontWeight.medium,
    },
    h5: {
      fontSize: fontSize.h5,
      fontWeight: fontWeight.semiBold,
    },
    body1: {
      fontSize: fontSize.b1,
      fontWeight: fontWeight.regular,
    },
    body2: {
      fontSize: fontSize.b2,
      fontWeight: fontWeight.regular,
    },
    subtitle1: {
      fontSize: fontSize.b1,
      fontWeight: fontWeight.medium,
    },
    subtitle2: {
      fontSize: fontSize.b2,
      fontWeight: fontWeight.medium,
    },
  },
  palette: {
    text: {
      secondary: greyScaleColour.secondaryMain,
      primary: greyScaleColour.secondaryMain,
    },
    primary: {
      main: brandColour.primaryMain,
      dark: brandColour.primaryMain,
      light: brandColour.primary70,
      contrastText: greyScaleColour.white100,
    },
    secondary: {
      main: greyScaleColour.secondaryMain,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0px',
          fontFamily: baseFontFamily,
          fontSize: fontSize.h5,
          fontWeight: fontWeight.medium,
          color: greyScaleColour.white100,
          borderRadius: '4px',
          boxShadow: 'none',
          padding: '12px 20px',
          lineHeight: '24px',
        },
        containedInfo: {
          backgroundColor: greyScaleColour.grey60,
          color: greyScaleColour.secondaryMain,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: brandColour.primary80,
          },
        },
        containedPrimary: {
          backgroundColor: brandColour.primary100,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: brandColour.primaryDark,
          },
          '&.Mui-disabled': {
            color: greyScaleColour.grey90,
            backgroundColor: greyScaleColour.grey70,
          },
        },
        containedError: {
          backgroundColor: otherColour.errorDefault,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: otherColour.errorHover,
          },
          '&.Mui-disabled': {
            color: greyScaleColour.grey90,
            backgroundColor: greyScaleColour.grey70,
          },
        },
        outlinedSecondary: {
          backgroundColor: 'none',
          color: greyScaleColour.secondaryMain,
          padding: '11px 20px',
          border: `1px solid ${greyScaleColour.secondaryMain}`,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: greyScaleColour.secondaryMain,
            color: greyScaleColour.white100,
          },
          '&.Mui-disabled': {
            color: greyScaleColour.grey90,
            backgroundColor: greyScaleColour.grey70,
          },
        },
        containedSecondary: {
          backgroundColor: otherColour.errorDefault,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: otherColour.errorDefault,
          },
        },
        sizeMedium: {
          fontWeight: fontWeight.medium,
          borderRadius: '4px',
        },
        textPrimary: {
          backgroundColor: greyScaleColour.white100,
          color: brandColour.primary100,
          fontSize: fontSize.h5,
          fontWeight: fontWeight.medium,
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'inherit',
          },
        },
        textSecondary: {
          backgroundColor: 'inherit',
          color: brandColour.primaryMain,
          fontSize: fontSize.b1,
          fontWeight: fontWeight.regular,
          padding: '0 !important',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'inherit',
          },
        },
        outlinedPrimary: {
          borderRadius: '4px',
          borderColor: brandColour.primaryMain,
          color: brandColour.primaryMain,
          background: 'inherit',
          '&:hover': {
            background: 'inherit',
            boxShadow: 'none',
          },
        },
        textError: {
          color: otherColour.errorDefault,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: greyScaleColour.grey100,
          '&.Mui-checked': {
            color: brandColour.primaryMain,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: greyScaleColour.grey80,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px',
          borderBottom: 'none',
        },
        head: {
          padding: '16px',
          color: greyScaleColour.grey100,
          backgroundColor: greyScaleColour.grey60,
          [respondTo.mdDown]: {
            padding: '12px',
          },
        },
        body: {
          lineHeight: '20px',
          paddingTop: '11.5px',
          paddingBottom: '11.5px',
          borderBottom: '1px dashed #F6F5F4',
          fontSize: fontSize.b1,
          fontWeight: fontWeight.medium,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '20px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          padding: '4px 12px',
          height: '28px',
          '&.MuiChip-label': {
            padding: 0,
          },
        },
        label: {
          padding: 0,
          fontSize: fontSize.b1,
          fontWeight: fontWeight.semiBold,
        },
        filledPrimary: {
          backgroundColor: brandColour.primary70,
          color: brandColour.primary100,
        },
        outlinedPrimary: {
          border: `1px solid ${brandColour.primary100}`,
          color: brandColour.primary100,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: 'none',
          border: `1px solid ${greyScaleColour.grey80}`,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 30px) !important',
          '&:last-child': {
            paddingBottom: '0px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: fontSize.b1,
          borderRadius: '10px',
          borderColor: greyScaleColour.secondaryMain,
          backgroundColor: greyScaleColour.white100,
          border: 'none',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: `${greyScaleColour.secondaryMain} !important`,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: `${otherColour.errorDefault} !important`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px !important',
            borderColor: `${greyScaleColour.grey100} !important`,
          },
          '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${otherColour.errorDefault} !important`,
          },
          '&.Mui-disabled': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#BBBBBF !important',
            },
          },
        },
        input: {
          padding: '14px 16px',
        },
        inputMultiline: {
          padding: '0px !important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '14px 0 14px 16px',
        },
        notchedOutline: {
          borderColor: greyScaleColour.grey80,
          borderRadius: '4px',
          borderWidth: '1px !important',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: greyScaleColour.grey70,
          // width: '100%'
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          cursor: 'inherit',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          top: -2,
          color: greyScaleColour.grey100,
          fontSize: fontSize.b1,
          fontWeight: fontWeight.regular,
          '&.Mui-focused': {
            color: greyScaleColour.grey100,
          },
          '&.Mui-error': {
            color: otherColour.errorDefault,
          },
        },
        shrink: {
          top: 0,
        },
        asterisk: {
          color: otherColour.errorDefault,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: greyScaleColour.grey100,
          '&:hover': {
            color: brandColour.primaryMain,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '6px',
          },
        },
        option: {
          wordBreak: 'break-all',
          '&.Mui-focused': {
            backgroundColor: `${greyScaleColour.grey60} !important`,
          },
          '&[aria-selected="true"]': {
            backgroundColor: `${brandColour.primaryMain} !important`,
            color: `${greyScaleColour.white100} !important`,
          },
        },
        paper: {
          boxShadow: '0px 2px 15px 0px rgba(0, 0, 0, 0.12)',
        },
        input: {
          minWidth: '0px !important',
        },
        tag: {
          display: 'flex',
          padding: '2px 10px',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: brandColour.primaryMain,
          color: greyScaleColour.white100,
          borderRadius: '60px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: 'center',
        },
        message: {
          padding: '0',
        },
      },
    },
  },
});

export default theme;
