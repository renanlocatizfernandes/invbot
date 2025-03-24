import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useTradingStore } from '../store/tradingStore';
import { BybitService } from '../api/bybit';

const Positions: React.FC = () => {
  const { config, positions, updatePositions } = useTradingStore();

  useEffect(() => {
    const fetchPositions = async () => {
      if (config) {
        const bybit = new BybitService(config);
        try {
          const positions = await bybit.getPositions(config.symbol);
          updatePositions(positions);
        } catch (error) {
          console.error('Failed to fetch positions:', error);
        }
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, [config, updatePositions]);

  const handleClosePosition = async (symbol: string, side: 'long' | 'short') => {
    if (!config) return;

    const position = positions.find(p => p.symbol === symbol && p.side === side);
    if (!position) return;

    try {
      const bybit = new BybitService(config);
      await bybit.createOrder(
        symbol,
        side === 'long' ? 'Sell' : 'Buy',
        position.size,
        undefined // Market order
      );
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Positions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Entry Price</TableCell>
                    <TableCell>Leverage</TableCell>
                    <TableCell>PnL</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>{position.symbol}</TableCell>
                      <TableCell>{position.side.toUpperCase()}</TableCell>
                      <TableCell>{position.size}</TableCell>
                      <TableCell>${position.entryPrice.toFixed(2)}</TableCell>
                      <TableCell>{position.leverage}x</TableCell>
                      <TableCell
                        sx={{
                          color: position.unrealizedPnl >= 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        ${position.unrealizedPnl.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleClosePosition(position.symbol, position.side)}
                        >
                          Close
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {positions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No active positions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Positions;