import { readdir, mkdir, copyFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const distDir = join(projectRoot, 'dist');

async function copyRecursive(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyRecursive(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  try {
    console.log('Building marketing site...');
    
    // Ensure dist directory exists
    await mkdir(distDir, { recursive: true });
    
    // Copy all files from public to dist
    await copyRecursive(publicDir, distDir);
    
    console.log('Build complete! Files copied to dist/');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

