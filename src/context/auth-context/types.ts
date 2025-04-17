export enum AuthReducerAction {
  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
  CLEAR_ERROR = "CLEAR_ERROR",
}

export interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string) => void;
  logout: () => void;
  clearError: () => void;
}

export type AuthAction =
  | { type: AuthReducerAction.LOGIN_START }
  | { type: AuthReducerAction.LOGIN_SUCCESS; payload: string }
  | { type: AuthReducerAction.LOGIN_FAILURE; payload: string }
  | { type: AuthReducerAction.LOGOUT }
  | { type: AuthReducerAction.CLEAR_ERROR };
