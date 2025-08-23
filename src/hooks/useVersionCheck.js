import { useEffect } from "react";

export default function useVersionCheck(interval = 60000, reloadTries = 3, reloadGap = 1500) {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch(`/version.json?ts=${Date.now()}`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch version");
                const data = await res.json();

                const currentVersion = localStorage.getItem("app_version");
                let retries = parseInt(localStorage.getItem("reload_retries") || "0", 10);

                if (currentVersion && currentVersion !== data.version) {
                    if (retries < reloadTries) {
                        retries++;
                        localStorage.setItem("reload_retries", retries);
                        console.log(`Reload attempt ${retries}`);

                        setTimeout(() => {
                            window.location.href =
                                window.location.pathname + `?v=${Date.now()}`;
                        }, reloadGap);
                    } else {
                        localStorage.removeItem("reload_retries");
                        if (window.confirm("A new version is available. Reload now?")) {
                            window.location.href =
                                window.location.pathname + `?v=${Date.now()}`;
                        }
                    }
                } else {
                    localStorage.removeItem("reload_retries");
                }

                localStorage.setItem("app_version", data.version);

            } catch (err) {
                console.error("Version check failed:", err);
            }
        };

        checkVersion();
        const timer = setInterval(checkVersion, interval);
        return () => clearInterval(timer);
    }, [interval, reloadTries, reloadGap]);
}