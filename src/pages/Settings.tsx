import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { useTradingStore } from '../store/tradingStore';
import { TradingConfig } from '../models/types';
import { BybitService } from '../api/bybit';

const Settings: React.FC = () => {
  const { config, setConfig } = useTradingStore();
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [apiSecret, setApiSecret] = useState(config?.apiSecret || '');
  const [mode, setMode] = useState<'classic' | 'hedge'>(config?.mode || 'classic');
  const [leverage, setLeverage] = useState<number>(config?.leverage || 1);
  const [symbol, setSymbol] = useState(config?.symbol || 'BTCUSDT');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const newConfig: TradingConfig = {
        apiKey,
        apiSecret,
        mode,
        leverage,
        symbol
      };

      // Test connection
      const bybit = new BybitService(newConfig);
      await bybit.getAccountInfo();

      setConfig(newConfig);
      setSuccess('Settings saved successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to connect to Bybit. Please check your API credentials.');
      setSuccess(null);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          API Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              type="password"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Trading Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Trading Mode</InputLabel>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'classic' | 'hedge')}
              >
                <MenuItem value="classic">Classic</MenuItem>
                <MenuItem value="hedge">Hedge</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Default Leverage</InputLabel>
              <Select
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
              >
                <MenuItem value={1}>1x</MenuItem>
                <MenuItem value={3}>3x</MenuItem>
                <MenuItem value={5}>5x</MenuItem>
                <MenuItem value={10}>10x</MenuItem>
                <MenuItem value={20}>20x</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Default Symbol</InputLabel>
              <Select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                <MenuItem value="BTCUSDT">BTC/USDT</MenuItem>
                <MenuItem value="ETHUSDT">ETH/USDT</MenuItem>
                <MenuItem value="SOLUSDT">SOL/USDT</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSave}
        disabled={!apiKey || !apiSecret}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default Settings;