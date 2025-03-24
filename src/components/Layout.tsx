import React from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  AccountBalance as AccountIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTradingStore } from '../store/tradingStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const balance = useTradingStore(state => state.balance);

  return (
    <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvBot
          </Typography>
          {balance && (
            <Typography variant="body1">
              Balance: ${balance.available.toFixed(2)}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {children}
      </Box>

      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
        elevation={3}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => {
            navigate(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction
            label="Dashboard"
            value="/"
            icon={<DashboardIcon />}
          />
          <BottomNavigationAction
            label="Positions"
            value="/positions"
            icon={<AccountIcon />}
          />
          <BottomNavigationAction
            label="Settings"
            value="/settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;