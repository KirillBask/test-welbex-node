import { BlogController } from "../controllers/BlogController"
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

export const BlogRoutes = [
  {
    method: "post",
    route: "/createBlog",
    middleware: AuthMiddleware,
    controller: BlogController,
    action: "createBlog",
  },
  {
    method: "get",
    route: "/getBlogs",
    middleware: AuthMiddleware,
    controller: BlogController,
    action: "getBlogs",
  },
  {
    method: "put",
    route: "/updateBlog/:id",
    middleware: AuthMiddleware,
    controller: BlogController,
    action: "updateBlog",
  },
  {
    method: "delete",
    route: "/deleteBlog/:id",
    middleware: AuthMiddleware,
    controller: BlogController,
    action: "deleteBlog",
  },
];