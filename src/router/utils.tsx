import { RouteObject } from "react-router";
//
import HomePage from "#pages/home";
import LoginPage from "#pages/login";
import { ProtectedRoute } from "./private-rotes";

export enum RouteNames {
  HOME = "/",
  LOGIN = "/login",
  NOT_FOUND = "/404",
}

export const routes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <ProtectedRoute component={HomePage} />,
  },
  {
    path: RouteNames.LOGIN,
    Component: LoginPage,
  },
];
