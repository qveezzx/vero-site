/**
 * Sets VERO_DESKTOP_BUILD so vite injects __neutralino_globals.js (see vite.config.ts).
 */
import { spawnSync } from 'node:child_process';

process.env.VERO_DESKTOP_BUILD = '1';
const result = spawnSync('vite', ['build'], { stdio: 'inherit', shell: true, env: process.env });
process.exit(result.status === null ? 1 : result.status);
