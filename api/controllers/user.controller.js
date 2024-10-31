import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Vault from '../models/vault.model.js';

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Helper functions for encryption
const generateKey = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
};

const reEncryptVaultEntries = async (userId, oldKey, newKey) => {
  const vaults = await Vault.find({ user: userId });
  
  for (const vault of vaults) {
    const decryptedEntries = vault.entries.map(entry => {
      try {
        const [ivHex, encryptedText] = entry.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(encryptedText, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(oldKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
      } catch (error) {
        return entry; // Keep original if decryption fails
      }
    });

    // Re-encrypt with new key
    const reEncryptedEntries = decryptedEntries.map(entry => {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(newKey, 'hex'), iv);
      let encrypted = cipher.update(entry);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    });

    await Vault.findByIdAndUpdate(vault._id, { entries: reEncryptedEntries });
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    const user = await User.findById(req.params.id);
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
    };

    if (req.body.password) {
      // Generate new salt and key for the new password
      const newSalt = crypto.randomBytes(16).toString('hex');
      const newKey = generateKey(req.body.password, newSalt);
      
      // Re-encrypt all vault entries with the new key
      await reEncryptVaultEntries(
        req.params.id,
        req.user.key,
        newKey.toString('hex')
      );

      updateData.password = newKey.toString('hex');
      updateData.salt = newSalt;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    // If password was updated, create new token with new key
    if (req.body.password) {
      const token = jwt.sign({
        id: updatedUser._id,
        key: updateData.password // Use new key in token
      }, process.env.JWT_SECRET);

      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate });
    }

    const { password, salt, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    // Delete all vaults associated with the user
    await Vault.deleteMany({ user: req.params.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json('User and their vaults have been deleted.');
  } catch (error) {
    next(error);
  }
};