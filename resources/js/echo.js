// resources/js/echo.js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';
const port   = Number(import.meta.env.VITE_REVERB_PORT) || 8085;
const envHost = (import.meta.env.VITE_REVERB_HOST ?? '').replace(/"/g, '');

// Jika envHost bukan localhost dan tidak kosong, gunakan envHost.
// Jika localhost atau dibuka dari IP lain (seperti HP), gunakan window.location.hostname agar selalu cocok dengan IP server.
const host = (envHost && envHost !== 'localhost' && envHost !== '127.0.0.1')
    ? envHost
    : (typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost');

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: scheme === 'https' ? ['wss'] : ['ws'],
    authEndpoint: '/broadcasting/auth',
});
