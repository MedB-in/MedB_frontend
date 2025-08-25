import { useRegisterSW } from 'virtual:pwa-register/react';

export default function usePWAUpdater() {
    const {
        needRefresh,
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            // console.log("✅ Service worker registered");
        },
        onNeedRefresh() {
            console.log("⚡ New service worker available!");
            updateServiceWorker(true);
        },
        onOfflineReady() {
            // console.log("📴 App ready to work offline");
        },
    });

    return { needRefresh, updateServiceWorker };
}