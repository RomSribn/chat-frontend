import React, { createContext, useReducer, useCallback, useMemo } from "react";

import { AuthContextType, AuthReducerAction } from "./types";
import { authReducer, initialAuthState } from "./reducer";

const initialContextValue: AuthContextType = {
  username: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: () => {},
  logout: () => {},
  clearError: () => {},
};

const AuthContext = createContext<AuthContextType>(initialContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = useCallback((username: string) => {
    dispatch({ type: AuthReducerAction.LOGIN_START });

    try {
      dispatch({ type: AuthReducerAction.LOGIN_SUCCESS, payload: username });
    } catch (error) {
      dispatch({
        type: AuthReducerAction.LOGIN_FAILURE,
        payload: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: AuthReducerAction.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AuthReducerAction.CLEAR_ERROR });
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      logout,
      clearError,
    }),
    [state, login, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
