import React, { useState, useEffect } from 'react';

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choiceResult) => {
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <div className='text-center text-sm'>
            <button onClick={handleInstallClick}>Install</button>
        </div>
    );
};

export default PWAInstallButton;
