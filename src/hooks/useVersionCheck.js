import { useEffect } from "react";

export default function useVersionCheck(interval = 60000, reloadTries = 3, reloadGap = 1500) {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch(`/version.json?ts=${Date.now()}`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch version");
                const data = await res.json();

                const latestBuild = `${data.version}-${data.timestamp}`;
                const currentBuild = localStorage.getItem("app_build");
                let retries = parseInt(localStorage.getItem("reload_retries") || "0", 10);

                if (currentBuild && currentBuild !== latestBuild) {
                    if (retries < reloadTries) {
                        retries++;
                        localStorage.setItem("reload_retries", retries);
                        console.log(`Reload attempt ${retries}`);
                        setTimeout(() => {
                            window.location.href = window.location.pathname + `?v=${Date.now()}`;
                        }, reloadGap);
                    } else {
                        localStorage.removeItem("reload_retries");
                        if (window.confirm("A new version is available. Reload now?")) {
                            window.location.href = window.location.pathname + `?v=${Date.now()}`;
                        }
                    }
                } else {
                    localStorage.removeItem("reload_retries");
                }

                localStorage.setItem("app_build", latestBuild);

            } catch (err) {
                console.error("Version check failed:", err);
            }
        };

        checkVersion();
        const timer = setInterval(checkVersion, interval);
        return () => clearInterval(timer);
    }, [interval, reloadTries, reloadGap]);
}