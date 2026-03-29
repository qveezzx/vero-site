// js/desktop/discord-rpc.js
import { getTrackTitle, getTrackArtists, getShareUrl } from '../utils.js';
import { authManager } from '../accounts/auth.js';
import { syncManager } from '../accounts/pocketbase.js';

export function initializeDiscordRPC(player) {
    const EXTENSION_ID = 'js.neutralino.discordrpc';
    let cachedProfileUrl = null;

    async function getProfileUrl() {
        if (cachedProfileUrl) return cachedProfileUrl;
        if (!authManager.user) return null;

        try {
            const data = await syncManager.getUserData();
            if (data?.profile?.username) {
                cachedProfileUrl = getShareUrl(`user/@${data.profile.username}`);
                return cachedProfileUrl;
            }
        } catch (e) {
            console.error('Failed to get user data for RPC', e);
        }
        return null;
    }

    async function sendUpdate(track, isPaused = false) {
        if (!track) return;

        let coverUrl = 'vero';
        if (track.album?.cover) {
            const coverId = String(track.album.cover).replace(/-/g, '/');
            coverUrl = `https://resources.tidal.com/images/${coverId}/320x320.jpg`;
        }

        const profileUrl = await getProfileUrl();

        const data = {
            details: getTrackTitle(track),
            state: `by ${getTrackArtists(track)}`,
            largeImageKey: coverUrl,
            largeImageText: track.album?.title || 'Vero Lossless',
            smallImageKey: 'vero',
            smallImageText: isPaused ? 'Paused on Vero' : 'Listening on Vero',
            instance: false,
            profileUrl: profileUrl
        };

        if (track.album?.title && track.album.title !== track.title) {
            data.state = `${getTrackArtists(track)} — ${track.album.title}`;
        }

        if (!isPaused && track.duration) {
            const now = Date.now();
            const elapsed = player.audio.currentTime * 1000;
            const remaining = (track.duration - player.audio.currentTime) * 1000;

            data.startTimestamp = Math.floor((now - elapsed) / 1000);
            data.endTimestamp = Math.floor((now + remaining) / 1000);
        }

        Neutralino.events.broadcast('discord:update', data).catch((e) => console.error('Broadcast failed', e));
        Neutralino.extensions
            .dispatch(EXTENSION_ID, 'discord:update', data)
            .catch((e) => console.error('Dispatch failed', e));
    }

    player.audio.addEventListener('play', async () => {
        await sendUpdate(player.currentTrack);
    });

    player.audio.addEventListener('pause', async () => {
        await sendUpdate(player.currentTrack, true);
    });

    player.audio.addEventListener('loadedmetadata', async () => {
        if (!player.audio.paused) {
            await sendUpdate(player.currentTrack);
        }
    });

    authManager.onAuthStateChanged(() => {
        cachedProfileUrl = null;
        if (player.currentTrack) {
            sendUpdate(player.currentTrack, player.audio.paused);
        }
    });

    // Send initial status
    if (player.currentTrack) {
        sendUpdate(player.currentTrack, player.audio.paused);
    } else {
        getProfileUrl().then(profileUrl => {
            Neutralino.events
                .broadcast('discord:update', {
                    details: 'Idling',
                    state: 'Vero',
                    largeImageKey: 'vero',
                    largeImageText: 'Vero Lossless',
                    smallImageKey: 'vero',
                    smallImageText: 'Vero',
                    profileUrl: profileUrl
                })
                .catch(() => {});
        });
    }
}
