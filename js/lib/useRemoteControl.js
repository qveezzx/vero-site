/**
 * Remote playback via Appwrite Realtime (listener) + Documents (sender).
 * Not a React hook — plain module API named for parity with requested design.
 */
import { Realtime, Channel, ID } from 'appwrite';
import { client, databases } from '../accounts/config.js';
import {
    REMOTE_DATABASE_ID,
    REMOTE_PLAYBACK_COLLECTION_ID,
    getAppwriteConnectionEnv,
} from './remote-appwrite.js';
import { getRemoteRole, isRemoteListenerActive, isRemoteModeEnabled } from './remotePlaybackFlags.js';

const LS_DEVICE_ID = 'vero-remote-device-id';
const LS_TARGET_ID = 'vero-remote-target-device-id';

let realtimeInstance = null;
/** @type {import('appwrite').RealtimeSubscription | null} */
let playbackSubscription = null;
/** @type {any} */
let boundPlayer = null;

function getRealtime() {
    if (!realtimeInstance) {
        realtimeInstance = new Realtime(client);
    }
    return realtimeInstance;
}

export function getOrCreateLocalDeviceId() {
    try {
        let id = localStorage.getItem(LS_DEVICE_ID);
        if (!id) {
            id = ID.unique();
            localStorage.setItem(LS_DEVICE_ID, id);
        }
        return id;
    } catch {
        return ID.unique();
    }
}

export function getTargetDeviceId() {
    try {
        return localStorage.getItem(LS_TARGET_ID) || '';
    } catch {
        return '';
    }
}

function dispatchPlaybackCommand(player, command) {
    if (!player) return;
    switch (command) {
        case 'playPause':
            player.handlePlayPause();
            break;
        case 'play':
            if (player.activeElement?.paused) {
                player.safePlay(player.activeElement).catch(() => {});
            }
            break;
        case 'pause':
            player.activeElement?.pause?.();
            player.saveQueueState();
            break;
        case 'next':
            player.playNext(0);
            break;
        case 'prev':
            player.playPrev(0);
            break;
        case 'seekForward':
            player.seekForward(10);
            break;
        case 'seekBackward':
            player.seekBackward(10);
            break;
        default:
            console.warn('[RemoteControl] Unknown command:', command);
    }
}

function extractDocumentPayload(event) {
    const p = event?.payload;
    if (!p || typeof p !== 'object') return null;
    if (p.command !== undefined && p.deviceID !== undefined) return p;
    if (p.payload && typeof p.payload === 'object') return p.payload;
    return p;
}

async function startListener() {
    await stopListener();
    if (!isRemoteListenerActive() || !boundPlayer) return;

    const { endpoint, projectId } = getAppwriteConnectionEnv();
    if (!endpoint || !projectId) {
        console.warn('[RemoteControl] Missing Appwrite endpoint/project; cannot subscribe.');
        return;
    }

    const localId = getOrCreateLocalDeviceId();
    const channel = Channel.database(REMOTE_DATABASE_ID)
        .collection(REMOTE_PLAYBACK_COLLECTION_ID)
        .document()
        .create();

    try {
        playbackSubscription = await getRealtime().subscribe(channel, (event) => {
            const doc = extractDocumentPayload(event);
            if (!doc) return;
            const targetId = doc.deviceID;
            const command = doc.command;
            if (!targetId || !command) return;
            if (targetId !== localId) return;
            dispatchPlaybackCommand(boundPlayer, String(command));
        });
    } catch (e) {
        console.error('[RemoteControl] Realtime subscribe failed:', e);
    }
}

async function stopListener() {
    if (playbackSubscription) {
        try {
            await playbackSubscription.close();
        } catch {
            /* ignore */
        }
        playbackSubscription = null;
    }
}

/**
 * Sender: write a playback command for the target device (listener's device ID).
 * @param {string} command
 */
export async function sendRemoteCommand(command) {
    const target = getTargetDeviceId().trim();
    if (!target) {
        console.warn('[RemoteControl] Set "Target device ID" in Settings → Audio (remote section).');
        return;
    }

    try {
        await databases.createDocument(
            REMOTE_DATABASE_ID,
            REMOTE_PLAYBACK_COLLECTION_ID,
            ID.unique(),
            {
                command: String(command),
                deviceID: target,
                timestamp: new Date().toISOString(),
            }
        );
    } catch (e) {
        console.error('[RemoteControl] sendRemoteCommand failed:', e);
    }
}

/**
 * Call after Player is ready and when remote settings change.
 * @param {any} player
 */
export function initRemoteControl(player) {
    boundPlayer = player;
    void refreshRemoteControlState();
}

export async function refreshRemoteControlState() {
    if (!isRemoteModeEnabled()) {
        await stopListener();
        return;
    }
    if (getRemoteRole() === 'listener') {
        await startListener();
    } else {
        await stopListener();
    }
}
