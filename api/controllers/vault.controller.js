import Vault from '../models/vault.model.js';

// Create a new vault
// Create a new vault
export const createVault = async (req, res) => {
  try {
    const { name } = req.body;
    const vault = new Vault({
      name,
      user: req.user.id  // Associate vault with the user
    });
    await vault.save();
    res.status(201).json(vault);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all vaults for a specific user
export const getUserVaults = async (req, res) => {
  try {
    const vaults = await Vault.find({ user: req.user.id }); // Filter by user ID
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vaults for the authenticated user
export const getAllVaults = async (req, res) => {
  try {
    const userId = req.user.id;  // Get the user's ID from the request
    const vaults = await Vault.find({ user: userId });  // Fetch vaults specific to the user
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a vault by ID
export const deleteVault = async (req, res) => {
  try {
    const { id } = req.params;
    const vault = await Vault.findByIdAndDelete(id);
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    res.json({ message: 'Vault deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vaults


// Get a vault by ID
export const getVaultById = async (req, res) => {
  try {
    const { id } = req.params;
    const vault = await Vault.findById(id);
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    res.json(vault);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};