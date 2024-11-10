import Vault from "../models/vault.model.js";
import crypto from "crypto";
import mongoose from "mongoose";
const encryptData = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decryptData = (text, key) => {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedText, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const validateEntry = (entry) => {
  if (!entry.name || typeof entry.name !== "string") {
    throw new Error("Invalid entry name");
  }

  if (!entry.type || !["password", "seed"].includes(entry.type)) {
    throw new Error("Invalid entry type");
  }

  if (!entry.value || typeof entry.value !== "string") {
    throw new Error("Invalid entry value");
  }

  if (entry.type === "seed") {
    const wordCount = entry.value.split(" ").length;
    if (![12, 15, 18, 21, 24].includes(wordCount)) {
      throw new Error("Invalid seed phrase word count");
    }
  }
};

export const createVault = async (req, res) => {
  try {
    const { name } = req.body;
    const vault = new Vault({
      name,
      user: req.user.id,
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
    const key = req.user.key;

    const encryptedEntries = data.map((entry) => {
      validateEntry(entry);
      return {
        name: entry.name,
        type: entry.type,
        value: encryptData(entry.value, key),
        createdAt: new Date(),
      };
    });

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
    res.status(400).json({ message: error.message });
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

export const deleteVault = async (req, res) => {
  try {
    const { id } = req.params;
    const vault = await Vault.findByIdAndDelete(id);
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }
    res.json({ message: "Vault deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVaultEntry = async (req, res) => {
  try {
    const { vaultId, entryId } = req.params;

    const vault = await Vault.findById(vaultId);
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }

    // Check if user owns the vault
    if (vault.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Remove the entry from the entries array
    const result = await Vault.findByIdAndUpdate(
      vaultId,
      { $pull: { entries: { _id: entryId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVaultById = async (req, res) => {
  try {
    const { id } = req.params;
    const key = req.user.key;
    const vault = await Vault.findById(id);

    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }

    const decryptedEntries = vault.entries.map((entry) => ({
      id: entry._id,
      name: entry.name,
      type: entry.type,
      value: decryptData(entry.value, key),
      createdAt: entry.createdAt,
    }));

    res.json({
      ...vault.toObject(),
      entries: decryptedEntries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In vault.controller.js

export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Count total vaults
    const vaultCount = await Vault.countDocuments({ user: userId });

    // Aggregate daily vault creation counts
    const vaultsByDay = await Vault.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
    const entriesByDay = await Vault.aggregate([
      { $match: { user: userId } },
      { $unwind: "$entries" },
      {
        $group: {
          _id: {
            year: { $year: "$entries.createdAt" },
            month: { $month: "$entries.createdAt" },
            day: { $dayOfMonth: "$entries.createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
    const seedsAndPasswordsByDay = await Vault.aggregate([
      { $match: { user: userId } },
      { $unwind: "$entries" },
      {
        $group: {
          _id: {
            year: { $year: "$entries.createdAt" },
            month: { $month: "$entries.createdAt" },
            day: { $dayOfMonth: "$entries.createdAt" },
            type: "$entries.type",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Aggregate entry counts
    const [entryCountResult] = await Vault.aggregate([
      { $match: { user: userId } },
      { $unwind: "$entries" },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalSeeds: {
            $sum: { $cond: [{ $eq: ["$entries.type", "seed"] }, 1, 0] },
          },
          totalPasswords: {
            $sum: { $cond: [{ $eq: ["$entries.type", "password"] }, 1, 0] },
          },
        },
      },
    ]);

    const entryCount = entryCountResult?.totalEntries || 0;
    const seedCount = entryCountResult?.totalSeeds || 0;
    const passwordCount = entryCountResult?.totalPasswords || 0;

    res.json({
      vaults: vaultCount,
      vaultsByDay,
      entriesByDay,
      seedsAndPasswordsByDay,

      entries: entryCount,
      seeds: seedCount,
      passwords: passwordCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


