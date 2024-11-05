import express from 'express';
import {
  addDataToVault,
  createVault,
  deleteVault,
  deleteVaultEntry,
  getUserVaults,
  getVaultById,
} from '../controllers/vault.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new vault (protected)
router.post('/create', verifyToken, createVault);
router.post('/add-data/:id', verifyToken, addDataToVault);

// Get all vaults for a specific user (protected)
router.get('/get', verifyToken, getUserVaults);

// Get vault by ID with decrypted data
router.get('/get/:id', verifyToken, getVaultById);

// Delete a vault by ID
router.delete('/delete/:id', verifyToken, deleteVault);

// Delete an entry from a vault
router.delete('/:vaultId/entries/:entryId', verifyToken, deleteVaultEntry);

export default router;