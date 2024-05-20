// src/cleanup.js

const fs = require('fs-extra');

const directories = ['./uploads/image', './uploads/videos'];

async function cleanup() {
  for (const dir of directories) {
    try {
      await fs.emptyDir(dir);
      console.log(`Successfully cleaned up ${dir}`);
    } catch (err) {
      console.error(`Error while cleaning up ${dir}:`, err);
    }
  }
}

cleanup();