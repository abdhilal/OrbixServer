import { useSelector } from 'react-redux';
import { ThemeProvider, useMediaQuery, GlobalStyles } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import theme from './common/theme';
import { useLocalization } from './common/components/LocalizationProvider';

const cache = {
  ltr: createCache({
    key: 'muiltr',
    stylisPlugins: [prefixer],
  }),
  rtl: createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  }),
};

const AppThemeProvider = ({ children }) => {
  const server = useSelector((state) => state.session.server);
  const { direction } = useLocalization();

  const serverDarkMode = server?.attributes?.darkMode;
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = serverDarkMode !== undefined ? serverDarkMode : preferDarkMode;

  const themeInstance = theme(server, darkMode, direction);

  return (
    <CacheProvider value={cache[direction]}>
      <ThemeProvider theme={themeInstance}>
        <GlobalStyles
          styles={{
            body: {
              background: 'linear-gradient(135deg, #1a1f2e 100%, #2A2F3C 100%)',
              minHeight: '100vh',
              margin: 0,
              padding: 0,
            },
            '#root': {
              minHeight: '100vh',
              background: 'transparent',
            },
            // Custom scrollbar styles
            '*::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '*::-webkit-scrollbar-track': {
              background: 'rgba(42, 47, 60, 0.3)',
              borderRadius: '4px',
            },
            '*::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              background: 'linear-gradient(135deg, #764ba2, #667eea)',
            },
            '*::-webkit-scrollbar-corner': {
              background: 'rgba(42, 47, 60, 0.3)',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

export default AppThemeProvider;
