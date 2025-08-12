import { useEffect } from "react";

export default function useVersionCheck(interval = 60000) {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch(`/version.json?ts=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);

                const { version, timestamp } = await res.json();
                const stored = localStorage.getItem('appVersion');

                if (stored && stored !== `${version}-${timestamp}`) {
                    if (window.confirm('A new version is available. Refresh now?')) {
                        window.location.reload(true);
                    }
                }

                localStorage.setItem('appVersion', `${version}-${timestamp}`);

            } catch (err) {
                console.error('Failed to check version', err);
            }
        };

        checkVersion();
        const timer = setInterval(checkVersion, interval);
        return () => clearInterval(timer);
    }, []);
}