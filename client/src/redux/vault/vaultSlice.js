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

const vaultSlice = createSlice({
  name: 'vault',
  initialState: {
    vaults: [],
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
      });
  },
});

export default vaultSlice.reducer;
