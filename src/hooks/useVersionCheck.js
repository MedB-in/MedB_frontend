import { useEffect } from "react";

export default function useVersionCheck(interval = 60000) {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch('/version.json', { cache: 'no-store' });
                if (!res.ok) {
                    throw new Error(`HTTP error ${res.status}`);
                }
                const text = await res.text();
                if (!text) {
                    throw new Error("Empty version.json");
                }
                const { version } = JSON.parse(text);
                const current = localStorage.getItem('appVersion');
                if (current && current !== version) {
                    if (window.confirm('A new version is available. Refresh now?')) {
                        window.location.reload(true);
                    }
                }
                localStorage.setItem('appVersion', version);
            } catch (err) {
                console.error('Failed to check version', err);
            }
        };

        checkVersion();
        const timer = setInterval(checkVersion, interval);
        return () => clearInterval(timer);
    }, []);
}