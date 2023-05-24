import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data/data-source";
import { UserRoutes } from "./routes/UserRoutes";
import { BlogRoutes } from "./routes/BlogRoutes";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    app.use(bodyParser.json());

    UserRoutes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            if (result !== null && result !== undefined) {
              res.json(result);
            }
          } catch (err) {
            next(err);
          }
        }
      );
    });

    BlogRoutes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        AuthMiddleware(
          async (req: Request, res: Response, next: Function) => {
            try {
              const result = await new (route.controller as any)()[
                route.action
              ](req, res, next);
              if (result !== null && result !== undefined) {
                res.json(result);
              }
            } catch (err) {
              next(err);
            }
          }
        )
      );
    });

    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
