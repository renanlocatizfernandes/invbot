import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { useTradingStore } from '../store/tradingStore';
import { BybitService } from '../api/bybit';
import { TradingConfig } from '../models/types';

export default function Settings() {
  const { config, setConfig, setConnected, setError } = useTradingStore();
  
  const [formData, setFormData] = useState<TradingConfig>({
    apiKey: config?.apiKey || '',
    apiSecret: config?.apiSecret || '',
    testnet: config?.testnet || true,
    mode: config?.mode || 'ISOLATED',
    leverage: config?.leverage || 1,
    symbol: config?.symbol || 'BTCUSDT'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof TradingConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSuccess(false);
    setError(null);

    try {
      console.log('Tentando conectar com Bybit...', {
        apiKeyLength: formData.apiKey.length,
        secretLength: formData.apiSecret.length,
        testnet: formData.testnet
      });

      const bybit = new BybitService(
        formData.apiKey.trim(),
        formData.apiSecret.trim(),
        formData.testnet
      );

      const accountInfo = await bybit.getAccountInfo();
      console.log('Conta conectada:', {
        accountType: accountInfo.accountType,
        totalEquity: accountInfo.totalEquity
      });

      setConfig(formData);
      setConnected(true);
      setSuccess(true);
    } catch (error: any) {
      console.error('Erro ao conectar:', error);
      setError(error.message || 'Erro ao conectar com Bybit');
      setConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Configurações
        </Typography>

        <Box component="form" sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.testnet}
                onChange={(e) => handleChange('testnet', e.target.checked)}
              />
            }
            label="Usar Testnet"
          />

          <TextField
            fullWidth
            margin="normal"
            label="API Key"
            value={formData.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="API Secret"
            type="password"
            value={formData.apiSecret}
            onChange={(e) => handleChange('apiSecret', e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Modo</InputLabel>
            <Select
              value={formData.mode}
              label="Modo"
              onChange={(e) => handleChange('mode', e.target.value)}
            >
              <MenuItem value="ISOLATED">Isolated</MenuItem>
              <MenuItem value="CROSS">Cross</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Alavancagem</InputLabel>
            <Select
              value={formData.leverage}
              label="Alavancagem"
              onChange={(e) => handleChange('leverage', e.target.value)}
            >
              <MenuItem value={1}>1x</MenuItem>
              <MenuItem value={3}>3x</MenuItem>
              <MenuItem value={5}>5x</MenuItem>
              <MenuItem value={10}>10x</MenuItem>
              <MenuItem value={20}>20x</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Par de Trading"
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Configurações salvas com sucesso!
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}