import express from 'express';
import {
  addDataToVault,
  createVault,
  deleteVault,
  getUserVaults,
  getVaultById,
} from '../controllers/vault.controller.js';
import { verifyToken } from '../utils/verifyUser.js';  // Import JWT middleware

const router = express.Router();

// Create a new vault (protected)
router.post('/create', verifyToken, createVault);
router.post('/add-data/:id', verifyToken, addDataToVault);

// Get all vaults for a specific user (protected)
router.get('/get', verifyToken, getUserVaults);

// Delete and get vault by ID routes remain the same
router.delete('/delete/:id', verifyToken, deleteVault);
router.get('/get/:id', verifyToken, getVaultById);

export default router;
