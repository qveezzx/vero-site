const MOBILE_MAX_WIDTH = 768;

const LS_ENABLED = 'vero-remote-enabled';
const LS_ROLE = 'vero-remote-role'; // '', 'listener', 'sender', or 'auto'

export function isRemoteModeEnabled() {
    try {
        return localStorage.getItem(LS_ENABLED) === '1';
    } catch {
        return false;
    }
}

/**
 * listener = this device plays audio and executes remote commands.
 * sender = this device sends commands only (no local playback for transport).
 */
export function getRemoteRole() {
    try {
        const r = localStorage.getItem(LS_ROLE);
        if (r === 'listener' || r === 'sender') return r;
    } catch {
        /* ignore */
    }
    return window.innerWidth <= MOBILE_MAX_WIDTH ? 'sender' : 'listener';
}

export function isRemoteListenerActive() {
    return isRemoteModeEnabled() && getRemoteRole() === 'listener';
}

export function isRemoteSenderActive() {
    return isRemoteModeEnabled() && getRemoteRole() === 'sender';
}

/** Block starting / toggling local audio when acting as the remote control only. */
export function shouldBlockLocalPlaybackForRemote() {
    return isRemoteSenderActive();
}
