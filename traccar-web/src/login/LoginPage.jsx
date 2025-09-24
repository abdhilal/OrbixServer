import { useEffect, useState } from 'react';
import {
  useMediaQuery, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, IconButton, Tooltip, Box, InputAdornment,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken, handleLoginTokenListeners, nativeEnvironment, nativePostMessage,
} from '../common/components/NativeInterface';
import LogoImage from './LogoImage';
import { useCatch } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(3),
    right: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1.5),
    zIndex: 1000,
  },
  languageSelector: {
    minWidth: '160px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      border: '1px solid rgba(58, 134, 255, 0.3)',
      boxShadow: '0 12px 40px rgba(58, 134, 255, 0.15)',
      transform: 'translateY(-2px)',
    },
    '& .MuiSelect-select': {
      padding: '12px 16px',
      color: '#FFFFFF',
      fontSize: '0.9rem',
      fontWeight: '500',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSelect-icon': {
      color: '#A9B4C2',
      transition: 'all 0.2s ease',
    },
    '&:hover .MuiSelect-icon': {
      color: '#3A86FF',
    },
    '& .MuiSelect-select:focus': {
      backgroundColor: 'transparent',
    },
  },
  languageMenu: {
    '& .MuiPaper-root': {
      backgroundColor: '#2A2F3C',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      marginTop: '8px',
      minWidth: '200px',
      maxHeight: '300px',
      overflow: 'auto',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(58, 134, 255, 0.3)',
        borderRadius: '3px',
        '&:hover': {
          background: 'rgba(58, 134, 255, 0.5)',
        },
      },
    },
    '& .MuiMenuItem-root': {
      padding: '12px 16px',
      color: '#FFFFFF',
      fontSize: '0.9rem',
      fontWeight: '500',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
  },
  flagIcon: {
    width: '20px',
    height: '15px',
    borderRadius: '3px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    flexShrink: 0,
  },
  serverButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: '#A9B4C2',
    padding: '12px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      border: '1px solid rgba(58, 134, 255, 0.3)',
      boxShadow: '0 12px 40px rgba(58, 134, 255, 0.15)',
      transform: 'translateY(-2px)',
      color: '#3A86FF',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginTop: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  link: {
    cursor: 'pointer',
  },
  eyeIcon: {
    color: '#A9B4C2',
    transition: 'all 0.2s ease',
    padding: '8px',
    borderRadius: '6px',
    marginRight: '4px',
    '&:hover': {
      color: '#3A86FF',
      backgroundColor: 'rgba(58, 134, 255, 0.08)',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  eyeIconActive: {
    color: '#3A86FF',
    transition: 'all 0.2s ease',
    padding: '8px',
    borderRadius: '6px',
    marginRight: '4px',
    '&:hover': {
      color: '#2563EB',
      backgroundColor: 'rgba(58, 134, 255, 0.08)',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  loginButton: {
    backgroundColor: '#3A86FF',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '1rem',
    padding: theme.spacing(1.5, 3),
    borderRadius: '12px',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
    transition: 'all 0.2s ease',
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
  },
  resetLink: {
    color: '#A9B4C2',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: '#3A86FF',
      textDecoration: 'underline',
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '1rem',
    },
    '& .MuiOutlinedInput-root fieldset': {
      borderColor: 'rgba(169, 180, 194, 0.3)',
      borderWidth: 1,
    },
    '& .MuiOutlinedInput-root:hover fieldset': {
      borderColor: 'rgba(58, 134, 255, 0.5)',
    },
    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
      borderColor: '#3A86FF',
      borderWidth: 2,
    },
    '& .MuiOutlinedInput-root.Mui-error fieldset': {
      borderColor: '#EF4444',
    },
    '& .MuiInputLabel-root': {
      color: '#A9B4C2',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#3A86FF',
    },
    '& .MuiInputLabel-root.Mui-error': {
      color: '#EF4444',
    },
    '& .MuiOutlinedInput-input': {
      color: '#FFFFFF',
      padding: '14px 16px',
    },
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], country: values[1].country, name: values[1].name }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerTooltip, setShowServerTooltip] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        navigate(target, { replace: true });
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(`/api/session?token=${encodeURIComponent(token)}`);
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    navigate('/');
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('hostname') !== window.location.hostname) {
      window.localStorage.setItem('hostname', window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      <div className={classes.options}>
        {nativeEnvironment && changeEnabled && (
          <IconButton 
            className={classes.serverButton}
            onClick={() => navigate('/change-server')}
          >
            <Tooltip
              title={`${t('settingsServer')}: ${window.location.hostname}`}
              open={showServerTooltip}
              arrow
            >
              <VpnLockIcon />
            </Tooltip>
          </IconButton>
        )}
        {languageEnabled && (
          <FormControl>
            <Select 
              value={language} 
              onChange={(e) => setLocalLanguage(e.target.value)}
              className={classes.languageSelector}
              MenuProps={{
                className: classes.languageMenu,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
              }}
            >
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code}>
                  <ReactCountryFlag 
                    countryCode={it.country} 
                    svg 
                    className={classes.flagIcon}
                  />
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div className={classes.container}>
        {useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.primary.main} />}
        {!openIdForced && (
          <>
            <TextField
              required
              error={failed}
              label={t('userEmail')}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={failed && 'Invalid username or password'}
              className={classes.textField}
            />
            <TextField
              required
              error={failed}
              label={t('userPassword')}
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.textField}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        className={showPassword ? classes.eyeIconActive : classes.eyeIcon}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {codeEnabled && (
              <TextField
                required
                error={failed}
                label={t('loginTotpCode')}
                name="code"
                value={code}
                type="number"
                onChange={(e) => setCode(e.target.value)}
                className={classes.textField}
              />
            )}
            <Button
              onClick={handlePasswordLogin}
              type="submit"
              variant="contained"
              className={classes.loginButton}
              disabled={!email || !password || (codeEnabled && !code)}
            >
              {t('loginLogin')}
            </Button>
          </>
        )}
        {openIdEnabled && (
          <Button
            onClick={() => handleOpenIdLogin()}
            variant="contained"
            className={classes.loginButton}
          >
            {t('loginOpenId')}
          </Button>
        )}
        {!openIdForced && (
          <div className={classes.extraContainer}>
            {registrationEnabled && (
              <Link
                onClick={() => navigate('/register')}
                className={classes.resetLink}
                underline="none"
                variant="caption"
              >
                {t('loginRegister')}
              </Link>
            )}
            {emailEnabled && (
              <Link
                onClick={() => navigate('/reset-password')}
                className={classes.resetLink}
                underline="none"
                variant="caption"
              >
                {t('loginReset')}
              </Link>
            )}
          </div>
        )}
      </div>
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </LoginLayout>
  );
};

export default LoginPage;
