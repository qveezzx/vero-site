/**
 * Modified by qveezzx on 03.28.2026-03.29.2026 and later
 */
import { spawnSync } from 'node:child_process';

process.env.VERO_DESKTOP_BUILD = '1';
const result = spawnSync('vite', ['build'], { stdio: 'inherit', shell: true, env: process.env });
process.exit(result.status === null ? 1 : result.status);
