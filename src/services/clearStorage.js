const clearStorage = () => {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && /[a-zA-Z]/.test(key)) {
            sessionStorage.removeItem(key);
            i--;
        }
    }
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && /[a-zA-Z]/.test(key)) {
            localStorage.removeItem(key);
            i--;
        }
    }
    sessionStorage.setItem('navStack', JSON.stringify([]));
    localStorage.clear();
    sessionStorage.clear();
};

export default clearStorage;