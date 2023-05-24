import { UserController } from "../controllers/UserController"

export const UserRoutes = [
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
  },
  {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
  },
  {
    method: "post",
    route: "/register",
    controller: UserController,
    action: "registration",
  },
  {
    method: "post",
    route: "/login",
    controller: UserController,
    action: "login",
  },
  {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
  },
];