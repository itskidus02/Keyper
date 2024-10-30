import Vault from '../models/vault.model.js';
import crypto from 'crypto';

const encryptionKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';  // 32-byte key for AES-256
const iv = crypto.randomBytes(16); // Initialization vector

// Helper function for AES encryption
const encryptData = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`; // Return IV and encrypted text
};

// Helper function for AES decryption
const decryptData = (text) => {
  const [ivHex, encryptedText] = text.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), ivBuffer);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
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
export const addDataToVault = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const encryptedEntries = data.map((entry) => encryptData(entry));
    const vault = await Vault.findByIdAndUpdate(
      id,
      { $push: { entries: { $each: encryptedEntries } } },
      { new: true }
    );

    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }
    res.status(200).json({ message: "Data added successfully", vault });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    
    // Decrypt entries before sending
    const decryptedEntries = vault.entries.map((entry) => decryptData(entry));
    res.json({ ...vault.toObject(), entries: decryptedEntries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
