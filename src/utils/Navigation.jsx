import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();
const MAX_STACK_SIZE = 30;

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [stack, setStack] = useState(() => {
    const saved = sessionStorage.getItem('navStack');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const isAppRoute = location.pathname.startsWith('/app');

    if (isAppRoute) {
      setStack((prev) => {
        if (prev[prev.length - 1] !== location.pathname) {
          const updated = [...prev, location.pathname];
          const trimmed = updated.slice(-MAX_STACK_SIZE);
          sessionStorage.setItem('navStack', JSON.stringify(trimmed));
          return trimmed;
        }
        return prev;
      });
    }
  }, [location.pathname]);

  const clearRouteStack = () => {
    sessionStorage.removeItem('navStack');
    setStack([]);
  };

  const goBackAndNavigate = () => {
    const saved = sessionStorage.getItem('navStack');
    if (saved) {
      const parsed = JSON.parse(saved);
      let i = parsed.length - 2;
      const current = parsed[parsed.length - 1];

      while (i >= 0 && parsed[i] === current) {
        i--;
      }

      if (i >= 0) {
        const previous = parsed[i];
        const updated = parsed.slice(0, i + 1);
        sessionStorage.setItem('navStack', JSON.stringify(updated));
        setStack(updated);
        return previous;
      }
    }

    return '/app';
  };

  return (
    <NavigationContext.Provider value={{ stack, goBackAndNavigate, clearRouteStack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);