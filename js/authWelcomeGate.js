/** First-visit modal: sign in or continue as guest (persists in localStorage). */

export const AUTH_WELCOME_DISMISSED_KEY = 'vero-auth-welcome-dismissed';

export const EMAIL_AUTH_MODAL_CLOSED_EVENT = 'vero-email-auth-modal-closed';

/**
 * @param {{ user: unknown; signInWithGoogle: () => void; signInWithGitHub: () => void; signInWithDiscord: () => void; onAuthStateChanged: (cb: (user: unknown) => void) => void }} authManager
 */
export function setupAuthWelcomeGate(authManager) {
    const gate = document.getElementById('auth-welcome-gate-modal');
    const emailModal = document.getElementById('email-auth-modal');
    if (!gate) return;

    const hideGate = () => gate.classList.remove('active');
    const showGate = () => gate.classList.add('active');

    const shouldShow = () => {
        if (window.__AUTH_GATE__) return false;
        try {
            if (localStorage.getItem(AUTH_WELCOME_DISMISSED_KEY) === '1') return false;
        } catch {
            /* ignore */
        }
        return !authManager.user;
    };

    const sync = () => {
        if (!shouldShow()) {
            hideGate();
            return;
        }
        if (emailModal?.classList.contains('active')) {
            hideGate();
            return;
        }
        showGate();
    };

    document.getElementById('auth-welcome-google')?.addEventListener('click', () => {
        authManager.signInWithGoogle();
    });
    document.getElementById('auth-welcome-github')?.addEventListener('click', () => {
        authManager.signInWithGitHub();
    });
    document.getElementById('auth-welcome-discord')?.addEventListener('click', () => {
        authManager.signInWithDiscord();
    });
    document.getElementById('auth-welcome-email')?.addEventListener('click', () => {
        hideGate();
        emailModal?.classList.add('active');
    });
    document.getElementById('auth-welcome-guest')?.addEventListener('click', () => {
        try {
            localStorage.setItem(AUTH_WELCOME_DISMISSED_KEY, '1');
        } catch {
            /* ignore */
        }
        hideGate();
    });

    authManager.onAuthStateChanged(() => {
        if (authManager.user) {
            try {
                localStorage.setItem(AUTH_WELCOME_DISMISSED_KEY, '1');
            } catch {
                /* ignore */
            }
        }
        sync();
    });

    document.addEventListener(EMAIL_AUTH_MODAL_CLOSED_EVENT, () => {
        sync();
    });

    sync();
}
