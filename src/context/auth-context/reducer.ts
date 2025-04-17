import { AuthState, AuthAction, AuthReducerAction } from "./types";

export const initialAuthState: AuthState = {
  username: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthReducerAction.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AuthReducerAction.LOGIN_SUCCESS:
      return {
        ...state,
        username: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AuthReducerAction.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case AuthReducerAction.LOGOUT:
      return {
        ...state,
        username: null,
        isAuthenticated: false,
      };
    case AuthReducerAction.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
