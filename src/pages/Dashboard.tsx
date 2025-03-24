import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTradingStore } from '../store/tradingStore';
import { BybitService } from '../api/bybit';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { config, balance, positions } = useTradingStore();
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [leverage, setLeverage] = useState<number>(1);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (config) {
      const bybit = new BybitService(config);
      // Implementar lógica de atualização de dados
    }
  }, [config]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${symbol} Price Chart`,
      },
    },
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trading Dashboard
            </Typography>
            {balance && (
              <Typography variant="body1">
                Available Balance: ${balance.available.toFixed(2)}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Leverage</InputLabel>
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
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '400px' }}>
            {chartData && (
              <Line options={chartOptions} data={chartData} height="100%" />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Positions
            </Typography>
            {positions.map((position, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography>
                  {position.symbol} - {position.side.toUpperCase()}
                </Typography>
                <Typography>
                  Size: {position.size} | PnL: ${position.unrealizedPnl.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;