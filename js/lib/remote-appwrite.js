/**
 * Appwrite database used for Spotify Connect–style remote playback commands.
 *
 * Endpoint / project: same as auth (`js/accounts/config.js`). At build time set either:
 * - VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, or
 * - APPWRITE_* via the auth-gate plugin (window.__APPWRITE_*).
 */
export const REMOTE_DATABASE_ID = '69c82f11002de0a08d61';
export const REMOTE_PLAYBACK_COLLECTION_ID = 'playback';

/** @returns {{ endpoint: string, projectId: string }} */
export function getAppwriteConnectionEnv() {
    const endpoint =
        import.meta.env.VITE_APPWRITE_ENDPOINT ||
        import.meta.env.APPWRITE_ENDPOINT ||
        (typeof window !== 'undefined' && window.__APPWRITE_ENDPOINT__) ||
        '';
    const projectId =
        import.meta.env.VITE_APPWRITE_PROJECT_ID ||
        import.meta.env.APPWRITE_PROJECT_ID ||
        (typeof window !== 'undefined' && window.__APPWRITE_PROJECT_ID__) ||
        '';
    return { endpoint, projectId };
}
