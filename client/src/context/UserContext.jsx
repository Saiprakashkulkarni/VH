import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getHealth, authGetMe } from '../services/api';

const UserContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- useUser hook must be co-located with its context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be inside UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('votepath_token'));
  const [aiStatus, setAiStatus] = useState({ ollama: false, gemini: false, activeProvider: null });
  const [loading, setLoading] = useState(true); // true until we've checked auth

  /**
   * Clear all auth state and remove persisted tokens.
   * Defined with useCallback so it can be safely referenced in effects.
   */
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setChecklist(null);
    localStorage.removeItem('votepath_token');
    localStorage.removeItem('votepath_user');
  }, []);

  // On mount: verify stored token by calling /auth/me
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('votepath_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authGetMe();
        if (data.success) {
          setUser(data.data.user);
          setChecklist(data.data.checklist);
          setToken(storedToken);
        } else {
          clearAuth();
        }
      } catch {
        // Token expired or invalid — clear auth silently
        clearAuth();
      }
      setLoading(false);
    };

    verifyAuth();
  }, [clearAuth]);

  // Poll AI health every 30 seconds
  useEffect(() => {
    const checkAI = async () => {
      try {
        const { data } = await getHealth();
        if (data.success) setAiStatus(data.ai);
      } catch {
        // Backend health check failed silently — AI status remains at defaults
      }
    };
    checkAI();
    const interval = setInterval(checkAI, 30000);
    return () => clearInterval(interval);
  }, []);

  const loginUser = (userData, authToken, checklistData = null) => {
    setUser(userData);
    setToken(authToken);
    setChecklist(checklistData);
    localStorage.setItem('votepath_token', authToken);
    localStorage.setItem('votepath_user', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('votepath_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    clearAuth();
  };

  const updateReadinessScore = (score) => {
    if (user) setUser(prev => ({ ...prev, readinessScore: score }));
  };

  return (
    <UserContext.Provider value={{
      user, setUser, checklist, setChecklist, token,
      aiStatus, setAiStatus, loading, setLoading,
      loginUser, logoutUser, updateUser, updateReadinessScore,
    }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  /** Application subtree that gains access to the user context */
  children: PropTypes.node.isRequired,
};

export default UserContext;
