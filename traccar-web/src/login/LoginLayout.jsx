import { useMediaQuery, Paper, Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '../common/components/LocalizationProvider';
import LogoImage from './LogoImage';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1f2e 0%, #2A2F3C 100%)',
    padding: theme.spacing(2),
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    height: '600px',
    borderRadius: '20px',
    backgroundColor: '#2A2F3C',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      height: 'auto',
      maxWidth: '400px',
    },
  },
  leftSection: {
    flex: 1,
    backgroundColor: '#383D4C',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      height: '200px',
    },
  },
  rightSection: {
    flex: 1,
    backgroundColor: '#2A2F3C',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
    },
  },
  title: {
    color: '#FFFFFF',
    fontSize: '2.2rem',
    fontWeight: '700',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    letterSpacing: '-0.02em',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
    lineHeight: 1.2,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.8rem',
      marginBottom: theme.spacing(2.5),
    },
  },
  form: {
    width: '100%',
    maxWidth: '350px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    color: '#3A86FF',
    fontSize: '1.2rem',
    textAlign: 'center',
    fontWeight: '500',
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const t = useTranslation();

  return (
    <main className={classes.root}>
      <div className={classes.container}>
        {/* القسم الأيسر - للصورة */}
        <div className={classes.leftSection}>
          <div className={classes.imageContainer}>
            <img 
              src="/logo2.png" 
              alt={t('loginWelcome') || 'مرحباً بك'}
              className={classes.welcomeImage}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <Typography className={classes.imagePlaceholder} style={{ display: 'none' }}>
              {t('loginWelcome') || 'مرحباً بك'}
            </Typography>
          </div>
        </div>
        
        {/* القسم الأيمن - للنموذج */}
        <div className={classes.rightSection}>
          <Typography className={classes.title}>
            {t('loginTitle') || 'تسجيل الدخول'}
          </Typography>
          <form className={classes.form}>
            {children}
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginLayout;
