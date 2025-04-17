import { FC, ComponentType, JSX } from "react";
import { Navigate } from "react-router";

import { useAuth } from "#context/auth-context";
import { RouteNames } from "#router/utils";

function withAuthenticationRequired<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
): FC<P> {
  return (props: P): JSX.Element => {
    const { username } = useAuth();

    if (!username) return <Navigate to={RouteNames.LOGIN} />;

    return <Component {...props} />;
  };
}

interface RouteProps {
  component: ComponentType;
  [x: string]: unknown;
}

const ProtectedRoute = ({ component }: RouteProps) => {
  const Component = withAuthenticationRequired(component);

  return <Component />;
};

export { ProtectedRoute }; // routes
