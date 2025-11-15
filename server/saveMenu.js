#!/usr/bin/env node
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DATA_FILE = path.resolve(process.cwd(), "data/menus.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch (e) {
      // create initial array file
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (error) {
    console.error("Failed to ensure data file:", error);
    throw error;
  }
}

app.post("/api/menus", async (req, res) => {
  try {
    await ensureDataFile();
    const incoming = req.body;
    const existingRaw = await fs.readFile(DATA_FILE, "utf8");
    let arr = [];
    try {
      arr = JSON.parse(existingRaw);
      if (!Array.isArray(arr)) arr = [];
    } catch (e) {
      arr = [];
    }

    const entry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      data: incoming,
    };
    arr.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), "utf8");
    res.status(201).json({ success: true, entry });
  } catch (error) {
    console.error("Failed to save menu:", error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get("/api/menus", async (req, res) => {
  try {
    await ensureDataFile();
    const existingRaw = await fs.readFile(DATA_FILE, "utf8");
    const arr = JSON.parse(existingRaw);
    res.json({ success: true, items: arr });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Local menu save server listening at http://localhost:${PORT}`);
});
