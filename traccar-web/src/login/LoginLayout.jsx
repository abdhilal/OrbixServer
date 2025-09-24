import { useMediaQuery, Paper, Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactCountryFlag from 'react-country-flag';
import { useState } from 'react';
import { useLocalization } from '../common/components/LocalizationProvider';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: theme.palette.custom.backgroundGradient,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    height: '600px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      height: 'auto',
      maxWidth: '400px',
      maxHeight: '90vh',
    },
  },
  leftSection: {
    flex: 1,
    backgroundColor: theme.palette.custom.backgroundContent,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      minHeight: '200px',
    },
  },
  rightSection: {
    flex: 1,
    backgroundColor: theme.palette.backgroundMain,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px',
    [theme.breakpoints.down('md')]: {
      padding: '24px',
    },
  },
  title: {
    color: '#FFFFFF',
    marginBottom: '24px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '2.2rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.8rem',
      marginBottom: '20px',
    },
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/logo2.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  welcomeText: {
    color: '#3A86FF',
    fontSize: '1.5rem',
    fontWeight: 600,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '16px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  languageButton: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    minWidth: '160px',
    height: '48px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      border: '1px solid rgba(58, 134, 255, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 40px rgba(58, 134, 255, 0.15)',
    },
  },
  languageMenuPaper: {
    backgroundColor: '#2A2F3C',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    marginTop: '8px',
    minWidth: '200px',
    maxHeight: '300px',
    overflow: 'auto',
  },
  languageMenuItem: {
    color: '#FFFFFF',
    padding: '12px 16px',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(58, 134, 255, 0.1)',
      color: '#3A86FF',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(58, 134, 255, 0.15)',
      color: '#3A86FF',
      '&:hover': {
        backgroundColor: 'rgba(58, 134, 255, 0.2)',
      },
    },
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { languages, language, setLanguage } = useLocalization();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    handleLanguageClose();
  };

  return (
    <main className={classes.root}>
      <div className={classes.container}>
        {/* القسم الأيسر - الصورة */}
        <div className={classes.leftSection}>
          <div className={classes.imageContainer}>
            <div className={classes.welcomeText}>
              مرحباً بك
            </div>
          </div>
          {/* زر اللغة */}
          <IconButton
            className={classes.languageButton}
            onClick={handleLanguageClick}
            size="small"
          >
            <ReactCountryFlag
              countryCode={languages[language]?.country || 'US'}
              svg
              style={{
                width: '1.2em',
                height: '1.2em',
                marginRight: '8px',
              }}
            />
            <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {languages[language]?.name || 'English'}
            </Typography>
            <KeyboardArrowDownIcon 
              sx={{ 
                fontSize: '1.2rem',
                transition: 'transform 0.2s ease',
                transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
              }} 
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLanguageClose}
            PaperProps={{
              className: classes.languageMenuPaper,
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            {Object.keys(languages).map((key) => (
              <MenuItem
                key={key}
                onClick={() => handleLanguageSelect(key)}
                selected={key === language}
                className={classes.languageMenuItem}
              >
                <ReactCountryFlag
                  countryCode={languages[key].country}
                  svg
                  style={{
                    width: '1.2em',
                    height: '1.2em',
                  }}
                />
                {languages[key].name}
              </MenuItem>
            ))}
          </Menu>
        </div>
        
        {/* القسم الأيمن - النموذج */}
        <div className={classes.rightSection}>
          <form className={classes.form}>
            {children}
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginLayout;
