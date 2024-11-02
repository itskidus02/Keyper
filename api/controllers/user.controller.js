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

const decryptEntry = (entry, key) => {
  try {
    const [ivHex, encryptedText] = entry.value.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return {
      name: entry.name,
      value: decrypted.toString(),
      createdAt: entry.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to decrypt entry: ${entry.name}`);
  }
};

const encryptEntry = (entry, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(entry.value);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    name: entry.name,
    value: `${iv.toString('hex')}:${encrypted.toString('hex')}`,
    createdAt: entry.createdAt
  };
};

const reEncryptVaultEntries = async (userId, oldKey, newKey) => {
  const vaults = await Vault.find({ user: userId });
  
  for (const vault of vaults) {
    try {
      // Decrypt all entries with old key
      const decryptedEntries = vault.entries.map(entry => decryptEntry(entry, oldKey));
      
      // Re-encrypt with new key
      const reEncryptedEntries = decryptedEntries.map(entry => encryptEntry(entry, newKey));
      
      await Vault.findByIdAndUpdate(vault._id, { entries: reEncryptedEntries });
    } catch (error) {
      throw new Error(`Failed to re-encrypt vault ${vault._id}: ${error.message}`);
    }
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    const updateData = {
      username: req.body.username || user.username,
      email: req.body.email || user.email,
      profilePicture: req.body.profilePicture || user.profilePicture,
    };

    if (req.body.password) {
      try {
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
      } catch (error) {
        return next(errorHandler(500, `Failed to update password: ${error.message}`));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    // If password was updated, create new token with new key
    let token = null;
    if (req.body.password) {
      token = jwt.sign({
        id: updatedUser._id,
        key: updateData.password
      }, process.env.JWT_SECRET);
    }

    const { password, salt, ...rest } = updatedUser._doc;
    
    // Only set new cookie if password was changed
    if (token) {
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate });
    }

    res.status(200).json({
      ...rest,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(errorHandler(500, error.message));
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
    
    // Clear the authentication cookie
    res.clearCookie('access_token');
    
    res.status(200).json({ message: 'User and their vaults have been deleted successfully' });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};