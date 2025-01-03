// vaultSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks to fetch, add, and delete vaults
export const fetchVaults = createAsyncThunk('vault/fetchVaults', async () => {
  const response = await axios.get('/api/vaults/get', { withCredentials: true });
  return response.data;
});

export const createVault = createAsyncThunk('vault/createVault', async (newVaultName) => {
  const response = await axios.post('/api/vaults/create', { name: newVaultName }, { withCredentials: true });
  return response.data;
});

export const deleteVault = createAsyncThunk('vault/deleteVault', async (vaultId) => {
  await axios.delete(`/api/vaults/delete/${vaultId}`, { withCredentials: true });
  return vaultId;
});

// Thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk('vault/fetchDashboardStats', async () => {
  const response = await axios.get('/api/vaults/dashboard-stats', { withCredentials: true });
  console.log(response.data);
  return response.data;
});

const vaultSlice = createSlice({
  name: 'vault',
  initialState: {
    vaults: [],
    dashboardStats: null, // Add state for dashboard stats
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaults.fulfilled, (state, action) => {
        state.vaults = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createVault.fulfilled, (state, action) => {
        state.vaults.push(action.payload);
      })
      .addCase(deleteVault.fulfilled, (state, action) => {
        state.vaults = state.vaults.filter((vault) => vault._id !== action.payload);
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export default vaultSlice.reducer;
