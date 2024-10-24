import express from 'express';
import {
  createVault,
  deleteVault,
  getAllVaults,
  getVaultById,
} from '../controllers/vault.controller.js';

const router = express.Router();

// Create a new vault
router.post('/create', createVault);

// Delete a vault by ID
router.delete('/delete/:id', deleteVault);

// Get all vaults
router.get('/get', getAllVaults);

// Get a vault by ID
router.get('/get/:id', getVaultById);

export default router;
