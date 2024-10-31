import Vault from '../models/vault.model.js';
import crypto from 'crypto';

// Helper function for AES encryption
const encryptData = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

// Helper function for AES decryption
const decryptData = (text, key) => {
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const createVault = async (req, res) => {
  try {
    const { name } = req.body;
    const vault = new Vault({
      name,
      user: req.user.id
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
    const key = req.user.key; // Get encryption key from JWT

    const encryptedEntries = data.map(entry => encryptData(entry, key));
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

export const getUserVaults = async (req, res) => {
  try {
    const vaults = await Vault.find({ user: req.user.id });
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVaults = async (req, res) => {
  try {
    const vaults = await Vault.find({ user: req.user.id });
    res.json(vaults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getVaultById = async (req, res) => {
  try {
    const { id } = req.params;
    const key = req.user.key; // Get encryption key from JWT
    const vault = await Vault.findById(id);
    
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Decrypt entries using user's key
    const decryptedEntries = vault.entries.map(entry => decryptData(entry, key));
    res.json({ ...vault.toObject(), entries: decryptedEntries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};